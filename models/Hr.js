const mongoose = require('mongoose')

const hrSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    company: {
        type: String,
        default: ''
    }
},{
    timestamps: true
})

module.exports = mongoose.model('HR', hrSchema)