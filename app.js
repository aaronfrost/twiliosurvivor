var  express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , twilio = require('twilio');

// Load twilio properties
var TWILIO_SID = process.env.TWILIO_SID,
	  TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;

var HOST_NUMBER = '+18016236842';
var MY_NUMBER = '+18018902560';
var MY_HOSTNAME = 'http://obscure-ocean-9485.herokuapp.com'

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



app.post('/start/:name', function(request, response) {
  // Start here

  twilioClient.sendSms({
    to: HOST_NUMBER,
    from: MY_NUMBER,
    body: 'hello ' + request.params.name
  });

  response.send('ok');
});
