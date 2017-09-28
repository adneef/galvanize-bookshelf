'use strict';

const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const humps = require('humps')

// YOUR CODE HERE
router.post('/users', function(req, res, next) {
  let first_name = humps.decamelizeKeys(req.body.firstName)
  let last_name = humps.decamelizeKeys(req.body.lastName)
  let email = req.body.email
  let password = req.body.password

bcrypt.hash(password, 6, function(err, hash) {
  knex('users')
  .returning(['id', 'first_name', 'last_name', 'email'])
    .insert({first_name: first_name,
      last_name: last_name,
      email: email,
      hashed_password: hash})
    .then((user) => {

  res.send(humps.camelizeKeys(user[0]))
  })
  .catch((err) => next(err))
})

})

module.exports = router;
