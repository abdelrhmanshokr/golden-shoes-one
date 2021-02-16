const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const Record = require('../models/records');

exports.get_all_users = (req, res, next) => {
    User.find({})
        .then((users) => {
            res.status(201).send(users);
        })
        .catch(next);
};


exports.add_new_user = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then((user) => {
            res.status(201).send(user);
        })
        .catch(next);
};


exports.modify_an_existing_user = (req, res, next) => {
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
};


exports.delete_a_user = (req, res, next) => {
    User.findByIdAndRemove({ _id: req.params.userId })
    .then((user) => {
        res.status(200).send(user);
        })
        .catch(next);
};


exports.signup = (req, res, next) => {
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
};


exports.login = (req, res, next) => {
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
};


exports.get_all_purchases_by_on_user = (req, res, next) => {
    Record.find({ userId: req.params.userId })
        .then(records => {
            return res.status(200).send(records);
        })
        .catch(next);
};

