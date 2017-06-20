'use strict'

const datastore = require('@google-cloud/datastore')()
const Twilio = require('twilio')

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token' // Your Auth Token from www.twilio.com/console
const twilioPhoneNumber = '+12345678901' // Your phone number that is allocated to you by twilio
var twilioClient = new Twilio(accountSid, authToken)

function getSMSToken (req, res) {
  let phoneNumber = req.query.phoneNumber
  if (phoneNumber === undefined) {
    res.status(400).send('A phone number is required.')
  } else {
    let token = ('' + Math.random()).substring(2, 8)
    twilioClient.messages.create({
      body: `Your token for GCF is: ${token}`,
      to: `+1${phoneNumber}`, // Text this number
      from: twilioPhoneNumber // From a valid Twilio number
    })
      .then((message) => {
        if (message.sid) {
          // message sent
          let phoneNumberKey = datastore.key(['smsAuth', phoneNumber])
          let phoneNumberTokenPair = {
            key: phoneNumberKey,
            data: {
              phoneNumber: phoneNumber,
              token: token
            }
          }

          datastore.save(phoneNumberTokenPair)
            .then(() => {
              // console.log(`Saved ${phoneNumberTokenPair.key.name}: ${phoneNumberTokenPair.data.description}`)
              res.send('Message sent! Please input your token to continue.')
            })
            .catch((err) => {
              // console.error('ERROR:', err)
              res.status(500).send({
                error: err
              })
            })
        } else {
          res.status(500).send({
            error: 'Unable to send message at the moment.'
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          error: err
        })
      })
  }
}

function confirmSMSToken (req, res) {
  let phoneNumber = req.query.phoneNumber
  let userToken = req.body.token
  if (userToken === undefined || phoneNumber === undefined) {
    res.status(400).send('Please user token as well as phone number are required.')
  } else {
    const transaction = datastore.transaction()
    const phoneNumberKey = datastore.key(['smsAuth', phoneNumber])

    transaction.run()
      .then(() => transaction.get(phoneNumberKey))
      .then((results) => {
        if (results !== undefined && results.length > 0) {
          if (results[0].token === userToken) {
            datastore.delete(phoneNumberKey)
              .then(() => {
                // console.log(`${phoneNumberKey} deleted successfully.`)
                res.send('Authentication Successful')
              })
              .catch((err) => {
                // console.error('ERROR:', err)
                res.status(500).send({
                  error: err
                })
              })
          } else {
            res.status(400).send('Seems you have wrong token.')
          }
        } else {
          res.status(400).send('No token requested for this phone number.')
        }
      })
      .catch((err) => {
        transaction.rollback()
        // console.error('ERROR:', err)
        res.status(500).send({
          error: err
        })
      })
  }
}

exports.smsAuth = function smsAuth (req, res) {
  switch (req.method) {
    case 'GET':
      getSMSToken(req, res)
      break
    case 'POST':
      confirmSMSToken(req, res)
      break
    default:
      res.status(500).send({
        error: 'Something broke!'
      })
      break
  }
}
