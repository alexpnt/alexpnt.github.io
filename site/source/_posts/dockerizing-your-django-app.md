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


