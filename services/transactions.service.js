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

service.getAll = getAll;
service.getAllByProduct = getAllByProduct;
service.create = create;
// service.getById = getById;
// service.update = update;
// service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.transactions.find({}).toArray(function (err, questions) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(questions);
    });

    return deferred.promise;
}

function getAllByProduct(_id) {
    var deferred = Q.defer();

    db.transactions.find({productId: _id}).toArray(function (err, transacts) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(transacts);
    });

    return deferred.promise;
}

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

// function getById(_id) {
//     var deferred = Q.defer();

//     db.transactions.findById(_id, function (err, transact) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (transact) {
//             deferred.resolve(transact);
//         } else {
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// }

// function update(_id, transactParam) {
//     var deferred = Q.defer();

//     db.transactions.findById(_id, function (err, product) {
//         if (err) deferred.reject(err.name + ': ' + err.message);
//         else updateTransact();
//     });

//     function updateTransact() {
//         var set = {
//             quantity: transactParam.quantity,
//             transact: transactParam.transact
//         };

//         db.transactions.update(
//             { _id: mongo.helper.toObjectID(_id) },
//             { $set: set },
//             function (err, doc) {
//                 if (err) deferred.reject(err.name + ': ' + err.message);

//                 //deferred.resolve();
//                 productService.updateStockQuantity(transactParam, deferred);
//             }
//         );
//     }

//     function updateProduct() {
//         // fields to update

//         db.transactions.findById(_id, function (err, transact) {
//             if (err) deferred.reject(err.name + ': ' + err.message);
    
//             if (transact) {
//                 deferred.resolve(transact);
//             } else {
//                 deferred.resolve();
//             }
//         });

//         var set = {
//             name: transactParam.name,
//             type: transactParam.type,
//             brand: transactParam.brand,
//             characteristic: transactParam.characteristic,
//             color: transactParam.color,
//             size: transactParam.size,
//             purchaseTagPrice: transactParam.purchaseTagPrice,
//             purchasePrice: transactParam.purchasePrice,
//             hundredPercentPrice: transactParam.hundredPercentPrice,
//             suggestedPrice: transactParam.suggestedPrice
//         };

//         db.transactions.update(
//             { _id: mongo.helper.toObjectID(_id) },
//             { $set: set },
//             function (err, doc) {
//                 if (err) deferred.reject(err.name + ': ' + err.message);

//                 deferred.resolve();
//             }
//         );
//     }

//     return deferred.promise;
// }

// function _delete(_id) {
//     var deferred = Q.defer();

//     db.transactions.remove(
//         { _id: mongo.helper.toObjectID(_id) },
//         function (err) {
//             if (err) deferred.reject(err.name + ': ' + err.message);

//             deferred.resolve();
//         });

//     return deferred.promise;
// }