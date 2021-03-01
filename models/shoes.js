const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create shoe's schema 
const ShoeSchema = new Schema({
    price: {
        type: Number,
        required: true,
    },
    category: { 
        type: String,
        enum: ['sneakers', 'sandles', 'classic'],
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                let regularExpression = /[a-z]+/i;
                return v.match(regularExpression);
            }
        }
    },
    subCategory: {
        // String passes numbers so enum will accept only these defined values
        type: String,
        enum: ['male', 'female', 'child'],
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                let regularExpression = /[a-z]+/i;
                return v.match(regularExpression);
            }
        }
    },
    size: [{
        type: Number,
        required: true
    }],
    image: {
        type: String,

        required: [true, 'image is required'],
    },
});



// create a model out of this schema 
const Shoe = mongoose.model('shoe', ShoeSchema);


// export this model 
module.exports = Shoe;