const express = require('express');
const router = express.Router();
const multer = require('multer');

const shoesController = require('../controllers/shoes');

const checkAuth = require('../middlewares/check-auth');


// multer config to upload an image to a local dir public
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        // destination is locally in a dir called public 
        callback(null, './public/uploads/images');
    },  
    filename: function(req, file, callback){
        // file name is something like image/png so I am seperating it by the /
        const fileNameParts = file.mimetype.split('/');
        // eventually it's gonna save it like so image-timestamp.extension
        // image-20/2/2021.png
        callback(null, `${new Date().toISOString()} ${file.originalname}`);
    }
});

// adding a file filter for multer
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true);
    }else {
        callback(new Error('file not compatable'), false);
    }
};
                                                                                        
// setting up multer parameters 
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

/**
 * @swagger
 * /api/shoes/:
 *  get:
 *    description: Use to request all shoes in the system
 *    tags:
 *      - shoes
 *    responses:
 *      '200':
 *        description: Successfully requested all shoes in the system
 */
router.get('/', shoesController.get_all_shoes); 


/**
 * @swagger
 * /api/shoes/{shoeId}:
 *  get:
 *    description: Use to request one pair of shoes by its Id
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested one pair of shoes by its Id
 */
router.get('/:shoeId', shoesController.get_one_pair_of_shoes_by_its_Id);


/**
 * @swagger
 * /api/shoes/:
 *  post:
 *    security:
 *      - jwtAuth: []
 *    description: Use to add a new pair of shoes
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: reqBody
 *        description: request body 
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *               price: 
 *                  type: integer
 *               category:
 *                  type: string
 *               subCategory: 
 *                  type: string
 *               size: 
 *                  type: [integer]
 *               image: 
 *                  type: string
 *          required:
 *              - price
 *              - category
 *              - subCategory
 *              - size
 *              - image
 *    responses:
 *      '200':
 *        description: Successfully added a new pair of shoes
 *      '401':
 *        description: Unauthorized access
 */
// TODO only for admins
router.post('/', checkAuth, upload.single('image'), shoesController.add_new_shoe);


/**
 * @swagger
 * /api/shoes/{shoeId}:
 *  put:
 *    security:
 *      - jwtAuth: []
 *    description: Use to modify an existing pair of shoes
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id to update
 *        in: path
 *        type: integer
 *        required: true
 *      - name: reqBody
 *        description: request body 
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *               price: 
 *                  type: integer
 *               category:
 *                  type: string
 *               subCategory: 
 *                  type: string
 *               size: 
 *                  type: [integer]
 *               image: 
 *                  type: string
 *          required:
 *              - price
 *              - category
 *              - subCategory
 *              - size
 *              - image
 *    responses:
 *      '200':
 *        description: Successfully modified an existing pair of shoes
 *      '401': 
 *        description: Unauthorized access
 */
// TODO only for admins 
router.put('/:shoeId', checkAuth, shoesController.modify_an_existing_shoe);


/**
 * @swagger
 * /api/shoes/{shoeId}:
 *  delete:
 *    security:
 *      - jwtAuth: []
 *    description: Use to delete one pair of shoes by its Id
 *    tags: 
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id 
 *        in: path
 *        type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a pair of shoes
 *      '401':
 *        description: Unauthorized access
 */
// TODO only for admins
router.delete('/:shoeId', checkAuth, shoesController.delete_a_shoe);
    

/**
 * @swagger
 * /api/shoes/category/{category}:
 *  get:
 *    description: Use to request all shoes in a specific category
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: category
 *        description: one specific category like sneakers, sandles, classic
 *        in: path
 *        type: string 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested all shoes in one specific category
 */
// return all shoes in one category
router.get('/category/:category', shoesController.get_all_shoes_in_one_category);


/**
 * @swagger
 * /api/shoes/category/subCategory/{category}/{subCategory}:
 *  get:
 *    description: Use to request all shoes in one specific category and one specific sub category
 *    tags: 
 *      - shoes
 *    parameters:
 *      - name: category
 *        description: one specific category like sneakers, sandles or classic
 *        in: path
 *        type: string 
 *        required: true 
 *      - name: subCategory
 *        description: one specific sub category like male, female or child
 *        in: path 
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: Successfully requested all shoes in one specific category and one specific sub category
 */
// return all shoes in one category with a specific sub category
router.get('/category/subCategory/:category/:subCategory', shoesController.get_all_shoes_in_one_category_and_one_subcategory);


/**
 * @swagger
 * /api/shoes/allPurchases/{shoeId}:
 *  get:
 *    security: 
 *      - jwtAuth: []
 *    description: Use to request all purchases for one pair of shoes
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id
 *        in: path
 *        type: integer
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested all purchses of one pair of shoes
 *      '401': 
 *        description: Unauthorized access
 */
// TODO only for admins 
router.get('/allPurchases/:shoeId', checkAuth, shoesController.get_all_purchases_of_a_pair_of_shoes);


module.exports = router;