---
title: Building a machine-learning pipeline with scikit-learn and Qt - Part IV
date: 2017-09-09 10:15:41
tags: 
- python
- machine-learning
- scikit-learn
- qt5
---

[Part III](/2017/09/03/ml-pipeline-3/) explored data visualization and distribution methods. This article shows a list of common preprocessing methods that may be applied.

![](/images/ml-pipeline/preprocessing.png)

## Dataset Transformation

Some learning algorithms do not deal with certain types of data. In order to be able to use them, the type of the attributes might be transformed to another suitable type. For example converting symbolic features to equivalent numeric features, or the other way around. Another important issue to consider is the normalization of the data, such as converting different attributes to the same scale, avoiding the dominance of some attributes and decreasing the dispersion of the data. 

* **Standardization** - Standardization transforms each feature by removing their mean and diving non-constant features by their standard deviation, obtaining data normally distributed with zero mean and unit variance.

* **Normalization** - Normalization involves scaling samples/features vectors to have unit norm, usually achieved by diving by the euclidean norm of the vector.

* **Scaling** - Scaling transform the features to lie between a minimum and a maximum value. Typical ranges are [0,1] or [-1,1].

## Dataset Balancing

The original dataset contain an imbalance between the two classes, that is, there is 23364(∼78%) samples from class ’0’ and 6636(∼22%) from class ’1’, which can affect the classifier prediction ability. In order to address this issue, 2 groups of methods may be employed, i.e, methods based on the undersampling of the majority class and methods based on the oversampling of the minority class:

**Undersampling**

* **Random Majority Undersampling** - Starts with a set consisting only of samples from the minority class and adds random samples from the majority classes (allowing duplicates).

* **NearMiss-1** - Selects samples from the majority class that are close to the minority class samples, by choosing the ones whose average to three closest minority samples are the smallest.

* **NearMiss-3** - Surround each minority sample with a number of majority samples and choose the ones which have the highest average distance to three closest minority samples.

* **Neighbor Cleaning Rule** - Remove noisy data (samples whose class differs from the majority class of at least two of its three nearest neighbor) and the three nearest neighbors that misclassify samples of the minority class.

**Oversampling**

* **Random Majority Undersampling** - Starts with a set consisting only of samples from the majority class and adds random samples from the minority classes (allowing duplicates).

* **SMOTE** - Oversamples the minority data by creating ”synthetic” samples from the minority class.


Applying these transformations to the input data usually bring benefits to the final accuracy of the classifier. The [next post](/2017/09/09/ml-pipeline-5/) will be dedicated to feature selection/reduction methods.