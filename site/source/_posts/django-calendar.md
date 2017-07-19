---
title: Getting started with Django - Building a simple calendar
date: 2017-07-15 00:39:00
tags: 
- django
- development
- python
---

![](/images/dev.png)

## What is Django ? 

Django is a well-known web framework, written in Python, which comes packaged with lots of out of the box features, such as:
- An ORM (Object-relational mapping) where you define your data models and get access to a high-level API that lets you manage your data, instead of writing raw SQL.
- A template system for writing the front end, extending the basic HTML functionality. 
- An admin panel where you can manage your data models.
- Security measures.
- Authentication, Form handling and URL routing.

This speeds up your development, since the most basic and common tasks are already provided to you and ready to be used, letting you focus on the logic that makes your product unique.   

## Getting started 

__Installing and activating a virtual environment__

```bash
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py
sudo pip install virtualenv
virtualenv venv
source venv/bin/activate
```

__Installing Django__

```bash
pip install django==1.11.3
```

__Creating the project directory structure__

```bash
django-admin startproject mycalendar
cd mycalendar
python manage.py startapp events
```

__Aplplying the migrations, creating the admin account and running the web server__
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

If you head over to http://localhost:8000/admin, you will see a simple administration interface.

## Events

The basic unit of our calendar will be the event, so we start by writting our event model in *mycalendar/events/models.py*.

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.db import models
 
class Event(models.Model):
    day = models.DateField(u'Day of the event', help_text=u'Day of the event')
    start_time = models.TimeField(u'Starting time', help_text=u'Starting time')
    end_time = models.TimeField(u'Final time', help_text=u'Final time')
    notes = models.TextField(u'Textual Notes', help_text=u'Textual Notes', blank=True, null=True)
 
    class Meta:
        verbose_name = u'Scheduling'
        verbose_name_plural = u'Scheduling'

```

After this step we need to tell django about our new app in *mycalendar/settings.py*.

```python

(...)
 
# Application definition
 
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'events'
]
 
(...)
```

And in *mycalendar/events/admin.py* we register the model.
```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.contrib import admin
from models import Event
 
class EventAdmin(admin.ModelAdmin):
    list_display = ['day', 'start_time', 'end_time', 'notes']
```

Finally, we apply the changes to the database and run the app:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

We are now able to add simple events:

![](/images/add_event.png)

However, our current model does not have any validations, such as overlapping events. We can add these kind of validations in the *clean()* method of our model,  which iterates over our events and checks if there are collisions.


```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.db import models
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
 
class Event(models.Model):
    day = models.DateField(u'Day of the event', help_text=u'Day of the event')
    start_time = models.TimeField(u'Starting time', help_text=u'Starting time')
    end_time = models.TimeField(u'Final time', help_text=u'Final time')
    notes = models.TextField(u'Textual Notes', help_text=u'Textual Notes', blank=True, null=True)
 
    class Meta:
        verbose_name = u'Scheduling'
        verbose_name_plural = u'Scheduling'
 
    def check_overlap(self, fixed_start, fixed_end, new_start, new_end):
        overlap = False
        if new_start == fixed_end or new_end == fixed_start:    #edge case
            overlap = False
        elif (new_start >= fixed_start and new_start <= fixed_end) or (new_end >= fixed_start and new_end <= fixed_end): #innner limits
            overlap = True
        elif new_start <= fixed_start and new_end >= fixed_end: #outter limits
            overlap = True
 
        return overlap
 
    def get_absolute_url(self):
        url = reverse('admin:%s_%s_change' % (self._meta.app_label, self._meta.model_name), args=[self.id])
        return u'<a href="%s">%s</a>' % (url, str(self.start_time))
 
    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError('Ending times must after starting times')
 
        events = Event.objects.filter(day=self.day)
        if events.exists():
            for event in events:
                if self.check_overlap(event.start_time, event.end_time, self.start_time, self.end_time):
                    raise ValidationError(
                        'There is an overlap with another event: ' + str(event.day) + ', ' + str(
                            event.start_time) + '-' + str(event.end_time))

```
Our app now detects collisions.

![](/images/overlap.png)

## Calendar

It would be nice to add a monthly view of our events. There are some third-party packages available, but for the sake of simplicity we will stick to the built-in *HTMLCalendar* class provided by python.

We first need to override the *change_list.html* admin template by creating a file in *events/templates/admin/events/change_list.html* with the exactly the same content installed in *site-packages/django/contrib/admin/templates/admin/* .

```html
(...)
{% block content %}
  <div id="content-main">
          <ul class="object-tools">
            <li>
                <a href={{ previous_month }}>
                    Previous month
                </a>
            </li>
            <li>
                <a href={{ next_month }}>
                    Next month
                </a>
            </li>
        </ul>

        {{ calendar }}
(...)
```

We will now dynamically define the context variables such as previous_month, next_month and calendar in *events/admin.py*

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.contrib import admin
from models import Event
import datetime
import calendar
from django.core.urlresolvers import reverse
from calendar import HTMLCalendar
from django.utils.safestring import mark_safe
 
# Register your models here.
 
class EventAdmin(admin.ModelAdmin):
    list_display = ['day', 'start_time', 'end_time', 'notes']
    change_list_template = 'admin/events/change_list.html'
 
    def changelist_view(self, request, extra_context=None):
        after_day = request.GET.get('day__gte', None)
        extra_context = extra_context or {}
 
        if not after_day:
            d = datetime.date.today()
        else:
            try:
                split_after_day = after_day.split('-')
                d = datetime.date(year=int(split_after_day[0]), month=int(split_after_day[1]), day=1)
            except:
                d = datetime.date.today()
 
        previous_month = datetime.date(year=d.year, month=d.month, day=1)  # find first day of current month
        previous_month = previous_month - datetime.timedelta(days=1)  # backs up a single day
        previous_month = datetime.date(year=previous_month.year, month=previous_month.month,
                                       day=1)  # find first day of previous month
 
        last_day = calendar.monthrange(d.year, d.month)
        next_month = datetime.date(year=d.year, month=d.month, day=last_day[1])  # find last day of current month
        next_month = next_month + datetime.timedelta(days=1)  # forward a single day
        next_month = datetime.date(year=next_month.year, month=next_month.month,
                                   day=1)  # find first day of next month
 
        extra_context['previous_month'] = reverse('admin:events_event_changelist') + '?day__gte=' + str(
            previous_month)
        extra_context['next_month'] = reverse('admin:events_event_changelist') + '?day__gte=' + str(next_month)
 
        cal = HTMLCalendar()
        html_calendar = cal.formatmonth(d.year, d.month, withyear=True)
        html_calendar = html_calendar.replace('<td ', '<td  width="150" height="150"')
        extra_context['calendar'] = mark_safe(html_calendar)
        return super(EventAdmin, self).changelist_view(request, extra_context)
 
admin.site.register(Event, EventAdmin)
```

With this addition, our app now displays a monthly calendar.

![](/images/calendar.png)

However, our app still does not display the events in each cell. We can tweak the *HTMLCalendar* class by extending it and override the methods responsible for drawing the table cells. Our little tweak will be the introduction of the list of events and displaying them in their corresponding cell. We will now create a new class in *utils.py* .

```python
from calendar import HTMLCalendar
from datetime import datetime as dtime, date, time
import datetime
from models import Event
 
 
class EventCalendar(HTMLCalendar):
    def __init__(self, events=None):
        super(EventCalendar, self).__init__()
        self.events = events
 
    def formatday(self, day, weekday, events):
        """
        Return a day as a table cell.
        """
        events_from_day = events.filter(day__day=day)
        events_html = "<ul>"
        for event in events_from_day:
            events_html += event.get_absolute_url() + "<br>"
        events_html += "</ul>"
 
        if day == 0:
            return '<td class="noday">&nbsp;</td>'  # day outside month
        else:
            return '<td class="%s">%d%s</td>' % (self.cssclasses[weekday], day, events_html)
 
    def formatweek(self, theweek, events):
        """
        Return a complete week as a table row.
        """
        s = ''.join(self.formatday(d, wd, events) for (d, wd) in theweek)
        return '<tr>%s</tr>' % s
 
    def formatmonth(self, theyear, themonth, withyear=True):
        """
        Return a formatted month as a table.
        """
 
        events = Event.objects.filter(day__month=themonth)
 
        v = []
        a = v.append
        a('<table border="0" cellpadding="0" cellspacing="0" class="month">')
        a('\n')
        a(self.formatmonthname(theyear, themonth, withyear=withyear))
        a('\n')
        a(self.formatweekheader())
        a('\n')
        for week in self.monthdays2calendar(theyear, themonth):
            a(self.formatweek(week, events))
            a('\n')
        a('</table>')
        a('\n')
        return ''.join(v)
```

We can now use this new calendar in our admin view:

```python
(...)
from utils import EventCalendar
 
 
(...)
cal = EventCalendar()
 
(...)
```

Our monthly view now displays the events in their corresponding cells.

![](/images/events.png)

We can see a lot of events happening at 15th July. Fortunately, our new calendar also display links to their details.

![](/images/birthday.png)

Someone is having a very special day!

You can find the source code of this example [here](https://github.com/AlexPnt/django-calendar).













