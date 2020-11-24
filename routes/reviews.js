const express = require('express');
const router = express.Router({ mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Insurance = require('../models/policies');
const Review = require('../models/reviews');
const {reviewSchema } = require('../schema');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js')
const reviews = require('../controllers/reviews');

const ValidateReview = (req,res,next) =>{
	const { error } = reviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el=> el.message).join(',');
		throw new ExpressError(msg,404);
	}
	else{
		next();
	}
}


router.post('/' , isLoggedIn, ValidateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync( reviews.deleteReview ));

module.exports = router;
