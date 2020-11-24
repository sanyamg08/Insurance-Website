const User = require('../models/users');

module.exports.renderRegister =   (req,res)=>{
	res.render('users/register');
}

module.exports.createUser = async (req,res)=>{
	try{
	const {email, username, password } = req.body;
	const user = new User({email,username});
	const registeredUser = await User.register(user,password);
	req.login(registeredUser , e =>{
		if(e){
			return next(e);		
		}
		req.flash('success','Welcome to Policy Bazaar');
			res.redirect('/campgrounds');

	})
		}
	catch(e){
		req.flash('error',e.message);
		res.redirect('/register');
	}
}

module.exports.renderLogin = (req,res)=>{
	res.render('users/login');
}

module.exports.login =   (req,res)=>{
	req.flash('success','Welcome back!');
	const redirectUrl = req.session.returnTo || '/insurances';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

module.exports.logout =  (req,res)=>{
	req.logout();
	req.flash('success','Successfully logged out');
	res.redirect('/insurances');
}

