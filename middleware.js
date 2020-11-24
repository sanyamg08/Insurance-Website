module.exports.isLoggedIn = (req,res,next) =>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		console.log(req.session.returnTo);
		req.flash('error','You must be signed in first');
		return res.redirect('/login');
	}
	next();
}

const Insurance = require('./models/policies');
const {insuranceSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews');
const {reviewSchema } = require('./schema');

module.exports.ValidateInsurance = (req,res,next)=>{
	
	const { error } = insuranceSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg,404);
	}
	
		else{
			next();
		}
}



module.exports.isReviewAuthor = async (req,res,next)=>{
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if( !review.author.equals(req.user._id) ){
		req.flash('error','You do not have permission to do that');
		return res.redirect(`/insurances/${id}`);
	}
	next(); 
}


