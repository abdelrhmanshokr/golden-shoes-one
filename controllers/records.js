const Record = require('../models/records');

exports.get_all_records =  (req, res, next) => {
    Record.find({})
        .then((records) => {
            res.status(201).send(records);
        })
        .catch(next);
};


exports.get_all_records_by_one_user_by_their_Id = (req, res, next) => {
    Record.find({ userId: req.params.userId })
        .then((records) => {
            if(records.length > 0){
                return res.status(201).send(records);
            }else{
                return res.status(404).json({
                    message: 'No previous purchases for this user'
                });
            }
        })
        .catch(next);
};


exports.get_one_record_by_its_Id = (req, res, next) => {
    Record.findOne({ _id: req.params.recordId })
        .then((record) => {
            if(record){
                return res.status(201).send(record);
            }else{
                return res.status(404).json({
                    message: 'No such record'
                });
            }
        })
        .catch(next);
};


exports.add_new_record_with_new_purchase = (req, res, next) => {
    let record = new Record({
        purchasesIds: req.body.purchasesIds,
        userName: req.body.userName,
        phoneNumber: req.body.phoneNumber
    });
    record.save()
        .then((record) => {
            res.status(201).send(record);
        })
        .catch(next);
};


exports.modify_an_exsisting_record = (req, res, next) => {
    Record.findByIdAndUpdate({ _id: req.params.recordId }, req.body)
        .then(() => {
            Record.findOne({ _id: req.params.recordId})
                .then((record) => {
                    res.status(200).send(record);
                })
                .catch(next);
        })
        .catch(next);
};


exports.delete_a_record = (req, res, next) => {
    Record.findByIdAndRemove({ _id: req.params.recordId})
        .then((record) => {
            return res.status(200).send(record);
        })
        .catch(next);
};