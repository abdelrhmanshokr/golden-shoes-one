const express = require('express');
const router = express.Router();
const Record = require('../models/records');

const checkAuth = require('../middlewares/check-auth');
const checkAdmin = require('../middlewares/check-admin');


/**
 * @swagger
 * /api/records/:
 *  get:
 *    description: Use to request all records by all clients
 *    responses:
 *      '200':
 *        description: successfully requested all records (purchases)
 *        content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  item:
 *                   type: string
 */
// TODO only for admins 
router.get('/', /*checkAdmin,*/ (req, res, next) => {
    Record.find({})
        .then((records) => {
            res.status(200).send(records);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/records/user/{userId}:
 *  get:
 *    description: Use to request all records by one client by their Id
 *    parameters:
 *      - name: userId
 *        description: user's Id 
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: successfully requested all records by one user
 */
//TODO user gets their own records end point
router.get('/user/:userId', (req, res, next) => {
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
 * /api/records/{recordId}:
 *  get:
 *    description: Use to request one record by its Id
 *    parameters:
 *      - name: recordId
 *        description: record's Id
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: successfully requested one record by its Id
 */
// get one record by its Id
// TODO user gets their own records end point check if this user is the auth user
router.get('/:recordId', (req, res, next) => {
    Record.findOne({ _id: req.params.recordId })
        .then((record) => {
            if(record){
                return res.status(200).send(record);
            }else{
                return res.status(404).json({
                    message: 'No such record'
                });
            }
        })
        .catch(next);
});


/**
 * @swagger
 * /api/records/:
 *  post:
 *    description: Use to add a new record with each new purchase
 *    parameters:
 *      - name: reqBody
 *        description: request body 
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *               userId: 
 *                  type: [integer]
 *               purchasesIds:
 *                  type: [integer]
 *          required:
 *              - purchaseIds
 *              - userId
 *    responses:
 *      '200':
 *        description: Successfully added a record (a purchase is done and stored)
 */
// TODO decrease number of available shoes in stock by some amount
router.post('/', /*checkAuth,*/ (req, res, next) => {
    let record = new Record({
        purchasesIds: req.body.purchasesIds,
        userId: req.body.userId
    });
    record.save()
        .then((record) => {
            res.status(200).send(record);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/records/{recordId}:
 *  put:
 *    description: Use to modify an existing record
 *    parameters:
 *      - name: recordId
 *        description: record's Id to update
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
 *               userId: 
 *                  type: [integer]
 *               purchasesIds:
 *                  type: [integer]
 *          required:
 *              - purchaseIds
 *              - userId
 *    responses:
 *      '200':
 *        description: Successfully modified an exising record (a purchase is done and stored)
 */
// TODO check if admins can also modify a record
// TODO adjust number of available shoes in stock by some amount 
router.put('/:recordId', /*checkAuth,*/ (req, res, next) => {
    Record.findByIdAndUpdate({ _id: req.params.recordId }, req.body)
        .then(() => {
            Record.findOne({ _id: req.params.recordId})
                .then((record) => {
                    res.status(200).send(record);
                })
                .catch(next);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/records/{recordId}:
 *  delete:
 *    description: Use to delete one record by its Id
 *    parameters:
 *      - name: recordId
 *        description: record's Id 
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a record
 */
// TODO check if admins can also delete a record
router.delete('/:recordId', /*checkAuth,*/ (req, res, next) => {
    Record.findByIdAndRemove({ _id: req.params.recordId})
        .then((record) => {
            return res.status(200).send(record);
        })
        .catch(next);
});


module.exports = router;