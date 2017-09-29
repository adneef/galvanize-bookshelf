'use strict';

const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const humps = require('humps')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_KEY

//POST to create token
router.post('/token', function(req, res, next) {
  knex('users')
    .where('email' = req.body.email)
    .first()
    .then((data) => {
      let match = bcrypt.compareSync(req.body.password, data.hashed_password)
       if (!match) {
         res.cookies.token = jwt.sign({userId: data.id}, secret)
       }
    })

})



// GET request and verify token
router.get('/token', function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, function(err, payload) {
    if (err) {
      return res.send(false)
    }
    res.send(true)
  })
})

module.exports = router
