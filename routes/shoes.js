const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoes');
const Record = require('../models/records');
const multer = require('multer');


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
 *        content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  item:
 *                   type: any
 */
router.get('/', (req, res, next) => {
    Shoe.find({})
        .then((shoes) => {
            res.status(200).send(shoes);
        })
        .catch(next);
}); 


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
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested one pair of shoes by its Id
 */
router.get('/:shoeId', (req, res, next) => {
    Shoe.findOne({ _id: req.params.shoeId })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/shoes/:
 *  post:
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
 */
// TODO only for admins
router.post('/', upload.single('image'), (req, res, next) => {
    let shoe = new Shoe({
        price: req.body.price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        size: req.body.size,
        image: req.file.path
    });

    shoe.save()
        .then((shoe) => {
            res.status(201).send(shoe);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/shoes/{shoeId}:
 *  put:
 *    description: Use to modify an existing pair of shoes
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id to update
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
 */
// TODO only for admins 
router.put('/:shoeId', /*checkAdmin,*/ (req, res, next) => {
    Shoe.findByIdAndUpdate({ _id: req.params.shoeId }, req.body)
    .then(() => {
        Shoe.findOne({ _id: req.params.shoeId })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
    })
    .catch(next);
});


/**
 * @swagger
 * /api/shoes/{shoeId}:
 *  delete:
 *    description: Use to delete one pair of shoes by its Id
 *    tags: 
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id 
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully deleted a pair of shoes
 */
// TODO only for admins
router.delete('/:shoeId', /*checkAdmin,*/ (req, res, next) => {
    Shoe.findByIdAndRemove({ _id: req.params.shoeId })
    .then((shoe) => {
        res.status(200).send(shoe);
        })
        .catch(next);
    });
    

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
 *        schema:
 *          type: string 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested all shoes in one specific category
 */
// return all shoes in one category
router.get('/category/:category', (req, res, next) => {
    Shoe.find({ category: req.params.category })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
});


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
 *        schema:
 *          type: string 
 *        required: true 
 *      - name: subCategory
 *        description: one specific sub category like male, female or child
 *        in: path 
 *        schema: 
 *           type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: Successfully requested all shoes in one specific category and one specific sub category
 */
// return all shoes in one category with a specific sub category
router.get('/category/subCategory/:category/:subCategory', (req, res, next) => {
    Shoe.find({ category: req.params.category, subCategory: req.params.subCategory })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
});


/**
 * @swagger
 * /api/shoes/allPurchases/{shoeId}:
 *  get:
 *    description: Use to request all purchases for one pair of shoes
 *    tags:
 *      - shoes
 *    parameters:
 *      - name: shoeId
 *        description: shoes' Id
 *        in: path
 *        schema:
 *          type: integer 
 *        required: true 
 *    responses:
 *      '200':
 *        description: Successfully requested all purchses of one pair of shoes
 */
// TODO only for admins 
router.get('/allPurchases/:shoeId', /*checkAdmin,*/ (req, res, next) => {
    Record.find({ purchasesIds: req.params.shoeId})
        .then(records => {
            return res.status(200).send(records);
        })
        .catch(next);
});



module.exports = router;