---
title: Free up memory by cleaning caches
date: 2017-08-12 00:39:00
tags: 
- linux
- unix
- memory
---

Running out of memory can be an issue when you are running a lot services on your development box, such as web services, databases, editors, etc. Over time, the caching system eats up a good portion of your memory resources. Event though Linux has a good memory management system, the kernel also has a useful mechanism to free up caches. 

```bash
sync; echo 3 > /proc/sys/vm/drop_caches
```

Basically,  the initial *sync* command writes pending data in memory back to disk. After this synchronization, we can release memory by dropping cached objects. 
You can see its effects by checking your memory in real time:

Before:
```bash
free -h -t
              total        used        free      shared  buff/cache   available
Mem:           3.8G        2.0G        1.1G        134M        622M        1.4G
Swap:          2.0G        531M        1.5G
Total:         5.8G        2.5G        2.6G
```

After:
```bash
free -h -t
              total        used        free      shared  buff/cache   available
Mem:           3.8G        2.0G        1.4G        133M        375M        1.4G
Swap:          2.0G        532M        1.5G
Total:         5.8G        2.5G        2.9G
```

It is important to note that this will cause objects to be recreated later, which may lead to some intense CPU/IO usage. However, it is still an approach you can use if you feel you are running out of memory and want to reclaim back some portions of it.




