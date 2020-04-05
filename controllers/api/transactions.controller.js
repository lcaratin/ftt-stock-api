var config = require('config.json');
var express = require('express');
var router = express.Router();
var transactionService = require('services/transactions.service');
var productService = require('services/products.service');

router.get('/', getTransactions);
router.get('/:_id', getTransactionsByProduct);
router.post('/register', registerTransaction);
router.put('/:_id', updateTransaction);
router.delete('/:_id', deleteTransaction);

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
            productService.updateStockQuantity('INSERT', req.body);
        })
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTransaction(req, res) {
    transactionService.update(req.params._id, req.body)
        .then(function (oldTransact) {
            productService.updateStockQuantity('UPDATE', req.body, oldTransact);
        })
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTransaction(req, res) {
    transactionService.delete(req.params._id)
        .then(function (oldTransact) {
            productService.updateStockQuantity('DELETE', null, oldTransact);
        })
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}