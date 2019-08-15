---
title: Performance tips for Django applications
date: 2017-08-18 22:06:19
tags:
- django
- python
- performance
---

Performance is an typical concern when developing applications. In order to have a good back-end performance it is important to be aware of memory footprints that our programs uses, CPU usage, database handling, etc. If no precaution measures are taken, these can quickly become bottlenecks and hurt the general performance of our system. This post shows a collection of performance tips that we can use in our Django application in order to save us from headaches in the future.

## Use .count() instead of len() in querysets

```python
musics = Music.objects.all()
n_records = musics.count()
```

Using the *.count()* is faster since it uses the *COUNT()* function at a database level. The *len()* method forces the queryset to be evaluated and retrieve results that you we will not use if all we want to do is count how many objects are there.

## Use a combination of .filter() and .exists() to test existence and membership  

```python
musics = Music.objects.filter(title='Django rocks')
if musics.exists():
    ...
```

Django provides an .exists() method that we can use instead of counting objects with *.count()* or testing entries for inclusion with *obj in queryset* .

## Delay queryset evaluations

```python
musics = Music.objects.all()
 
# typical case of fetching all data from database into memory
for music in musics:
    ...
```

Django querysets are lazy, i.e, they are only evaluated (database hits) when strictly necessary, so we should create and combine querysets before performing certain operations such as iteration, *len()* or slicing which force the results to be fetched from the database. Trips to the database are more time consuming.

## Avoid caching mechanisms for one time operations

```python
musics = Music.objects.all()
 
# avoids queryset caching
for music in musics.iterator():
    ...
```

The *.iterator()* method bypasses the internal caching mechanisms and might be useful if we know we are not going to use these objects anymore. Also, this largely reduces the memory footprint, which can be useful if we are loading millions of rows from the database.

## Fetch only the required columns

```python
# returns a dict
musics = Music.objects.values('title','album')
```

or 

```python
# returns a list
musics = Music.objects.value_list('title','album')
```

These methods avoid creating full model instances and retrieve only the desired field values, avoiding the extra work of fetching the extra columns.

## Fetch related objects in a single batch

```python
# fetches related many-to-many and many-to-one objects
musics = Music.objects.all().prefetch_related('genres')
```

```python
# fetches foreign key relations and one-to-one objects
musics = Music.objects.all().select_related('author')
```

These methods retrieve additional objects, to avoid fetching them later. This also caches all the results into memory, which may or not be desirable.

## Page results

```python
musics = Music.objects.all()

paginator = Paginator(musics, per_page = 2000)
for page in paginator.page_range:
    for obj in paginator.page(page).object_list:
    	...
```

Pagination avoids loading all the objects into memory. This will drastically reduce the memory usage since it fetches slices of our dataset, one chunk of rows at a time, from the database.


## Use bulk_create() to insert a batch of records

```python
Music.objects.bulk_create(musics)
```

Each time we call the *.save()* method on a model instance, a round trip to the database is performed. Besides, signals are sent for each save operation. This can quickly bring an huge overhead when dealing with thousands or millions of records. A possible workaround is to use the *bulk_create* method which inserts records in a single query. We only need to give the list of objects we wish to write back to disk in a single database round trip. However, it is important to note that custom *save()* methods and signals will not be called.

## Use distributed and asynchronous processing

External concurrency libraries such as [Tornado](http://www.tornadoweb.org/en/stable/), [Twisted](https://twistedmatrix.com/trac/) or [Asyncio](https://docs.python.org/3/library/asyncio.html) provide non-blocking behavior and asynchronous I/O, great for performing I/O bound tasks such as reading and writing to disk/network. [Celery](http://www.celeryproject.org/) is also great to perform distributed and CPU bound background tasks.

Here is an example of an hypothetical processing of electronic consumption bills, using the backport version of asyncio for Python 2.7.


```python
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from consumption.models import ElectricConsumption
 
import trollius as asyncio
from trollius import From
 
COUNTER = 0
 
@asyncio.coroutine
def process_client(all_events, client_number, total):
    try:
        client_events = all_events.filter(client_number=client_number).order_by('timestamp')
 
        print "Scheduled processing of client {}".format(client_number)
 		
        #specify that a context switch can happen here
        yield From(asyncio.sleep(1))
 
        # Compute bills (I/O bound task)
        ElectricConsumption.set_bill(client_events)
 
        global COUNTER
        COUNTER += 1
        print "Finished processing client {}: " \
              "({} of {} = {} %))".format(client_number,
                                          COUNTER, total,
                                          str(COUNTER / float(total) * 100))
    except:
        print "Error processing client {})".format(client_number)
 
class Command(BaseCommand):
    help = 'Process electric consumptions'
 
    # Process clients
    def handle(self, *args, **options):
        all_events = ElectricConsumption.objects.all()
        clients = all_events.values('client_number')
        total = clients.count()
			
        #gets the event loop that manages the execution flow of our future tasks
        loop = asyncio.get_event_loop()
        tasks = []
        with transaction.atomic():
            for client in clients:
                client_number = client['client_number']
 
                #register our asynchronous tasks
                tasks += [asyncio.ensure_future(process_client(all_events, client_number, total))]
					
            loop.run_until_complete(asyncio.wait(tasks))
            loop.close()
```

```bash
$ python manage.py electric_bills.py
 
Scheduled processing of client 4521
Scheduled processing of client 4174
Scheduled processing of client 7531
Scheduled processing of client 7584
Scheduled processing of client 7419
Finished processing client 7584: (1 of 5 = 20.0 %))
Finished processing client 4174: (2 of 5 = 40.0 %))
Finished processing client 7531: (3 of 5 = 60.0 %))
Finished processing client 7419: (4 of 5 = 80.0 %))
Finished processing client 4521: (5 of 5 = 100.0 %))
```

These small tips make a noticeably difference when dealing with huge datasets and are good investments, regarding performance, in the long term. 