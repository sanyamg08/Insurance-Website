const Insurance = require('../models/policies');
const Review = require('../models/reviews');

module.exports.createReview =  async (req,res)=>{
	
	const insurance = await Insurance.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id; 
	insurance.reviews.push(review);
	await review.save();
	await insurance.save();
	req.flash('success',"Thanks for your feedback!");
	res.redirect(`/insurances/${insurance._id}`);
}

module.exports.deleteReview = async (req,res)=>{
	const { id , reviewId} = req.params;
	await Insurance.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
 	await Review.findByIdAndDelete(reviewId);
 	req.flash('success',"Succesfully Deleted Review");
 	res.redirect(`/policies/${id}`);
 }