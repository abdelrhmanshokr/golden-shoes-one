const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const Record = require('../models/records');

const checkAuth = require('../middlewares/check-auth');
const checkAdmin = require('../middlewares/check-admin');


/**
 * @swagger
 * /api/users/:
 *  get:
 *    description: Use to request all users in the system
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  item:
 *                   type: any
 */
router.get('/', /*checkAdmin,*/ (req, res, next) => {
    User.find({})
        .then((users) => {
            res.status(200).send(users);
        })
        .catch(next);
}); 


// TODO only for admins check if this route is needed
router.post('/', (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then((user) => {
            res.status(201).send(user);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/users/{userId}:
 *  put:
 *    description: Use to modify an existing user
 *    parameters:
 *      - name: userId
 *        description: user's Id to update
 *        in: path
 *        schema:
 *          type: integer
 *        required: true
 *      - name: reqBody
 *        description: request body 
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *               userName: 
 *                  type: string
 *               phoneNumber:
 *                  type: integer
 *               password:
 *                  type: string
 *          required:
 *              - userName
 *              - phoneNumber
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully modified an exising user
 */
// TODO check if admins can change it if so add another middleware to handle it 
// TODO registred user or the admin middleware 
router.put('/:id', /*checkAuth,*/ (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            if(user){
                User.find({ phoneNumber: req.body.phoneNumber })
                    .then(users => {
                        if(users.length > 0){
                            return res.status(422).json({
                                message: `this phoneNumber ${req.body.phoneNumber} already exists please try again with another phone number`
                            });
                        }else{
                            // new phone number is valid now check hash the password
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if(err){
                                    return res.status(500).json({
                                        errr: err
                                    });
                                }else{
                                    user.update({
                                        userName: req.body.userName,
                                        phoneNumber: req.body.phoneNumber,
                                        password: hash
                                    });
                                    user.save()
                                        .then(user => {
                                            console.log(user);
                                            return res.status(201).json({
                                                message: 'user updated'
                                            });
                                        })
                                        .catch(next);
                                }
                            });
                        }
                    });
            }else{
                return res.status(404).json({
                    message: 'this user does not exist'
                })
            }
        });
    // User.findByIdAndUpdate({ _id: req.params.id }, req.body)
    // .then(() => {
    //     User.findOne({ _id: req.params.id })
    //     .then((user) => {
    //         res.status(200).send(user);
    //     })
    //     .catch(next);
    // })
    // .catch(next);
});


/**
 * @swagger
 * /api/users/{userId}:
 *  delete:
 *    description: Use to delete one user by its Id
 *    parameters:
 *      - name: userId
 *        description: users's Id 
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a user
 */
// TODO admins can delete the user or a registered user can delete their account
// TODO registred user or the admin middleware 
router.delete('/:userId', /*checkAuth,*/ (req, res, next) => {
    User.findByIdAndRemove({ _id: req.params.userId })
    .then((user) => {
        res.status(200).send(user);
        })
        .catch(next);
});


// signup end point
router.post('/signup', (req, res, next) => {
    // check if the user exists first 
    User.find({ phoneNumber: req.body.phoneNumber })
        .exec()
        .then(user => {
            if(user.length > 0){
                return res.status(422).json({
                    message: `this phoneNumber ${req.body.phoneNumber} already exists please try again with another phone number`
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            errr: err
                        });
                    }else{
                        const user = new User({
                            userName: req.body.userName,
                            phoneNumber: req.body.phoneNumber,
                            password: hash
                        });
                        user.save()
                            .then(user => {
                                console.log(user);
                                return res.status(201).json({
                                    message: 'user created'
                                });
                            })
                            .catch(next);
                    }
                });
            };
        })
        .catch();
});


// login end point
router.post('/login', (req, res, next) => {
    User.find({ userName: req.body.userName, phoneNumber: req.body.phoneNumber })
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }else{  
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if(err){
                        return res.status(401).json({
                            message: 'Authentication failed'
                        });
                    }else if(result){
                        // create the jwt 
                        const token = jwt.sign(
                            {
                                phoneNumber: user[0].phoneNumber,
                                user_id: user[0]._id,
                                isAdmin: user[0].isAdmin
                            },
                            'secret', // this could be stored as an env variable but just like this for now 
                            {
                                expiresIn: '1h'
                            }
                        )
                        return res.status(200).json({
                            message: 'Authentication successful',
                            token: token
                        }); 
                    }
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }); 
            }
        })
        .catch(next);
});


// TODO how to return this user's purchases to the same registered user
// // TODO registred user or the admin middleware how not to pass both this or that
router.get('/allpurchases/:id', /*checkAuth,*/ (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            Record.find({ userId: user.id })
                .then(records => {
                    return res.status(200).send(records);
                })
                .catch(next);
        })
        .catch(next);
});

    
    
module.exports = router;