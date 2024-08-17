// Adds .env to the index
require('dotenv').config()

// Add Express as framework to deal with HTTP methods
const express = require('express')

// Create Express instance
const app = express()

// Create morgan instance
const morgan = require('morgan')

// Create Person DB connection
const Person = require('./models/person')

// Logger middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// Frontend import
app.use(express.static('dist'))

// Define new token for morgan -> Print body
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

// Json tools
app.use(express.json())

// Add requestLogger as middleware
app.use(requestLogger)

// Define structure for Morgan Logger Middleware
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.content(req, res)
    ].join(' ')
}))

// Get all persons from DB
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

// Get the number of persons in DB
app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>`
        )
    })
    .catch(error => next(error))
})

// Get info for 1 person passing ID from DB
app.get('/api/persons/:id', (request, response, next) => {
    Person.find({ _id: `${request.params.id}`})
    .then(persons => {
        if (persons) {
            response.json(persons)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// Remove person from DB passing ID
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id) 
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// Save new person in DB
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: `${Math.random() * 9999}`,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
