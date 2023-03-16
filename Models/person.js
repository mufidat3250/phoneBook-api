require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
mongoose.connect(url)
.then((result)=> {
    console.log('connect to mongoDb')
}).catch((error)=> {
    console.log('error connecting to mongo', error.message)
})
const personSchema = new mongoose.Schema({
    name:String,
    number:Number
})
personSchema.set('toJSON', {
    transform:(document, returedObject)=>{
        returedObject.id = returedObject._id.toString()
        delete returedObject._id
        delete returedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)