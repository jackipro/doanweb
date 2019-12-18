var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://namchelsea:hanam123@cluster0-4y545.mongodb.net/storeonline?retryWrites=true&w=majority";
var ProductDAO = {
  insert: function (product) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("storeonline");
        dbo.collection("products").insertOne(product, function (err, res) {
          if (err) return reject(err);
          resolve(res.insertedCount > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  getAll: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("storeonline");
        var query = {};
        dbo.collection("products").find(query).toArray(function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  getDetails: function(id) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("storeonline");
        var ObjectId = require('mongodb').ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("products").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = ProductDAO;