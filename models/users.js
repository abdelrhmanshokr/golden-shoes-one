const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create user's schema
const UserSchema = new Schema({
    userName: {
        // TODO string accepts numbers it has to only accept ints
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        // TODO make this match any 11 digit mobile number or any 7 digit phone number
        // match: (/\d/g).length===11
    },
    password: {
        // string accepts numbers it has to only accept ints
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: 0
    }


    // purchasesIds: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Shoe'
    // }],
    // recordsIds: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Record'
    // }]
});


// create a model out of this schema 
const User = mongoose.model('user', UserSchema);


// export this model
module.exports = User;