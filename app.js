const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const shoeRoutes = require('./routes/shoes');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');


// swagger options
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    definition: {
        openapi: '3.0.n',
        info: {
            title: "golden-shoes",
            description: "shoes trading mobile app RESTful api",
            contact: {
                name: "golden-shoes"
            },
            servers: ["http://localhost:3000"]
        },
        components: {
            securitySchemes: {
              jwtAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
              },
            }
        },
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


// middlewares
app.use('public/uploads/images', express.static('public/uploads/images')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


app.use('/api/shoes', shoeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/golden-shoes-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// error handling middleware
app.use((err, req, res, next) => {
    return res.status(400).send(err.message);
});


// connect to mongodb 
mongoose.connect('mongodb+srv://admin:admin@golden-shoes-one.8vvhd.mongodb.net/golden-shoes?retryWrites=true&w=majority' 
                    /*|| 'mongodb://localhost/golden-shoes'*/, { 
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