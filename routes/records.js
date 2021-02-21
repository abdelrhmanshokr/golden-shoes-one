const express = require('express');
const router = express.Router();

const recordsController = require('../controllers/records');

const checkAuth = require('../middlewares/check-auth');


/**
 * @swagger
 * /api/records/:
 *  get:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to request all records by all clients
 *    tags:
 *      - records
 *    responses:
 *      '200':
 *        description: Successfully requested all records (purchases) 
 *      '401':
 *        description: Unauthorized access
 */
// TODO only for admins 
router.get('/', checkAuth, recordsController.get_all_records);


/**
 * @swagger
 * /api/records/user/{userId}:
 *  get:
 *    description: Use to request all records by one client by their Id
 *    tags:
 *      - records
 *    parameters:
 *      - name: userId
 *        description: user's Id 
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: successfully requested all records by one user
 */
//TODO user gets their own records end point
router.get('/user/:userId', recordsController.get_all_records_by_one_user_by_their_Id);


/**
 * @swagger
 * /api/records/{recordId}:
 *  get:
 *    security:
 *      - jwtAuth: []
 *    description: Use to request one record by its Id
 *    tags: 
 *      - records
 *    parameters:
 *      - name: recordId
 *        description: record's Id
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: successfully requested one record by its Id
 *      '401':
 *        description: Unauthorized access
 */
// get one record by its Id
// TODO user gets their own records end point check if this user is the auth user
router.get('/:recordId', checkAuth, recordsController.get_one_record_by_its_Id);


/**
 * @swagger
 * /api/records/:
 *  post:
 *    description: Use to add a new record with each new purchase
 *    tags:
 *      - records
 *    parameters:
 *      - name: reqBody
 *        description: request body 
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *               userName: 
 *                  type: string
 *               phoneNumber:
 *                  type: string
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
router.post('/', recordsController.add_new_record_with_new_purchase);


/**
 * @swagger
 * /api/records/{recordId}:
 *  put:
 *    description: Use to modify an existing record
 *    tags:
 *      - records
 *    parameters:
 *      - name: recordId
 *        description: record's Id to update
 *        in: path
 *        type: integer
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
 *        description: Successfully modified an exising record
 *      '401':
 *        description: Unauthorized access
 */
// TODO check if admins can also modify a record
// TODO adjust number of available shoes in stock by some amount 
router.put('/:recordId', checkAuth, recordsController.modify_an_exsisting_record);


/**
 * @swagger
 * /api/records/{recordId}:
 *  delete:
 *    security:
 *      - jwtAuth: []
 *    description: Use to delete one record by its Id
 *    tags:
 *      - records
 *    parameters:
 *      - name: recordId
 *        description: record's Id 
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a record
 *      '401':
 *        description: Unauthorized access
 */
// TODO check if admins can also delete a record
router.delete('/:recordId', checkAuth, recordsController.delete_a_record);


module.exports = router;