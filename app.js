var  express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , twilio = require('twilio');

// Load twilio properties
//TODO: YOU NEED TO GO INTO THIS FILE AND PASTE YOUR TWILIO CREDS
var twCreds = require('./twCreds');


var HOST_NUMBER = '+18016236842';
var MY_NUMBER = '+YOUR_TWILIO_NUMBER';
var MY_HOSTNAME = 'YOUR_DIGITAL_OCEAN_IP'

// Create twilio client
var twilioClient = twilio(twCreds.TWILIO_SID, twCreds.TWILIO_AUTHTOKEN);

// Body parser middleware
app.use(express.bodyParser());

// Start server
var port = process.env.PORT || 5001;
server.listen(port);
console.log("server listening on port " + port);


// Configure express
app.use(express.bodyParser());
app.use("/", express.static(__dirname + '/public'));


// Configure routes
app.get('/twilio/account', function(request, response) {
	twilioClient.accounts(twCreds.TWILIO_SID).get(function(err, account) {
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


  response.send('ok');
});
