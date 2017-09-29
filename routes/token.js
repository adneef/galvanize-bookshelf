'use strict';

require('dotenv').load()
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
    .select('*')
    .where('email', req.body.email)
    .first()
    .then((data) => {
      if(!data) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(400)
        return res.send("Bad email or password")
      }

      let match = bcrypt.compareSync(req.body.password, data.hashed_password)
        if (!match) {
          res.setHeader('Content-Type', 'text/plain')
          res.status(400)
          return res.send("Bad email or password")
        }

       const token = jwt.sign({userId: data.id}, secret)

       res.cookie('token', token,
       { httpOnly: true })
       delete data.hashed_password
       res.send(humps.camelizeKeys(data))
    })
    .catch((err) => next(err))
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

router.delete('/token', function(req, res, next) {
  res.clearCookie('token')
  res.sendStatus(200)
})

module.exports = router
