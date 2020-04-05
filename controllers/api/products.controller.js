var config = require('config.json');
var express = require('express');
var router = express.Router();
var productService = require('services/products.service');

router.get('/', getProducts);
router.post('/register', registerProduct); //
router.get('/:_id', getById); //
router.put('/:_id', updateProduct); //
router.delete('/:_id', deleteProduct); //

module.exports = router;

function getProducts(req, res) {
    productService.getAll()
        .then(function (questions) {
            res.send(questions);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerProduct(req, res) {
    productService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    productService.getById(req.params._id)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateProduct(req, res) {
    productService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteProduct(req, res) {
    productService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}