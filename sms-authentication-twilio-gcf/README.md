# 2FA

Example of 2-factor authentication using twilio, google cloud functions and datastore

## Requirements

- An active twilio account. Create here [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- An active Google Cloud Platform project with App Engine Enabled
- Datastore API enabled

## How to run on your side

- Replace `accountSid`, `authToken` and `twilioPhoneNumber` with your values from [twilio's console page](https://www.twilio.com/console).
- Update your staging bucket name in package.json's deploy script

## Test it

- Send a CURL request with your phone number to the deployed function URL

``` bash
curl --request GET --url 'https://<replace_this_with_yours>.cloudfunctions.net/smsAuth?phoneNumber=<your_phone_number>'
```

- This will send a 6 digit auth token on your phone number. Pass it in the following post request to get the success response

``` bash
curl --request POST --url 'https://<replace_this_with_yours>.cloudfunctions.net/smsAuth?phoneNumber=<your_phone_number>' --header 'content-type: application/json' --data '{"token": "<token_you_recieved>"}'
```

- You can use success response from the API to consider 2FA successful
- Any other response means unauthenticated

## Pre-Production enhancements

You might wanna do these in order to make sure you are more secure than normal.

- Change 6 digit to something more suitable according to your audience
- Look into a random number generator that had good entropy to make sure randomness is guranteed
- Set a default timeout limit for an active token
- Use a proxy to authenticate your requests to GCF
