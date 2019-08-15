---
title: Setting up tensorflow to run on a nvidia gpu 
date: 2018-01-27 17:26:57
tags:
- performance
- gpu
- cuda
- nvidia
- tensorflow
- deep-learning
- machine-learning
---

Nowadays, there are have massive amounts of structured and unstructured data and good hardware resources, which makes it ideal for resource-hungry algorithms, such as deep neural networks, that usually need huge amounts of data. Furthermore, libraries such as [Tensorflow](https://www.tensorflow.org) are a great boost in the development and deploy of accurate models. While Tensorflow can run on a typical CPU, for the best performance and reduced training/inference time we may run it on a GPU. Libraries such as NVIDIA CUDA Deep Neural Network library (cuDNN) greatly optimize low-level computations, such as complex matrix operations and deliver very good performance speedups. 
Before we can use Tensorflow we need to setup the cuDNN library. This post demonstrates a common scenario where we setup an Amazon GPU instance (p3.2xlarge), running a Ubuntu 16.04 x86_64 distribution with a NVIDIA Tesla V100.


## Install the CUDA Toolkit

```bash
mkdir cuda
cd cuda
wget http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_9.0.176-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu1604_9.0.176-1_amd64.deb
sudo apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/7fa2af80.pub
sudo apt-get update
sudo apt-get install cuda-9-0
```

## Setup the environment variables

```bash
export PATH=/usr/local/cuda-9.0/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-9.0/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
export CUDA_HOME=/usr/local/cuda-9.0/
```

## Compile samples and test them

```bash
cp -r /usr/local/cuda-9.0/samples $HOME/cuda
cd samples
make clean && make
```

## Check installation by running _deviceQuery_ and _bandwidthTest_

You should see an output similar to these ones:

```
cd bin/
./deviceQuery

	./deviceQuery Starting...

	 CUDA Device Query (Runtime API) version (CUDART static linking)

	Detected 1 CUDA Capable device(s)

	Device 0: "Tesla V100-SXM2-16GB"
	  CUDA Driver Version / Runtime Version          9.0 / 9.0
	  CUDA Capability Major/Minor version number:    7.0
	  Total amount of global memory:                 16160 MBytes (16945512448 bytes)
	  (80) Multiprocessors, ( 64) CUDA Cores/MP:     5120 CUDA Cores
	  GPU Max Clock rate:                            1530 MHz (1.53 GHz)
	  Memory Clock rate:                             877 Mhz
	  Memory Bus Width:                              4096-bit
	  L2 Cache Size:                                 6291456 bytes
	  Maximum Texture Dimension Size (x,y,z)         1D=(131072), 2D=(131072, 65536), 3D=(16384, 16384, 16384)
	  Maximum Layered 1D Texture Size, (num) layers  1D=(32768), 2048 layers
	  Maximum Layered 2D Texture Size, (num) layers  2D=(32768, 32768), 2048 layers
	  Total amount of constant memory:               65536 bytes
	  Total amount of shared memory per block:       49152 bytes
	  Total number of registers available per block: 65536
	  Warp size:                                     32
	  Maximum number of threads per multiprocessor:  2048
	  Maximum number of threads per block:           1024
	  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
	  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
	  Maximum memory pitch:                          2147483647 bytes
	  Texture alignment:                             512 bytes
	  Concurrent copy and kernel execution:          Yes with 2 copy engine(s)
	  Run time limit on kernels:                     No
	  Integrated GPU sharing Host Memory:            No
	  Support host page-locked memory mapping:       Yes
	  Alignment requirement for Surfaces:            Yes
	  Device has ECC support:                        Enabled
	  Device supports Unified Addressing (UVA):      Yes
	  Supports Cooperative Kernel Launch:            Yes
	  Supports MultiDevice Co-op Kernel Launch:      Yes
	  Device PCI Domain ID / Bus ID / location ID:   0 / 0 / 30
	  Compute Mode:
	     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

	deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 9.0, CUDA Runtime Version = 9.0, NumDevs = 1
	Result = PASS
```

```
./bandwidthTest

	[CUDA Bandwidth Test] - Starting...
	Running on...

	 Device 0: Tesla V100-SXM2-16GB
	 Quick Mode

	 Host to Device Bandwidth, 1 Device(s)
	 PINNED Memory Transfers
	   Transfer Size (Bytes)	Bandwidth(MB/s)
	   33554432			10817.1

	 Device to Host Bandwidth, 1 Device(s)
	 PINNED Memory Transfers
	   Transfer Size (Bytes)	Bandwidth(MB/s)
	   33554432			12143.6

	 Device to Device Bandwidth, 1 Device(s)
	 PINNED Memory Transfers
	   Transfer Size (Bytes)	Bandwidth(MB/s)
	   33554432			742271.1

	Result = PASS

	NOTE: The CUDA Samples are not meant for performance measurements. Results may vary when GPU Boost is enabled.
```


## Install cuDNN

```bash
wget https://developer.nvidia.com/compute/machine-learning/cudnn/secure/v7.1.1/prod/9.1_20180214/Ubuntu16_04-x64/libcudnn7_7.1.1.5-1+cuda9.1_amd64
wget https://developer.nvidia.com/compute/machine-learning/cudnn/secure/v7.1.1/prod/9.1_20180214/Ubuntu16_04-x64/libcudnn7-dev_7.1.1.5-1+cuda9.1_amd64
wget https://developer.nvidia.com/compute/machine-learning/cudnn/secure/v7.1.1/prod/9.1_20180214/Ubuntu16_04-x64/libcudnn7-doc_7.1.1.5-1+cuda9.1_amd64

sudo dpkg -i libcudnn7_7.1.1.5-1+cuda9.1_amd64.deb
sudo dpkg -i libcudnn7-dev_7.1.1.5-1+cuda9.1_amd64.deb
sudo dpkg -i libcudnn7-doc_7.1.1.5-1+cuda9.1_amd64.deb
```

## Compile samples and test them

```bash
cp -r /usr/src/cudnn_samples_v7/ $HOME/cuda
cd cudnn_samples_v7/mnistCUDNN/
make clean && make
```

## Check installation by running _mnistCUDNN_

You should see an output similar to these ones:

```bash
./mnistCUDNN
	cudnnGetVersion() : 7101 , CUDNN_VERSION from cudnn.h : 7101 (7.1.1)
	Host compiler version : GCC 5.4.0
	There are 1 CUDA capable devices on your machine :
	device 0 : sms 80  Capabilities 7.0, SmClock 1530.0 Mhz, MemSize (Mb) 16160, MemClock 877.0 Mhz, Ecc=1, boardGroupID=0
	Using device 0

	Testing single precision
	Loading image data/one_28x28.pgm
	Performing forward propagation ...
	Testing cudnnGetConvolutionForwardAlgorithm ...
	Fastest algorithm is Algo 5
	Testing cudnnFindConvolutionForwardAlgorithm ...
	^^^^ CUDNN_STATUS_SUCCESS for Algo 0: 0.026624 time requiring 0 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 1: 0.046080 time requiring 3464 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 2: 0.046080 time requiring 57600 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 7: 0.062464 time requiring 2057744 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 5: 0.078848 time requiring 203008 memory
	Resulting weights from Softmax:
	0.0000000 0.9999399 0.0000000 0.0000000 0.0000561 0.0000000 0.0000012 0.0000017 0.0000010 0.0000000 
	Loading image data/three_28x28.pgm
	Performing forward propagation ...
	Resulting weights from Softmax:
	0.0000000 0.0000000 0.0000000 0.9999288 0.0000000 0.0000711 0.0000000 0.0000000 0.0000000 0.0000000 
	Loading image data/five_28x28.pgm
	Performing forward propagation ...
	Resulting weights from Softmax:
	0.0000000 0.0000008 0.0000000 0.0000002 0.0000000 0.9999820 0.0000154 0.0000000 0.0000012 0.0000006 

	Result of classification: 1 3 5

	Test passed!

	Testing half precision (math in single precision)
	Loading image data/one_28x28.pgm
	Performing forward propagation ...
	Testing cudnnGetConvolutionForwardAlgorithm ...
	Fastest algorithm is Algo 5
	Testing cudnnFindConvolutionForwardAlgorithm ...
	^^^^ CUDNN_STATUS_SUCCESS for Algo 0: 0.024576 time requiring 0 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 2: 0.044032 time requiring 28800 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 1: 0.048128 time requiring 3464 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 7: 0.058368 time requiring 2057744 memory
	^^^^ CUDNN_STATUS_SUCCESS for Algo 5: 0.077824 time requiring 203008 memory
	Resulting weights from Softmax:
	0.0000001 1.0000000 0.0000001 0.0000000 0.0000558 0.0000001 0.0000011 0.0000017 0.0000010 0.0000001 
	Loading image data/three_28x28.pgm
	Performing forward propagation ...
	Resulting weights from Softmax:
	0.0000000 0.0000000 0.0000000 1.0000000 0.0000000 0.0000703 0.0000000 0.0000000 0.0000000 0.0000000 
	Loading image data/five_28x28.pgm
	Performing forward propagation ...
	Resulting weights from Softmax:
	0.0000000 0.0000008 0.0000000 0.0000002 0.0000000 1.0000000 0.0000154 0.0000000 0.0000012 0.0000006 

	Result of classification: 1 3 5

	Test passed!
```

## Install final command line utilities and setup LD_LIBRARY_PATH

```bash
sudo apt-get install cuda-command-line-tools-9-1
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda/extras/CUPTI/lib64
```

## Check tensorflow is running on a GPU

```bash
pip install --upgrade tensorflow-gpu
python

import tensorflow as tf
sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))

	2018-03-20 16:43:50.112739: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:898] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
	2018-03-20 16:43:50.112955: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1212] Found device 0 with properties: 
	name: Tesla V100-SXM2-16GB major: 7 minor: 0 memoryClockRate(GHz): 1.53
	pciBusID: 0000:00:1e.0
	totalMemory: 15.78GiB freeMemory: 307.94MiB
	2018-03-20 16:43:50.112982: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1312] Adding visible gpu devices: 0
	2018-03-20 16:43:50.802739: I tensorflow/core/common_runtime/gpu/gpu_device.cc:993] Creating TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 10 MB memory) -> physical GPU (device: 0, name: Tesla V100-SXM2-16GB, pci bus id: 0000:00:1e.0, compute capability: 7.0)
	Device mapping:
	/job:localhost/replica:0/task:0/device:GPU:0 -> device: 0, name: Tesla V100-SXM2-16GB, pci bus id: 0000:00:1e.0, compute capability: 7.0
	2018-03-20 16:43:50.805298: I tensorflow/core/common_runtime/direct_session.cc:297] Device mapping:
	/job:localhost/replica:0/task:0/device:GPU:0 -> device: 0, name: Tesla V100-SXM2-16GB, pci bus id: 0000:00:1e.0, compute capability: 7.0
```

From the output logs, we can see that Tensorflow detected our GPU device. We can now train our models on the GPU and accelerate the training time. 
