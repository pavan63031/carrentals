const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : String,
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    accountType : {
        type : String,
        enum : ['user','host'],
        default : 'user'
    }
})

module.exports = mongoose.model('user',userSchema);