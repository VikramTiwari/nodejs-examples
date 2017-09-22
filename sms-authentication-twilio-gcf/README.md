# 2FA

Example of 2-factor authentication using twilio, google cloud functions and datastore

## Requirements

- An active twilio account. Create here [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- An active Google Cloud Platform project with App Engine Enabled
- Datastore API enabled

## How to run on your side

- Replace `accountSid`, `authToken` and `twilioPhoneNumber` with your values from [twilio's console page](https://www.twilio.com/console).
- Update your staging bucket name in package.json's deploy script
