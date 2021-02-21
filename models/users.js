const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create user's schema
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                let regularExpression = /[a-z]+/i;
                return v.match(regularExpression);
            },
            message: 'Username should not start with a number, please try again'
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        
        validate: {
            validator: function(v){
                let regularExpression = /^(01)([0-9]{9})/;
                return v.match(regularExpression);
            },
            message: 'Invalid phone number, please try again with a valid phone number'
        }
    },
    password: {
        // can be both numbers strings a combination of both
        type: String,
        required: true,
        trim: true
    }
}); 


// create a model out of this schema 
const User = mongoose.model('user', UserSchema);


// export this model
module.exports = User;