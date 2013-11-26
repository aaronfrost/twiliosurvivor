var  express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , twilio = require('twilio');

// Load twilio properties
var TWILIO_SID = process.env.TWILIO_SID,
    TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;

var HOST_NUMBER = '+18016236842';
var MY_NUMBER = '+18017585121';
var MY_HOSTNAME = 'http://fast-wildwood-2613.herokuapp.com/'


// Create twilio client
var twilioClient = twilio(TWILIO_SID, TWILIO_AUTHTOKEN);


// Start server
var port = process.env.PORT || 5001;
server.listen(port);
console.log("server listening on port " + port);


// Configure express
app.use(express.bodyParser());
app.use("/", express.static(__dirname + '/public'));


// Configure routes
app.get('/twilio/account', function(request, response) {
  twilioClient.accounts(TWILIO_SID).get(function(err, account) {
    if(err) {
      response.send({});
    } else {
      response.send({
        friendlyName: account.friendly_name,
        created: account.date_created,
        sid: account.sid,
        status: account.status
      });
    }
  });
});


// Challenge 0
app.get('/ch0/:name', function(request, response){
  var name = request.params.name;

  twilioClient.sendSms({
    to: HOST_NUMBER,
    from: MY_NUMBER,
    body: 'hello ' + name
  },function(error, responseData){
    console.log('error', error, responseData);
  });

  response.end('success');
});


// Challenge 1
app.get('/ch1', function (req, res) {
  twilioClient.sendSms({
    to: HOST_NUMBER,
    from: MY_NUMBER,
    body:'CALLME'
  }, function (err, responseData) {
    console.log('error', err, responseData);
  });

  res.end('OK');
});

var mp3;


// Challenge 2
app.get('/ch2', function(req, res) {
  twilioClient.makeCall({
    to: '+18013807870',
    from: MY_NUMBER,
    url: MY_HOSTNAME + '/mp3'
  });

  res.end("OK");
});

// Challenge 3
app.get("/ch3", function (req, res) {
  twilioClient.makeCall({
    to: '+18013807870',
    from: MY_NUMBER,
    url: MY_HOSTNAME + '/ch3/1'
  });

  res.end('OK');
});

app.post('/ch3/1', function(req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml.pause({length:2})
    .say('Hello, this is round 3', {voice:'woman', language:'en-gb'})
    .pause({length:1})
    .gather({
      action: MY_HOSTNAME + '/ch3/2',
      numDigits:5
    }, function () {
      this.say("Please enter five numbers", {voice:'woman', language:'en-gb'});
    });

  res.writeHead(200, {'Content-Type':'text/xml'});
  res.end(twiml.toString());
});

app.post('/ch3/2', function (req, res) {
  console.log(req.body.Digits);
  var digits = req.body.Digits.split('');

  var total = 0;
  digits.forEach(function (d) {
    total += parseInt(d);
  });

  var twiml = new twilio.TwimlResponse();
  twiml.say('Well Mister Wisenheimer, your total is ' + total, {voice:'woman', language:'en-gb'});

  twilioClient.sendSms({
    to: HOST_NUMBER,
    from: MY_NUMBER,
    body: total
  }, function (err, responseData) {
    console.log('error', err, responseData);
  });

  res.writeHead(200, {'Content-Type':'text/xml'});
  res.end(twiml.toString());
});


app.post('/ch3/3', function(req, res) {
  console.log(req.body.TranscriptionText);

  twilioClient.sendSms({
    to: HOST_NUMBER,
    from: MY_NUMBER,
    body: 'winner ' + req.body.TranscriptionText
  }, function (err, responseData) {
    console.log('error', err, responseData);
  });

  res.end('OK');
});


// USED FOR FINAL of Challenge 3
app.post('/voice', function(req, res){
  var twiml = new twilio.TwimlResponse();
  twiml.pause({length:1});
  twiml.say('Hello, say something');
  twiml.record({transcribe:true, transcribeCallback: MY_HOSTNAME + '/ch3/3'});

  res.writeHead(200, {'Content-Type':'text/xml'});
  res.end(twiml.toString());
});



app.post('/sms', function (req, res) {
  console.log("Got a message: ", req.body);

  res.end('OK');
});


app.post('/mp3', function(req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml.say('Hello there. Are you having fun yet?', {voice:'woman', language:'en-gb'})
    .pause({length:2})
    .play('http://twilio.coderighteo.us/cmm.mp3');

  res.writeHead(200, {'Content-Type':'text/xml'});
  res.end(twiml.toString());
});



// For testing
app.post('/sms/send/:to', function(request, response){
  var to = request.params.to;
  var msg = request.body;

  twilioClient.sendSms({
    to: to,
    from: MY_NUMBER,
    body: request.body
  },function(error, responseData){
    console.log('error', error, responseData);
  });

  response.end('success');
});
