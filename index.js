const express= require('express');
const app = express();
const path = require('path');


const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews');

const userRoutes = require('./routes/user');
const insurancesRoutes = require('./routes/policies');
const reviewsRoutes = require('./routes/reviews');
const Product = require('./models/product');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/users');
mongoose.connect('mongodb://localhost:27017/insurance',{useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.engine('ejs',ejsMate);

const sessionConfig = {
	secret : 'thisshouldbeabettersecret',
	resave : false,
	saveUninitialized : true,
	cookie : {
		httpOnly : true,
		expires : Date.now() + 1000*60*60*24*7,
		maxAge : 1000*60*60*24*7
	}
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
	console.log("Database Connected");
});


app.use('/',userRoutes);
app.use('/insurances',insurancesRoutes);
app.use('/insurances/:id/reviews',reviewsRoutes);

const categories = ['Car','House','Health'];
app.get('/',(req,res)=>{
	res.render('home')
})

app.get('/products',async (req,res)=>{
	const currentUser = req.user;
	const user = await User.findById(currentUser._id).populate('products');
	res.render('products/index',{ user});
})

app.get('/products/new' , (req,res)=>{
	res.render('products/new');
})

app.post('/products', async (req,res)=>{
	const currentUser = req.user;
	const product = new Product(req.body.product);
	currentUser.products.push(product);
	await product.save();
	await currentUser.save();
	res.redirect('/products');
})

app.all('*',(req,res,next)=>{
	next( new ExpressError('Page Not Found', 404));
})
app.use((err,req,res,next)=>{
	const {status=500} = err;
	if(!err.message) err.message = 'Oh no, Something went wrong';
	res.status(status).render('error',{err});
})
app.listen(3000,()=>{
	console.log("App is listening");
})
