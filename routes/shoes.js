const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoes');
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
 *    responses:
 *      '200':
 *        description: A successful response
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



router.get('/:id', (req, res, next) => {
    Shoe.findOne({ _id: req.file.params.id })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
});


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


// TODO only for admins 
router.put('/:id', /*checkAdmin,*/ (req, res, next) => {
    Shoe.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
        Shoe.findOne({ _id: req.params.id })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
    })
    .catch(next);
});


// TODO only for admins
router.delete('/:id', /*checkAdmin,*/ (req, res, next) => {
    Shoe.findByIdAndRemove({ _id: req.params.id })
    .then((shoe) => {
        res.status(200).send(shoe);
        })
        .catch(next);
    });
    
  
// return all shoes in one category
router.get('/category', (req, res, next) => {
    Shoe.find({ category: req.body.category })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
});


// return all shoes in one category with a specific sub category
router.get('/category/subCategory', (req, res, next) => {
    Shoe.find({ category: req.body.category, subCategory: req.body.subCategory })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
});


// TODO only for admins 
router.get('/allpurchases/:id', /*checkAdmin,*/ (req, res, next) => {
    Shoe.findOne({ _id: req.params.id })
        .then(shoe => {
            Record.find({ purchaseIds: shoe.id })
                .then(records => {
                    return res.status(200).send(records);
                })
                .catch(next);
        })
        .catch(next);
});


module.exports = router;