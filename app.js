const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const shoeRoutes = require('./routes/shoes');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');


// middlewares
app.use('public/uploads/images', express.static('public/uploads/images')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use('/api/shoes', shoeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);


// error handling middleware
app.use((err, req, res, next) => {
    res.send(400, err.message);
});


// connect to mongodb 
mongoose.connect('mongodb://localhost/golden-shoes', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('connected to mongodb');
    })
    .catch(err => {
        console.log('Error', err.message);
    });


// global promise
mongoose.Promise = global.Promise;


// a port to listen on 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});