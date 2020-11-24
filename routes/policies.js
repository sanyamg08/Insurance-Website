const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Insurance = require('../models/policies');
const {insuranceSchema } = require('../schema');
const { isLoggedIn ,  ValidateInsurance } = require('../middleware');
const insurances = require('../controllers/policies');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
	.get(catchAsync(insurances.index))
	 .post( isLoggedIn ,ValidateInsurance, catchAsync(insurances.createInsurance))
	
router.get('/new', isLoggedIn, insurances.renderNewForm);

router.route('/:id')
	.get( catchAsync( insurances.showInsurance))
	.put(isLoggedIn, ValidateInsurance, catchAsync(insurances.updateInsurance))
	.delete(  isLoggedIn, catchAsync(insurances.delete))



router.get('/:id/edit', isLoggedIn,   catchAsync( insurances.renderEditForm));




module.exports = router;