'use strict'

const express = require('express')
const router = express.Router()
const knex = require('../knex')
const humps = require('humps')

// YOUR CODE HERE
//GET all books
router.get('/', function(req, res, next) {
  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title')
    .then((books) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(humps.camelizeKeys(books)))
  })
  .catch((err) => next(err))
})

//GET a single, requested book
router.get('/:id', function(req, res, next) {
  const id = req.params.id

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title')
    .where('id', id)
    .then((books) => {
      if(books.length < 1) {
        res.sendStatus(404)
      }
      res.setHeader('Content-Type','application/json')
      res.send(JSON.stringify(humps.camelizeKeys(books[0])))
    })
    .catch((err) => next(err))
})

// POST a new book
router.post('/', function(req, res, next) {
  const title = req.body.title
  const author = req.body.author
  const genre = req.body.genre
  const description = req.body.description
  const coverUrl = req.body.coverUrl

  knex('books')
    .insert({title: title,
      author: author,
      genre: genre,
      description: description,
      cover_url: coverUrl},
      '*')
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]))
    })
    .catch((err) => next(err))
})

//PATCH an existing book
router.patch('/:id', function(req, res, next) {
  const id = req.params.id
  const title = req.body.title
  const author = req.body.author
  const genre = req.body.genre
  const description = req.body.description
  const coverUrl = req.body.coverUrl
  //refactor later with es6 syntax

  let responseObj = {}

  if (id) {
    responseObj.id = id
  }

  if (title) {
    responseObj.title = title
  }

  if (author) {
    responseObj.author = author
  }

  if (genre) {
    responseObj.genre = genre
  }

  if (description) {
    responseObj.description = description
  }

  if (coverUrl) {
    responseObj.coverUrl = coverUrl
  }

  knex('books')
    .update({title: title, author: author, genre: genre, description: description, cover_url: coverUrl})
    .where('id', id)
    .then((rowsAffected) => {
      // console.log(rowsAffected)
      if(rowsAffected !== 1) {
        return res.sendStatus(400)
      }
      res.send(responseObj)
    })
    .catch((err) => next(err))
})

//DELETE an existing book
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  let book

  knex('books')
    .select('title', 'author', 'genre', 'description', 'cover_url')
    .where('id', id)
    .then((bookData) => {
      book = bookData[0]
    })

    knex('books')
      .del()
      .where('id', id)
      .then((rowsAffected) => {
        if(rowsAffected !== 1) {
          return res.sendStatus(404)
        }
      res.send(humps.camelizeKeys(book))
    })
    .catch((err) => next(err))
})

module.exports = router
