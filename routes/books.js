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

//POST a new book
router.post('/', function(req, res, next) {
  console.log(req.body)
  console.log('id');
  const title = req.body.title
  const author = req.body.author
  const genre = req.body.author
  const description = req.body.description
  const cover_url = req.body.cover_url
  // const created_at = req.body.created_at
  // const updated_at = req.body.updated_at

  knex('books')
    .insert({title: title, author: author, genre: genre, description: description, cover_url: cover_url})
    .then(() => {
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

//PATCH an existing book
router.patch('/:id', function(req, res, next) {
  console.log(req.body)
  console.log(req.params)
  const id = req.params.id
  const title = req.body.title
  const author = req.body.author
  const genre = req.body.author
  const description = req.body.description
  const cover_url = req.body.cover_url
  //refactor later with es6 syntax

  knex('books')
    .update({title: title, author: author, genre: genre, description: description, cover_url: cover_url})
    .where('id', id)
    .then((rowsAffected) => {
      console.log(rowsAffected)
      if(rowsAffected !== 1) {
        return res.sendStatus(400)
      }
      res.setHeader('Content-Type', 'application/json')
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

//DELETE an existing book
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  let book

  console.log(knex('books').where('id', id))
  knex('books')
    .del()
    .where('id', id)
    .then((rowsAffected) => {
      if(rowsAffected !== 1) {
        return res.sendStatus(404)
      }

      book = rowsAffected
      console.log(book)

      let responseObj = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        cover_url: book.cover_url
      }
      // res.setHeader('Content-Type', 'application/json')
      res.send(responseObj)
    })
    .catch((err) => next(err))
})

module.exports = router
