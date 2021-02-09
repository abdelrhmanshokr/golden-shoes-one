const express = require('express');
const router = express.Router();
const Record = require('../models/records');

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
router.post('/', checkAuth, (req, res, next) => {
    let record = new Record(req.body);
    record.save()
        .then((record) => {
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