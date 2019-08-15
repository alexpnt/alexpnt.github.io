---
title: Reclaiming disk space from docker
date: 2017-08-15 14:37:54
tags:
- docker
- memory
- disk
---

Docker is a great tool to create isolated micro services and environments. However, over time the number of intermediate image layers, size of log files used by the containers and volumes increases which can take up considerable disk space. Besides, dangling images and stopped containers which we do not use anymore are not automatically removed. Fortunately, docker has some options which can help us reclaim disk space.    

Dangling images are not referenced by any other image, so they can be garbage collected.   

__List dangling images__
```bash
$ docker images -f dangling=true
```
__Removing dangling images__
```bash
$ docker rmi $(docker images -q -f dangling=true)
```

Similarly, we can list all stopped containers and remove them.

__List stopped containers__
```bash
$ docker ps -a -f status=exited
```
__Removing stopped containers__
```bash
$ docker rm $(docker ps -a -q -f status=exited)
```

We can also remove data volumes from containers that do not exist anymore, i.e., dangling volumes that are not automatically removed.

__List dangling volumes__
```bash
$ docker volume ls -f dangling=true
```
__Removing dangling volumes__
```bash
$ docker volume rm $(docker volume ls -q -f dangling=true)
```

Another good practice to minimize disk space usage is to periodically rotate the docker output logs. We can use the built-in utility logrotate by simply creating a configuration file in /etc/logrotate.d/ .

```bash
$ vim /etc/logrotate.d/docker-log
 
/var/lib/docker/containers/*/*.log {
  rotate 10
  daily
  compress
  size=50M
  missingok
}
```

The above configuration archives and compress the logs when they reach a size of 50M. This rotation is performed daily and after 10 archived logs, the oldest one is removed.

It is important to be aware of the disk space consumed by docker and perform some cleaning tasks once in a while or we might end up with some space issues. Docker also offers a great [documentation](https://docs.docker.com/) where we can further inspect its options.
