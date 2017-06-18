'use strict'

function getSMSToken (req, res) {
  let phoneNumber = req.query.phoneNumber
  if (phoneNumber === undefined) {
    res.status(400).send('A phone number is required.')
  } else {
    // todos
    // generate a 6 digit random number
    // save the number in datastore
    // use twilio library to send that message to the provided phone number and wait for the callback
    // if callback fails, remove the entry
    // entry structure: phoneNumber: token
    // if new token is generated, older one is replaced
    res.send('Message sent! Please input your token to continue.')
  }
}

function confirmSMSToken (req, res) {
  let phoneNumber = req.query.phoneNumber
  let userToken = req.body.token
  if (userToken === undefined || phoneNumber === undefined) {
    res.status(400).send('Please user token as well as phone number are required.')
  } else {
    // todos
    // check in datastore whether number corresponds to the correct token, in any other case, send error
    if (userToken === 'RED') {
      res.send('Welcome to Matrix!')
    } else {
      res.status(400).send('Your adventure ends here.')
    }
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
