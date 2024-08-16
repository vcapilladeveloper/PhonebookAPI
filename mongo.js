// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

// const url =
//     `mongodb+srv://victorcapilladeveloper:${password}@cluster0.ekukp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// mongoose.set('strictQuery', false)

// mongoose.connect(url)

// const personsSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

// const Person = mongoose.model('Person', personsSchema)

// if (name != null && number != null) {
//     const person = new Person({
//         name: `${name}`,
//         number: `${number}`,
//     })

//     person.save().then(result => {
//         console.log(`added ${name} number ${number} to phonebook`)
//         mongoose.connection.close()
//     })
// } else {
//     Person.find({}).then(result => {
//         console.log("phonebook:")
//         result.forEach(person => {
//             console.log(person.name, person.number)
//         })
//         mongoose.connection.close()
//     })
// }