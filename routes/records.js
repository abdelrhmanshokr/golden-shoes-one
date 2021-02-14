const express = require('express');
const router = express.Router();
const Record = require('../models/records');
const User = require('../models/users');
const Shoe = require('../models/shoes');

const checkAuth = require('../middlewares/check-auth');
const checkAdmin = require('../middlewares/check-admin');


/**
 * @swagger
 * /:
 *  get:
 *      description: Use to request all records
 *      responses:
 *      '200':
 *          description: A successful response 
 */
// TODO only for admins 
router.get('/', /*checkAdmin,*/ (req, res, next) => {
    Record.find({})
        .then((records) => {
            res.status(200).send(records);
        })
        .catch(next);
});



//TODO user gets their own records end point
router.get('/:userId', (req, res, next) => {
    Record.find({ userId: req.params.userId })
        .then((records) => {
            if(records.length > 0){
                return res.status(200).send(records);
            }else{
                return res.status(404).json({
                    message: 'No previous purchases for this user'
                });
            }
        })
        .catch(next);
});


/**
 * @swagger
 * /:
 *  post:
 *      description: Use to create/add a new record
 *      responses: 
 *      '200':
 *          description: A successful response
 */
// TODO decrease number of available shoes in stock by some amount
// TODO link the purchase to the user and the shoe
router.post('/', /*checkAuth,*/ (req, res, next) => {
    let record = new Record({
        purchaseIds: req.body.purchaseIds,
        userId: req.body.userId
    });
    record.save()
        .then((record) => {
            // find the auth user and push the record to it 
            User.find({ _id: req.userId })
                .then((user) => {
                    // pushing shoesIds
                    user.purchacesIds.push(req.purchaseIds);
                    // pushing the recordIds
                    user.recordsIds.push(record.id);
                })
                .catch(next);

            // // find the shoe and push the record and the user Ids to it
            Shoe.find({ _id: req.shoeId})
                .then((shoe) => {
                    // pushing recordId
                    shoe.recordsIds.push(record.id);
                    // pushing userId
                    shoe.userId.push(req.userId);
                })
                .catch(next);

            return res.status(200).send(record);
        })
        .catch(next);
});


// TODO check if admins can also modify a record
// TODO adjust number of available shoes in stock by some amount 
router.put('/:id', /*checkAuth,*/ (req, res, next) => {
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
router.delete('/:id', /*checkAuth,*/ (req, res, next) => {
    Record.findByIdAndRemove({ _id: req.params.id})
        .then((record) => {
            return res.status(200).send(record);
        })
        .catch(next);
});


module.exports = router;