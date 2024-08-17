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
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get the number of persons in DB
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>`
        )
    })
})

// Get info for 1 person passing ID from DB
app.get('/api/persons/:id', (request, response) => {
    Person.find({ _id: `${request.params.id}`}).then(persons => {
        if (persons) {
            response.json(persons)
        } else {
            response.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// Save new person in DB
app.post('/api/persons', (request, response) => {
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
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
