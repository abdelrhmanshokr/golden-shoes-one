const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create record's schema
const RecordSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    

    // TODO add a flag to indicate if the purchase is deleted or not
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