const path = require('path')
const fs = require('fs')

const app = require('express')();
const morgan = require('morgan')
const bodyParser = require('body-parser');
require('dotenv').config()

const mailProvider = require(`./providers/${process.env.EMAIL_PROVIDER}`)

const port = process.env.PORT || 3111

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common', {
    stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})
}));

let allowedOrigins = process.env.SUBSCRIBER_ALLOWED_CORS_ORIGINS.split(",")
let logDirectory = path.join(__dirname, 'log')

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getMailOptions(key, req) {
    let fields = process.env[`SUBSCRIBER_FIELDS_${key}`].split(",");
    var values = fields.map(field => [field, req.body[field]])

    let results = {}
    results.subject = `Signup at - ${req.get('Referrer')}`;
    results.to = process.env[`SUBSCRIBER_TO_EMAIL_${key}`].split(",");
    results.from = process.env[`SUBSCRIBER_FROM_EMAIL_${key}`];


    let html = "<p> Someone signed up from the site:<br/>";
    for (item in values) {
      html += `<br/><b>${capitalize(values[item][0])}:</b> ${values[item][1]}`
    }
    html += "<br/><br/><br/>Good luck!</p>";
    results.html = html;
    return results;
}

app.use(function(req, res, next) {
    if (allowedOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/signup', (req, res, next) => {

    let subscriberKey = req.body.key;
    if (!subscriberKey || !process.env[`SUBSCRIBER_TO_EMAIL_${subscriberKey}`]){
       return res.status(500).send("Invalid key provided.");
    }

    let mailOptions = getMailOptions(subscriberKey, req)

    mailProvider.send(mailOptions, function (err, info) {
       if(err) {
          console.error(err)
          res.status(500).send("Tislam Alekha. But failed");
        }
       else {
         console.log(`request sent. [${mailOptions.html}]`)
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