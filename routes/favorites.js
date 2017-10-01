'use strict';

require('dotenv').load()
const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps = require('humps')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_KEY

// YOUR CODE HERE

//GET all the users favorites
router.get('/favorites', function(req, res, next) {

  jwt.verify(req.cookies.token, secret, function(err, payload) {
    if (err) {
      return res.sendStatus(401)
    }
    knex('favorites')
    .select('*')
      .where('favorites.id', payload.userId)
      .innerJoin('books', 'favorites.book_id', 'books.id')
      .then((data) => {
        if(!data) {
          res.sendStatus(404)
        }
        res.send(humps.camelizeKeys(data))
      })
      .catch((err) => next(err))
    })
})

//GET a specific user favorite, returning true or false if that favorite is or isn't in their list
router.get('/favorites/check', function(req, res, next) {

  jwt.verify(req.cookies.token, secret, function(err, payload) {
    if (err) {
      return res.sendStatus(401)
    }
    knex('favorites')
    .select('*')
    .where('book_id', req.query.bookId)
    .then((data) => {
      if(data.length === 0) {
        res.status(200)
        return res.send('false')
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      return res.send('true')
    })
  .catch((err) => next(err))
    })
})

//POST a new favorite, specified by request body
router.post('/favorites', function(req, res, next) {

  jwt.verify(req.cookies.token, secret, function(err, payload) {
    if (err) {
      return res.sendStatus(401)
    }
    if(!req.body.bookId) {
      return res.send("Please specify a bookId")
    }

    knex('favorites')
      .insert({
        book_id: req.body.bookId,
        user_id: payload.userId
      }, '*')
      .then((data) => {
        if(data.length === 0){
          res.sendStatus(404)
        }
        res.send(humps.camelizeKeys(data[0]))
      })
    .catch((err) => next(err))
    })
})

// DELETE one, request body specified, favorite
router.delete('/favorites', function(req, res, next) {

  jwt.verify(req.cookies.token, secret, function(err, payload) {
    if (err) {
      return res.sendStatus(401)
    }

    knex('favorites')
    .returning(['book_id', 'user_id'])
    .del()
    .where('book_id', req.body.bookId)
    .then((data) => {
      if (data.length === 0) {
        return res.sendStatus(404)
      }
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      res.send(humps.camelizeKeys(data[0]))
    })
  .catch((err) => next(err))
  })
})

module.exports = router;
