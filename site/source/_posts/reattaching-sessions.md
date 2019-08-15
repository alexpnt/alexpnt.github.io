---
title: Reattaching shell sessions
date: 2017-08-15 12:44:36
tags: 
- linux
- shell
---

Ever started a shell session running a process, quickly realizing that will take longer than you expected to finish? For instance, a remote ssh session where you do not want to leave your computer turned on just to keep the session open. Fortunately, there is a workaround by using a combination of [screen](https://www.gnu.org/software/screen/) and [reptyr](https://github.com/nelhage/reptyr).


For example, imagine that we are running this hypothetic slow process that prints in each second the next number of the Fibonacci sequence:

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
 
import time
 
def fibo():
	prev = sum = 0
	actual = 1
        print actual	
	while True:
		next = prev + actual
		prev = actual
		actual = next
		print actual
		time.sleep(1)
 
if __name__ == "__main__":
    fibo()
```

```bash
$ python fibo.py
 
1
1
2
3
5
8
13
21
34
55
89
144
233
377
610
987
1597
2584
4181
6765
10946
17711
28657
```

We are now interested in moving this job to another session where we can attach and detach any time, while leaving the job running. In order to achieve this, we start by creating a new screen session in a new window:
```bash
$ screen -S fibonacci
```

The screen tool lets us create multiple windows with shells inside. We can also leave those windows at anytime and reenter them later, always leaving their internal programs running. Once we have this new screen session, we can move our running job to this new shell:

```bash
$ ps -u | grep fibo.py

alexpnt  10776  0.0  0.1  25540  6204 pts/4    S+   14:00   0:00 python fibo.py
 
$ sudo -i
$ echo 0 > /proc/sys/kernel/yama/ptrace_scope
$ exit 
$ reptyr 10776

46368
75025
121393
196418
317811
514229
832040
1346269
2178309
3524578
5702887
9227465
14930352
```

We temporarily enable the ability to attach programs, as root. Then, we grab the process id and pass it to the reptyr tool, which does a great job in moving our old process back to this new shell. We can now detach from this screen session by typing *Ctrl + Shift + D* and confirming the session is saved:

```bash
$ screen -ls

There is a screen on:
	10822.fibo	(Detached)
1 Socket in /run/screens/S-alexpnt.

```

Later, when can reattach to the screen:

```bash
$ screen -r fibo
 
24157817
39088169
63245986
102334155
165580141
267914296
433494437
701408733
1134903170
1836311903
2971215073
4807526976
7778742049
12586269025
```

PS: You might need to run __echo 0 > /proc/sys/kernel/yama/ptrace_scope__

This is a very simple example with a trivial job running just to illustrate the idea of moving random jobs to new screen sessions. We can avoid this by always starting long running process in new screen sessions. In case we forget, we can use this process to rescue us.
