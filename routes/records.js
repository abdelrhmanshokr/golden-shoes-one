const express = require('express');
const router = express.Router();
const Record = require('../models/records');
const User = require('../models/users');
const Shoe = require('../models/shoes');

const checkAuth = require('../middlewares/check-auth');
const checkAdmin = require('../middlewares/check-admin');


// TODO only for admins 
router.get('/', checkAdmin, (req, res, next) => {
    Record.find({})
        .then((records) => {
            res.status(200).send(records);
        })
        .catch(next);
});

 
// TODO decrease number of available shoes in stock by some amount
// TODO link the purchase to the user and the shoe
router.post('/', checkAuth, (req, res, next) => {
    let record = new Record(req.body);
    record.save()
        .then((record) => {
            // find the auth user and push the record to it 
            User.findOne({ _id: req.user.id })
                .then((user) => {
                    // pushing shoesIds
                    user.purchacesIds.push(req.purchaseIds);
                    // pushing the recordIds
                    user.recordsIds.push(record.id);
                })
                .catch(next);

            // find the shoe and push the record and the user Ids to it
            Shoe.find({ _id: req.shoe.id})
                .then((shoe) => {
                    // pushing recordId
                    shoe.recordsIds.push(record.id);
                    // pushing userId
                    shoe.userId.push(req.userId);
                })
                .catch(next);

            res.status(200).send(record);
        })
        .catch(next);
});


// TODO check if admins can also modify a record
// TODO adjust number of available shoes in stock by some amount 
router.put('/:id', checkAuth, (req, res, next) => {
    Record.findByIdAndUpdate({ _id: req.params.id }, req.body)
        .then(() => {
            Record.findOne({ _id: req.params.id})
                .then((record) => {
                    res.status(200).send(record);
                })
                .catch(next);
        })
        .catch(next);
});


// TODO check if admins can also delete a record
router.delete('/:id', checkAuth, (req, res, next) => {
    Record.findByIdAndRemove({ _id: req.params.id})
        .then((record) => {
            return res.status(200).send(record);
        })
        .catch(next);
});


module.exports = router;