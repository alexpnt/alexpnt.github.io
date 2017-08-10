---
title: Microservices, Docker and Django - Part I
date: 2017-07-31 23:16:17
tags: 
- development
- microservices
- django
- python
- docker
---

<img src="/images/dev.jpg" alt="" style="height: 512px;"/>

## Monolithic vs Microservices 

Over the past years, there has been a paradigm shift in the architecture of software, i.e., the microservices approach to software development is taking over the traditional monolithic architecture. 

Monolithic applications are systems built as a single tightly coupled unit, which gets more complex as the application evolves. Monolithic applications share the same resources, libraries and memory, which brings faster accesses and inter service communications, however, it is harder to maintain, challenging to scale and more difficult to isolate services.

On the other hand, microservices are independent and isolated services with specific responsibilities, who communicate with each other. This brings an overall better organization, separation of concerns and performance in the long run. With microservices is easier to scale since we only need to 'upgrade' certain services and not the entire system. It is easier to deploy (we only update parts of the system) and more fault tolerant (a failure of one part does not bring down the entire system).

## Docker Containerization

Containers are a way of isolating services, just like virtual machines but with some important differences. While virtual machines create an isolated full stack, from the host operating system to the user application, containers share the host operating system, adding only the necessary libraries and applications, creating a lightweight sandbox on our system, with its own layered filesystem and network management. [Docker](https://www.docker.com/) is a popular container system which uses Linux containers(LXC) under the hood, a native feature of Linux systems, in order to provide isolation of microservices. 

With docker we can quickly change to different environment setups,   


## Installing Docker

To install docker on a Debian based box, we simply run these commands.

```bash
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
 
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
 
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
 
sudo apt-get update
sudo apt-get install docker-ce
sudo groupadd docker
```

## Installing Docker Compose

Docker Compose is a useful tool that let us configure and run multiple containers.

```bash
pip install docker-compose
```

## Downloading our example application that we will dockerize

```bash
mkdir dockerize-musicwallet
cd dockerize-musicwallet
git clone -b postgres https://github.com/AlexPnt/MusicWallet.git
```

We now have a code base from a [web application](https://github.com/AlexPnt/MusicWallet) that let us manage users and their favourite musics, with a REST API, built with Django and the Django Rest Framework.

In the [next post](), we will turn this application into a docker container.
