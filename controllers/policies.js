const Insurance = require('../models/policies');


module.exports.index = async(req,res)=>{
		const insurances = await Insurance.find({});
	res.render('insurances/index',{insurances});
}

module.exports.renderNewForm =  (req,res)=>{
	res.render('insurances/new');
}

module.exports.createInsurance = async(req,res,next)=>{
	const insurance =new Insurance(req.body.insurance);
	await insurance.save();
	req.flash('success',"Succesfully made a new insurance!");
	res.redirect(`/insurances/${insurance._id}`);
}

module.exports.showInsurance = async(req,res)=>{
	const { id } = req.params;
	const insurance = await Insurance.findById(id).populate(
		{ path : 'reviews',
		populate : {
			path : 'author'
		}
			 })
	.populate('author');
	console.log(insurance);
	if(!insurance){
		req.flash('error',"Sorry, Can't find that Insurance!");
		return res.redirect('/insurances');
	}
	res.render('insurances/show',{insurance});
}

module.exports.updateInsurance = async (req,res)=>{
	const { id } = req.params;
	const insurance  = await Insurance.findByIdAndUpdate(id, {...req.body.insurance});
	req.flash('success',"Succesfully Updated!")
	res.redirect(`/insurances/${insurance._id}`);
}

module.exports.renderEditForm = async (req,res)=>{	
	const insurance = await Insurance.findById(req.params.id);
	res.render('insurances/edit',{insurance});
}

module.exports.delete = async (req,res)=>{
	const { id } = req.params;
	await Insurance.findByIdAndDelete(id);
	req.flash('success',"Succesfully Deleted Insurance");
	res.redirect('/insurances');
}
