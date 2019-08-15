---
title: Building a fast inference service with falcon and bjoern
date: 2018-01-06 16:25:16
tags: 
- python
- performance
- machine-learning
---
A good portion of time in building supervised machine learning models is spent into training, that is, finding the best set of parameters that will give us the best accuracies on unseen data. Once we are satisfied with the obtained results, we often need to deploy and make it available to answer queries from a wide range of sources.

We can elaborate complex scenarios that are able to scale and answer to thousands of requests. However, let us consider that we need to prototype and showcase a quick solution, without sacrificing performance and scalability. 

For this scenario we can combine the [Falcon](https://falconframework.org) framework, which is a highly optimized and reliable web framework with [bjoern](https://github.com/jonashaag/bjoern), a very lightweight and fast WSGI server. This post shows a possible use of these tools. For the inference model, we will use a pre-trained model built with the [fasttext](https://fasttext.cc) classification tool. This model is able to classify text according to its polarity.

## Installing dependencies

* Optional virtual environment

```
virtualenv -p python3 venv
```

* Falcon and Bjoern

```
pip install ujson
pip install cython
pip install --no-binary :all: falcon 
pip install bjoern
```

* FastText

```
git clone https://github.com/facebookresearch/fastText.git
cd fastText
pip install pybind11
python setup.py install
cd ..
```

## Download the pre-trained model

```
mkdir models
wget --directory-prefix=models https://s3-us-west-1.amazonaws.com/fasttext-vectors/supervised_models/amazon_review_full.ftz
```


## Creating a REST resource

In order to serve requests by answering with polarity predictions (number of stars), let's define a resource by specifying a REST endpoint.

```python
import fastText
import falcon
import bjoern
import ujson

REVIEW_MODEL = 'models/amazon_review_full.ftz'
WEB_HOST = '127.0.0.1'
PORT = 9000

print('Loading amazon review polarity model ...')
review_classifier = fastText.load_model(REVIEW_MODEL)

class ReviewResource(object):
	def on_post(self, req, resp):
		form = req.params
		if 'text' in form and form['text']:
			try:
				classification, confidence = review_classifier.predict(form['text'])
				resp.body = ujson.dumps({'{} star'.format(classification[0][-1]) : confidence[0]})
				resp.status = falcon.HTTP_200
			except:
				resp.body = ujson.dumps({'Error': 'An internal server error has occurred'})
				resp.status = falcon.HTTP_500
		else:
		    resp.body = ujson.dumps({'Error': 'param \'text\' is mandatory'})
		    resp.status = falcon.HTTP_400


# instantiate a callable WSGI app
app = falcon.API()

# long-lived resource class instance
infer_review = ReviewResource()

# handle all requests to the '/inferreview' URL path
app.req_options.auto_parse_form_urlencoded = True
app.add_route('/inferreview', infer_review)

print('Listening on', WEB_HOST + ':' + str(PORT) + '/inferreview')
bjoern.run(app, WEB_HOST, PORT, reuse_port=True)
```


In the above code, we define an handler for POST requests, instantiate the application, configure routing and finally run the bjoern WSGI server. 

## Making queries

The command bellow allow us to make queries to our web server. As an example, the request asks for a rating of the following review: 'I love this product.'

```
curl -X POST http://localhost:9000/inferreview -H 'Content-Type: application/x-www-form-urlencoded' -d text="I love this product."
```

which gives the desired classification, along with its confidence:

```json
{
    "5 star": 0.7544972301
}
```

## How does it scale ?

We have a server answering to client queries. We can make a quick test in order assess the scalability of our system. The [wrk2](https://github.com/giltene/wrk2) tool is perfect for this since it allows to record the latency distribution for different throughput (request per second) values. 

```
git clone https://github.com/giltene/wrk2.git
cd wrk2
make
./wrk -t4 -c400 -d30s -R25000 -L -s scripts/post.lua http://127.0.0.1:9000/inferreview
```

The above command tests our server using 4 client threads, keeping 400 connections open, during 30 seconds and with a constant throughput of 20000 per second. The file scripts/post.lua is also modified as follows:

```
wrk.method = "POST"
wrk.body   = "text='awesome product'"
wrk.headers["Content-Type"] = "application/x-www-form-urlencoded"
wrk.headers["Cache-Control"] = "no-cache"
```

The wrk2 tool generates a large output, containing a complete report with statistics in the [HdrHistogram](https://github.com/HdrHistogram/HdrHistogram) (High Dynamic Range Histogram) format, which we can use to make a plot of different throughput rates, as shown in the figure bellow:

![](/images/falcon-bjoern/falcon-bjoern-latency.png)

We can see the server handles 99% of all requests under 60 milliseconds, even when the throughput is 20000 requests per second, which is a fairly good performance. As a further comparison, the plot bellow shows a comparison with the popular wsgi server [gunicorn](http://gunicorn.org), with the same constant throughput rate.

![](/images/falcon-bjoern/bjoern-gunicorn.png)

The gunicorn server ran with 9 asynchronous worker processes, based on [gevent](http://www.gevent.org) threads and it was called with the following command:

```
gunicorn polarity_server:app -w 9 -k gevent
```

It is clear that the bjoern server handled requests faster than gunicorn, and thus is a strong and faster alternative. These tests were performed on a standard laptop with 4 cores.

## Final remarks

Falcon  and Bjoern make a great combination to quickly serve thousands of requests with low effort and also make a good starting point for more complex scenarios. This speedup is justified since Falcon itself was compiled with [Cython](http://cython.org). We could have used the [pypy](http://pypy.org) python implementation alternative for even faster results. On the other hand, Bjoern is a very lightweight wsgi server, with a very low memory footprint, and single-threaded, which avoids locking overheads such as the [GIL](https://wiki.python.org/moin/GlobalInterpreterLock). The right combination of tools, allow us to worry less on performance issues and focus more on implementing the task that we want to provide. Finally, the source code is available [here](https://github.com/AlexPnt/falcon-polarity-inference).