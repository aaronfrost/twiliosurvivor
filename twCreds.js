modules.exports = {
  TWILIO_SID: 'TWILIO_SID_HERE',
  TWILIO_AUTHTOKEN: 'TWILIO_AUTHTOKEN_HERE'
};

if(module.exports.TWILIO_SID == 'TWILIO_SID_HERE'){
  console.log('WRONG WRONG WRONG WRONG WRONG!!!!!!!');
  console.log('You forget to put your twilio creds into twCreds.js. Please do that and try again.');
}
