var config = require('config.json');
var express = require('express');
var router = express.Router();
var transactionService = require('services/transactions.service');
var productService = require('services/products.service');

router.get('/', getTransactions);
router.get('/:_id', getTransactionsByProduct);
router.post('/register', registerTransaction); //
// router.get('/:_id', getById); //
// router.put('/:_id', updateProduct); //
// router.delete('/:_id', deleteProduct); //

module.exports = router;

function getTransactions(req, res) {
    transactionService.getAll()
        .then(function (transacts) {
            res.send(transacts);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getTransactionsByProduct(req, res) {
    transactionService.getAllByProduct(req.params._id)
        .then(function (transacts) {
            res.send(transacts);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerTransaction(req, res) {
    transactionService.create(req.body)
        .then(function () {
            productService.updateStockQuantity(req.body);
        })
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// function getById(req, res) {
//     transactionService.getById(req.params._id)
//         .then(function (user) {
//             if (user) {
//                 res.send(user);
//             } else {
//                 res.sendStatus(404);
//             }
//         })
//         .catch(function (err) {
//             res.status(400).send(err);
//         });
// }

// function updateProduct(req, res) {
//     transactionService.update(req.params._id, req.body)
//         .then(function () {
//             res.sendStatus(200);
//         })
//         .catch(function (err) {
//             res.status(400).send(err);
//         });
// }

// function deleteProduct(req, res) {
//     transactionService.delete(req.params._id)
//         .then(function () {
//             res.sendStatus(200);
//         })
//         .catch(function (err) {
//             res.status(400).send(err);
//         });
// }