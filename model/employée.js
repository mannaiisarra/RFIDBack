
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var myuser = new Schema({
idcart:String,
nom :String,
prenom :String,
email :String,
adresse :String,
telephone :String,
dateEntre:Number,
dateSortie:Number

});

module.exports = mongoose.model('users', myuser);