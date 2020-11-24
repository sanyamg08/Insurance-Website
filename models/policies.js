const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({
	title : String,
	price : Number,
	image : String,
	description : String,
	reviews : [
	{
		type : Schema.Types.ObjectId,
		ref : 'Review'
	}
	]
})

insuranceSchema.post('findOneAndDelete', async function(doc){
	if(doc){
		await Review.deleteMany({
			_id : {
				$in : doc.reviews
			}
		})
	}
})
module.exports = mongoose.model('Insurance',insuranceSchema);