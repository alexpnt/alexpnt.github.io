---
title: Microservices, Docker and Django - Part II
date: 2017-08-06 15:02:07
tags: 
- development
- microservices
- django
- python
- docker
---

![](/images/dev.png)

A typical web application has a set of components that work together such as the application backend, the frontend, the database or other components such as cache services, proxy servers, etc. Docker is a great tool to decouple our different services and isolate them. In this post we will decouple our web application  into  two services, the application and the database.

We start by getting a copy of our code base:

```bash
$ git clone -b postgres https://github.com/AlexPnt/MusicWallet.git
$ cd MusicWallet
```

Our project structure is as follows:

```bash
└── MusicWallet
    ├── docker-compose.yml
    ├── musicwalletproject
    │   ├── docker-entrypoint.sh
    │   ├── Dockerfile
    │   ├── manage.py
    │   ├── musicwalletapp
    │   ├── musicwalletproject
    │   └── requirements.txt
    └── README.md
```

We declare our two services in a configuration file called *docker-compose.yml* .

```bash
version: '2'

services:
  db:
    image: postgres
    restart: always
    ports:
      - "5432:5432"
    volumes:
      - data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  web:
    restart: always
    build: ./musicwalletproject
    command: python manage.py runserver 0.0.0.0:8000 --settings=musicwalletproject.settings.development
    volumes:
      - ./musicwalletproject:/code
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  data:
```

We declare our database service 'db' and our web application 'web'. The database service pulls a docker image from the [official repository](https://hub.docker.com/_/postgres/), setups up some credentials and expose the standard ports. The service 'web' uses our code base to build an image that will serve requests on port 8000. 

Our 'web' service used a file called *Dockerfile* to setup the docker image:

```bash
FROM python:2
 
ENV PYTHONUNBUFFERED 1
 
RUN mkdir /code
WORKDIR /code
ADD . /code
 
ADD requirements.txt /code/
RUN pip install -r /code/requirements.txt
 
COPY ./docker-entrypoint.sh /
 
ENTRYPOINT ["/docker-entrypoint.sh"]
```

This file simply instructs docker to copy our code base into the container and install all the required dependencies. Besides, it also runs some setup commands specified in *docker-entrypoint.sh*, which applies migrations to the database, copy the static files to a single location and starts the web server: 

```bash
#!/bin/sh
 
python manage.py makemigrations --settings=musicwalletproject.settings.development
python manage.py migrate --settings=musicwalletproject.settings.development
python manage.py collectstatic --settings=musicwalletproject.settings.development --noinput
python manage.py runserver 0.0.0.0:8000 --settings=musicwalletproject.settings.development
```


We are now ready to launch our services. Starting with the database service, with these docker commands we can quickly launch our new database container and create our new database:   
```bash
$ docker-compose up db
$ docker-compose run --rm db psql -h db -U postgres -c "CREATE DATABASE musicwallet_db" 
```

Similarly, we build our web application and launch it:
```bash
$ docker-compose build web
$ docker-compose up web
```

If we want to inspect if our services are running, we can use the docker-compose command _ps_:
```bash
$ docker-compose ps
  
      Name                     Command               State           Ports          
-----------------------------------------------------------------------------------
musicwallet_db_1    docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp 
musicwallet_web_1   /docker-entrypoint.sh pyth ...   Up      0.0.0.0:8000->8000/tcp 
```

It seems to be working. We can further inspect the logs to see if any error occurred during launch:

```bash
$ docker-compose up
 
Starting musicwallet_db_1
Starting musicwallet_web_1
Attaching to musicwallet_db_1, musicwallet_web_1
db_1   | LOG:  database system was interrupted; last known up at 2017-08-09 23:44:42 UTC
db_1   | LOG:  database system was not properly shut down; automatic recovery in progress
db_1   | LOG:  invalid record length at 0/15975C0: wanted 24, got 0
db_1   | LOG:  redo is not required
db_1   | LOG:  MultiXact member wraparound protections are now enabled
db_1   | LOG:  autovacuum launcher started
db_1   | LOG:  database system is ready to accept connections
web_1  | No changes detected
web_1  | Operations to perform:
web_1  |   Apply all migrations: admin, auth, authtoken, contenttypes, musicwalletapp, sessions
web_1  | Running migrations:
web_1  |   No migrations to apply.
web_1  | 
web_1  | 0 static files copied to '/code/musicwalletproject/settings/static', 93 unmodified.
web_1  | Performing system checks...
web_1  | 
web_1  | System check identified no issues (0 silenced).
web_1  | August 09, 2017 - 23:55:50
web_1  | Django version 1.10.2, using settings 'musicwalletproject.settings.development'
web_1  | Starting development server at http://0.0.0.0:8000/
web_1  | Quit the server with CONTROL-C.
```

Finally, we can head over to [localhost:8000](localhost:8000):

![](/images/musicwallet.png)

The web application is ready to be used ! You can live test it [here.](http://musicwallet.pythonanywhere.com/)

Alternatively, you can use perform REST calls using the [httpie](https://httpie.org/) client.

Obtaining the authentication token:

```bash
$ http --json POST localhost:8000/api-token-auth/ username=myuser password=mypassword
```

List users:
```bash
$ http GET localhost:8000/api/users/ Authorization:"Token <token_id>"
```
Get details from a user
```bash
$ http GET localhost:8000/api/users/<id>/ Authorization:"Token <token_id>"
```
Edit an existing user by sending a request with json data in the body of the request.
```bash
$ http --json PUT localhost:8000/api/users/<id>/ username=newname email=newemail password=newpassword Authorization:"Token <token_id>"
```
Delete an existing user.
```bash
$ http DELETE localhost:8000/api/users/<id>/ Authorization:"Token <token_id>"
```
List musics:
```bash
$ http GET localhost:8000/api/musics/ Authorization:"Token <token_id>"
```
Get details from a music.
```bash
$ http GET localhost:8000/api/musics/<id>/ Authorization:"Token <token_id>"
```
Create a new music by sending a request with json data in the body of the request.
```bash
$ http --json POST localhost:8000/api/musics/ title=mytitle artist=myartist album=myalbum Authorization:"Token <token_id>"
```
Edit an existing music by sending a request with json data in the body of the request.
```bash
$ http --json PUT localhost:8000/api/musics/<id>/ title=newtitle artist=newartist album=newalbum Authorization:"Token <token_id>"
```
Delete an existing music.
```bash
$ http DELETE localhost:8000/api/musics/<id>/ Authorization:"Token <token_id>"
```
Add an existing music to the list of favourites from an existing user.
```bash
$ http POST localhost:8000/api/users/<music_id>/add_fav_music/ Authorization:"Token <token_id>"
```
Delete a favourite music from the list of favourites from an existing user.
```bash
$ http DELETE localhost:8000/api/users/<music_id>/remove_fav_music/ Authorization:"Token <token_id>"
```







