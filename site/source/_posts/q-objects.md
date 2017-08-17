---
title: Complex lookups with Q objects in Django
date: 2017-07-19 22:26:02
tags:
- django
- python
- development
---

![](/images/dev.png)

One of the great offers of Django is the high-level database API, which lets us manipulate our data using an object oriented approach. 

For instance given the following model:

```python
from django.db import models
 
class Grade(models.Model):
    student_code = models.CharField(u'Student Code', max_length=30)
    course_code = models.CharField(u'Course code', max_length=30)

```

What if we want to obtain all the grades for some combinations of student and courses. We might be tempted to use a *filter(**kwargs)*	 method with the *in* lookup:

```python
from grades.models import Grade
 
student_codes = ['456870','433495','104248','720400']
course_codes = ['474009','431934','447595','789614']
grades = Grade.objects.filter(student_code__in=student_codes, 
                    course_codes__in=course_codes)
```

However, this is not ideal since we will end up with grades from different combinations of student/course. This where Q objects come for the rescue. Q objects encapsulate conditions and can be merged together with different logical operators, such as OR and AND. Therefore, we could rewrite our previous approach as follows:


```python
from grades.models import Grade
from django.db.models import Q
import operator
from itertools import izip
 
student_codes = ['456870','433495','104248','720400']
course_codes = ['474009','431934','447595','789614']
 
q_objects = (Q(student_code=sc, course_code=cc) for sc, cc in izip(student_codes, course_codes))
 
query = reduce(operator.or_, q_objects)
grades = Grade.objects.filter(query)

```

The important part here is that we joining together a set of OR statements (our desired combinations) instead of allowing forbidden combinations that we are not interested.
This example shows how we can overcome the limitations of *filter* methods by using Q objects, another great feature of our framework. 
