'use strict'

const express = require('express')
const router = express.Router()
const knex = require('../knex')

// YOUR CODE HERE
router.get('/', function(req, res, next) {
  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('id')
    .then((items) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(books))
  })
  .catch((err) => next(err)
})

module.exports = router
