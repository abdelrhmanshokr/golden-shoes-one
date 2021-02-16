const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create record's schema
const RecordSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    userName: {
        type: String,
        required: true,
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


    // TODO add a flag to indicate if the purchase is deleted or not
    purchasesIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Shoe',
        required: true,
    }]
});


// create a model out of this schema 
const Record = mongoose.model('record', RecordSchema);


// export this model 
module.exports = Record;