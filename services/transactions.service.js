var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('transactions');

var productService = require('services/products.service');

var service = {};

service.create = create;

module.exports = service;



function create(transactParam) {
    var deferred = Q.defer();

    db.transactions.insert(
        transactParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
            //productService.updateStockQuantity(transactParam, deferred);
        }
    );

    return deferred.promise;
}
