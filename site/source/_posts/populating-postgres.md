---
title: Populating a PostgreSQL database
date: 2017-08-17 22:30:56
tags:
- database
- performance
- sql
- postgres
---

It is often the case that we need to populate a table with initial data. A typical approach is to run an sql script to perform a bulk insert. However this is not ideal for cases where there are millions of rows. To tackle this, PostgreSQL provides the COPY command, a very efficient way of inserting a large amount of data.

This command may be used like this:

```bash
COPY table_name(column1, column2, column3, ...) FROM 'data.csv' DELIMITER ';' CSV HEADER;
```

where we specify the table name, its columns and the data file.

To illustrate, let's create a table that mimics an household electric power consumption. We can use a pre-built docker image containing a PostgreSQL installation for this and a [public dataset](https://archive.ics.uci.edu/ml/datasets/Individual+household+electric+power+consumption) for testing.

```bash
$ cat docker-compose

version: '2'
 
services:
  db:
    image: postgres
    ports:
      - "5432:5432"
    volumes:
      - data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
 
volumes:
  data:
```

We are now ready to configure our database:

```bash
$ docker-compose up -d db
$ docker cp household_power_consumption.csv db_1:/var/lib/postgresql/data/household_power_consumption.csv
$ docker-compose run --rm db psql -h db -p 5432 -U postgres --password
  
CREATE TABLE power_consumption (
    Date character varying(50),
    Time character varying(50),
    Global_active_power character varying(50),
    Global_reactive_power character varying(50),
    Voltage character varying(50),
    Global_intensity character varying(50),
    Sub_metering_1 character varying(50),
    Sub_metering_2 character varying(50),
    Sub_metering_3 character varying(50)
);
```

Finally, we can load the data into our newly created table:
```bash
\timing on
 
COPY power_consumption(Date,Time,Global_active_power,Global_reactive_power,Voltage,Global_intensity,Sub_metering_1,Sub_metering_2,Sub_metering_3) FROM '/var/lib/postgresql/data/household_power_consumption.csv' DELIMITER ';' CSV HEADER;

Time: 7906.845 ms
```

It took roughly 8 seconds to insert 2 075 259 records. This operation works best if there are not any indexes or foreign keys present that may introduce overhead in each insert. It is usually preferred to create them after.




