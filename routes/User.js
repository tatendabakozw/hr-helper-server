const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'hr'],
        default: 'employee'
    },
    salary: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    id: {
        type: String,
        required: true,
    },
    work_type: {
        type: String,
        enum: ['remote', 'office']
    },
    

},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)