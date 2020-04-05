var config = require('config.json');
var express = require('express');
var router = express.Router();
var transactionService = require('services/transactions.service');
var productService = require('services/products.service');

router.post('/register', registerTransaction); 

module.exports = router;


function registerTransaction(req, res) {
    transactionService.create(req.body)
        .then(function () {
            console.log('first then');
            productService.updateStockQuantity(req.body);
        })
        .then(function(){
            console.log('second then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
