'use strict'

const datastore = require('@google-cloud/datastore')()

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

    let token = 'RED'
    const kind = 'smsAuth'
    let phoneNumberKey = datastore.key([kind, phoneNumber])
    let phoneNumberTokenPair = {
      key: phoneNumberKey,
      data: {
        phoneNumber: phoneNumber,
        token: token
      }
    }

    datastore.save(phoneNumberTokenPair)
      .then(() => {
        console.log(`Saved ${phoneNumberTokenPair.key.name}: ${phoneNumberTokenPair.data.description}`)
        res.send('Message sent! Please input your token to continue.')
      })
      .catch((err) => {
        console.error('ERROR:', err)
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
        console.log(results)
        if (results[0].token === userToken) {
          datastore.delete(phoneNumberKey)
            .then(() => {
              console.log(`${phoneNumberKey} deleted successfully.`)
              res.send('Welcome to Matrix!')
            })
            .catch((err) => {
              console.error('ERROR:', err)
              res.status(500).send({
                error: err
              })
            })
        } else {
          res.status(400).send('Your adventure ends here.')
        }
      })
      .catch((err) => {
        transaction.rollback()
        console.error('ERROR:', err)
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
