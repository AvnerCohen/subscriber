# Subscriber

A basic skeleton for a nodejs end point to collect emails from a landing page.
The logic is very simple and will simple email to a configured target the data sent in from the landing page.

Current setup assumes sendgrid setup, but should be easly replaced with any other provider.


## Usage

Update configuration on .env (see samlpe data in .env.sample)

## Start with PM2

```sh
pm2 start index.js
```

## Watch Logs with PM


```sh
pm2 logs
```

## Manual testing 

```sh
curl -H "Content-Type: application/json" -X POST "http://127.0.0.1:3111/signup" -d '{"name":"moshe", "email":"marko@bepita.com", "key": "b3956f6fa03155e42e5fc2755d46bcfb"}'
```

## Configuration

Documented and described in the [Sample Config](.env.sample)
One important thing to note is the support for multipale configurations with the same service.
Simple create a sample key and send it from the landing page, the `key` will be parsed and will be used to retrive the cortrect configuation.
For example, if key is `b3956f6fa03155e42e5fc2755d46bcfb`, the following keys will be picked up from the config:

```
SUBSCRIBER_FROM_EMAIL_b3956f6fa03155e42e5fc2755d46bcfb=
SUBSCRIBER_TO_EMAIL_b3956f6fa03155e42e5fc2755d46bcfb=
SUBSCRIBER_FIELDS_b3956f6fa03155e42e5fc2755d46bcfb=
```

Content of the email is not configured as the intention is to use this as a simple, low traffic landing page email collector, nothing more.

## Adding a provider

Simply add a new provider in the `providers` directory.
The provider should have the following:

```js
mailProvider.send(mailOptions, function (err, info) {
    ....
})
```
