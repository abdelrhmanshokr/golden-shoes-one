const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create shoe's schema 
const ShoeSchema = new Schema({
    price: {
        type: Number,

        required: true,
    },
    category: {
        // String passes numbers so enum will accept only these defined values 
        type: String,

        enum: ['sneakers', 'sandles', 'classic'],

        required: true,
    },
    subCategory: {
        // String passes numbers so enum will accept only these defined values
        type: String,

        enum: ['male', 'female', 'child'],

        required: true,
    },
    size: [{
        type: Number,
        required: true
    }],
    image: {
        type: String,

        required: [true, 'image is required'],
    },


    recordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});



// create a model out of this schema 
const Shoe = mongoose.model('shoe', ShoeSchema);


// export this model 
module.exports = Shoe;