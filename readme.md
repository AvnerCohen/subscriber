# Subscriber

A basic skeleton for end point to collect emails from a landing page.
The logic is very simple and will simple email to a configured target the data sent in from the landing page.

Current setup assumes sendgrid setup, but should be easly replaced with any other provider


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
