var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('products');

var service = {};

service.getAll = getAll;
service.create = create;
service.getById = getById;
service.update = update;
service.delete = _delete;
service.updateStockQuantity = updateStockQuantity;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.products.find({}).toArray(function (err, questions) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(questions);
    });

    return deferred.promise;
}

function create(productParam) {
    var deferred = Q.defer();

    db.products.findOne(
        { name: productParam.name },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.reject('Product "' + productParam.name + '" is already taken');
            } else {
                createProduct();
            }
        });

    function createProduct() {
        db.products.insert(
            productParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product) {
            deferred.resolve(product);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function updateStockQuantity(operation, transactParam, oldTransact) {
    var deferred = Q.defer(), productId;

    if (transactParam != null && transactParam.productId != null)
        productId = transactParam.productId;
    else if (oldTransact != null && oldTransact.productId != null) 
        productId = oldTransact.productId;

    db.products.findById(productId, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (product) {
            updateStock(operation, product, productId);
        } else {
            deferred.reject('Transact Product not found.');
        }
    });

    function updateStock(operation, product, productId) {
        let quantity =  0;

        if (operation == 'INSERT')
            quantity = insert_calcQuantity(product, transactParam);
        else if (operation == 'UPDATE')
            quantity = update_calcQuantity(product, transactParam, oldTransact);
        else if (operation == 'DELETE')
            quantity = delete_calcQuantity(product, oldTransact);

        var set = {
            stockQuantity : quantity
        }

        db.products.update(
            { _id: mongo.helper.toObjectID(productId) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            }
        );
    }

    function insert_calcQuantity(product, transactParam) {
        let quantity =  product.stockQuantity;
        quantity = transactParam.transact ? quantity + transactParam.quantity : quantity - transactParam.quantity;
        return quantity;
    }

    function update_calcQuantity(product, transactParam, oldTransact) {
        let quantity =  product.stockQuantity;
        quantity = transactParam.transact ? quantity + transactParam.quantity : quantity - transactParam.quantity;
        quantity = oldTransact.transact ? quantity - oldTransact.quantity : quantity + oldTransact.quantity;
        return quantity;
    }

    function delete_calcQuantity(product, oldTransact) {
        let quantity =  product.stockQuantity;
        quantity = oldTransact.transact ? quantity - oldTransact.quantity : quantity + oldTransact.quantity;
        return quantity;
    }
}

function update(_id, productParam) {
    var deferred = Q.defer();

    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (product.name !== productParam.name) {
            db.products.findOne(
                { name: productParam.name },
                function (err, product) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (product) {
                        deferred.reject('Name "' + product.name + '" is already taken')
                    } else {
                        updateProduct();
                    }
                });
        } else {
            updateProduct();
        }
    });

    function updateProduct() {
        // fields to update
        var set = {
            name: productParam.name,
            type: productParam.type,
            brand: productParam.brand,
            characteristic: productParam.characteristic,
            color: productParam.color,
            size: productParam.size,
            purchaseTagPrice: productParam.purchaseTagPrice,
            purchasePrice: productParam.purchasePrice,
            hundredPercentPrice: productParam.hundredPercentPrice,
            suggestedPrice: productParam.suggestedPrice
        };

        db.products.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.products.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}