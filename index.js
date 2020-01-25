const path = require('path')
const fs = require('fs')

const app = require('express')();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

require('dotenv').config()

const port = process.env.PORT || 3111
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common', {
    stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})
}));


let allowedOrigins = process.env.SUBSCRIBER_ALLOWED_CORS_ORIGINS.split(",")
let logDirectory = path.join(__dirname, 'log')

const mailOptions = {
  to: process.env.SUBSCRIBER_TO_EMAIL.split(","),
  from: process.env.SUBSCRIBER_FROM_EMAIL,
  subject: '',
  html: ''
};

function getBody(name, email) {
    return "<p> Someone signed up from the site:<br/>" +
    "<br/><b>Name: </b>" + name +
    "<br/><b>Email: </b>" + email +
    "<br/><br/><br/>Good luck!</p>"
}

app.use(function(req, res, next) {
    if (allowedOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/signup', (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    mailOptions.subject = `Signup at - ${req.get('Referrer')}`;
    mailOptions.html = getBody(name, email)
    sgMail.send(mailOptions, function (err, info) {
       if(err) {
          console.error(err)
          res.status(500).send("Tislam Alekha. But failed");
        }
       else {
         console.log(`request sent. [name=${name}, email=${email}]`)
         res.status(200).send("Tislam Alekha.");
       }
    });
});

app.options('*', function(req, res) {
    res.send('options checked');
});

app.all('*', function(req, res) {
    res.status(418);
    res.send('Or so I like to think.');
});

app.listen(port, function(){
    console.log("Server up on %s", port)
});