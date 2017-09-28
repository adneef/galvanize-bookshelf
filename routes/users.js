'use strict';

const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')

// YOUR CODE HERE
router.post('/users', function(req, res, next) {
  let {first_name, last_name, email, password} = req.body

})

module.exports = router;
