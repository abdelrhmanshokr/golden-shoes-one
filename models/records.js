const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create record's schema
const RecordSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    stat: { 
        // if 0 then it's not delivered yet, if 1 then it's delivered 
        type: Boolean,
        default: 0
    },


    purchaseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Shoe',
        required: true,
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


// create a model out of this schema 
const Record = mongoose.model('record', RecordSchema);


// export this model 
module.exports = Record;