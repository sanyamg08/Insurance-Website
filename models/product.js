const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title : String,
	price : Number,
	image : String,
	description : String
})

module.exports = mongoose.model('Product',productSchema);