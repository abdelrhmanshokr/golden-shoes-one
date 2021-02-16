const Shoe = require('../models/shoes');
const Record = require('../models/records');


exports.get_all_shoes = (req, res, next) => {
    Shoe.find({})
        .then((shoes) => {
            res.status(200).send(shoes);
        })
        .catch(next);
};

exports.get_one_pair_of_shoes_by_its_Id = (req, res, next) => {
    Shoe.findOne({ _id: req.params.shoeId })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
};


exports.add_new_shoe = (req, res, next) => {
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
};


exports.modify_an_existing_shoe = (req, res, next) => {
    Shoe.findByIdAndUpdate({ _id: req.params.shoeId }, req.body)
    .then(() => {
        Shoe.findOne({ _id: req.params.shoeId })
        .then((shoe) => {
            res.status(200).send(shoe);
        })
        .catch(next);
    })
    .catch(next);
};


exports.delete_a_shoe = (req, res, next) => {
    Shoe.findByIdAndRemove({ _id: req.params.shoeId })
    .then((shoe) => {
        res.status(200).send(shoe);
        })
        .catch(next);
};


exports.get_all_shoes_in_one_category = (req, res, next) => {
    Shoe.find({ category: req.params.category })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
};


exports.get_all_shoes_in_one_category_and_one_subcategory = (req, res, next) => {
    Shoe.find({ category: req.params.category, subCategory: req.params.subCategory })
        .then((shoes) => {  
            res.status(200).send(shoes);
        })
        .catch(next);
};


exports.get_all_purchases_of_a_pair_of_shoes = (req, res, next) => {
    Record.find({ purchasesIds: req.params.shoeId})
        .then(records => {
            return res.status(200).send(records);
        })
        .catch(next);
};