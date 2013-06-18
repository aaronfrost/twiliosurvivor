var  express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , twilio = require('twilio');

// Load twilio properties
var TWILIO_SID = process.env.TWILIO_SID,
	TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;

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



app.post('/sms/send/:to', function(request, response){
	var to = request.params.to;
	var msg = request.body;

	// START HERE

	response.end('success');
});
