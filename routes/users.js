const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');

const usersController = require('../controllers/users');


/**
 * @swagger
 * /api/users/:
 *  get:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to request all users in the system
 *    tags:
 *      - users
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized access
 */
router.get('/', checkAuth, usersController.get_all_users); 


/**
 * @swagger
 * /api/users/:
 *  post:
 *    description: Use to add a new user/admin without password hashing just for testing
 *    tags:
 *      - users
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
 *               password:
 *                  type: string
 *          required:
 *              - userName
 *              - phoneNumber
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully added a new user/admin
 */
// TODO only for admins check if this route is needed
router.post('/', usersController.add_new_user);


/**
 * @swagger
 * /api/users/{userId}:
 *  put:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to modify an existing user
 *    tags:
 *      - users
 *    parameters:
 *      - name: userId
 *        description: user's Id to update
 *        in: path
 *        type: integer
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
 *                  type: string
 *               password:
 *                  type: string
 *          required:
 *              - userName
 *              - phoneNumber
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully modified an exising user
 *      '401':
 *        description: Unauthorized access
 */
// TODO check if admins can change it if so add another middleware to handle it 
// TODO registred user or the admin middleware 
router.put('/:userId', /*checkAuth,*/ usersController.modify_an_existing_user);


/**
 * @swagger
 * /api/users/{userId}:
 *  delete:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to delete one user/admin by its Id
 *    tags: 
 *      - users
 *    parameters:
 *      - name: userId
 *        description: users's Id 
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a user
 *      '401': 
 *        descripiton: Unauthorized access
 */
// TODO admins can delete the user or a registered user can delete their account
// TODO registred user or the admin middleware 
router.delete('/:userId', checkAuth, usersController.delete_a_user);


/**
 * @swagger
 * /api/users/signup:
 *  post:
 *    description: Use to sign a new user/admin up to the system
 *    tags:
 *      - users
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
 *               password:
 *                  type: string
 *          required:
 *              - userName
 *              - phoneNumber
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully created a new user
 */
// signup end point
router.post('/signup', usersController.user_signup);


/**
 * @swagger
 * /api/users/login:
 *  post:
 *    description: Use to login an admin with username, password and phone number
 *    tags:
 *      - users
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
 *               password:
 *                  type: string
 *          required:
 *              - userName
 *              - phoneNumber
 *              - password
 *    responses:
 *      '200':
 *        description: Successfully loggedin
 */
// login end point
router.post('/login', usersController.user_login);


/**
 * @swagger
 * /api/users/allPurchases/{userId}:
 *  get:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to request all purchases for one pair of shoes
 *    tags:
 *      - users
 *    parameters:
 *      - name: userId
 *        description: user's Id
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested all purchses by one user using their Id
 *      '401':
 *        description: Unauthorized access
 */
// TODO registred user or the admin middleware how not to pass both this or that
router.get('/allpurchases/:userId', /*checkAuth,*/ usersController.get_all_purchases_by_on_user);

     
module.exports = router;