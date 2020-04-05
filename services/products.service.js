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