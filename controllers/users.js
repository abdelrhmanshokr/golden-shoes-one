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
    let user = new User({
        userName: req.body.userName.trimStart().trimEnd(),
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    });
    user.save()
        .then((user) => {
            res.status(201).send(user);
        })
        .catch(next);
};


exports.modify_an_existing_user = (req, res, next) => {
    User.findOne({ _id: req.params.userId })
        .then(user => {
            if(!user){
                return res.status(422).json({
                    message: 'This user does not exist'
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            err: err
                        });
                    }else{
                        User.findOne({ _id: req.params.userId })
                            .then(user => {
                                if(!user){
                                    return res.status(500).json({
                                        message: 'This user does not exist'
                                    });
                                }else{
                                    // check if the user changer their number then we pass the new number
                                    if(user.phoneNumber != req.body.phoneNumber){
                                        user.userName = req.body.userName,
                                        user.phoneNumber = req.body.phoneNumber,
                                        user.password = hash
                                    }else{
                                        // if the user doesn't change their number we don't need to pass it
                                        user.userName = req.body.userName,
                                        user.password = hash
                                    }
                                };
                                // save the user
                                user.save()
                                    .then(() => {
                                        User.findOne({ _id: req.params.userId })
                                            .then(updatedUser => {
                                                return res.status(200).json({
                                                    message: 'User updated',
                                                    user: updatedUser
                                                });
                                            })
                                            .catch(next);
                                    })
                                    .catch(next);
                            })
                            .catch(next);
                    }
                });
            };
        })
        .catch();
};


exports.delete_a_user = (req, res, next) => {
    User.findByIdAndRemove({ _id: req.params.userId })
    .then((user) => {
        res.status(200).send(user);
        })
        .catch(next);
};


exports.user_signup = (req, res, next) => {
    // check if the user exists first 
    User.find({ phoneNumber: req.body.phoneNumber })
        .exec()
        .then(user => {
            if(user.length > 0){
                return res.status(422).json({
                    message: `this phone number ${req.body.phoneNumber} already exists please try again with another phone number`
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            err: err
                        });
                    }else{
                        const user = new User({
                            userName: req.body.userName.trimStart().trimEnd(),
                            phoneNumber: req.body.phoneNumber,
                            password: hash
                        });
                        user.save()
                            .then(user => {
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


exports.user_login = (req, res, next) => {
    User.find({ userName: req.body.userName.trimStart().trimEnd(), phoneNumber: req.body.phoneNumber })
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
                                userName: user[0].userName
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
            if(records.length == 0){
                return res.status(200).json({
                    message: 'This user has no previous purchases'
                })
            }else{
                return res.status(200).send(records);
            }
        })
        .catch(next);
};

