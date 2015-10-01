var express = require('express');
var router = express.Router();
var users = require('../models/users');
var links = require('../models/links');
var crypto  = require('crypto');
var mailman = require('nodemailer');
var moment = require('moment');


//saveLink('test','http://www.test.com','http://sitebadges.com/test.com','xmetrix', ['#lame','#stupid','#newb']);

	var error = {e1: null,e2: null,e3: null,e4: null,e5: null,e6: null,e7: null};


router.get('/', function(req, res, next) {	users.find({user: req.session.user},function(err,docs){
		if(err){
			res.render('index', {user: null});
		}else{
			var user =  docs[0];
			links.find({}).limit(100).exec(function(err, result){
				if(err){
					res.render('error', {user: user, message: err});
				}else{
					res.render('index', {user: user, entries: result});
				}
			});
		}
	});});

router.get('/verify', function(req, res) {	res.render('verify',{error: null});});
router.get('/verify/:vcode',function(req,res){	verifyCode(req.params.vcode,res); });
router.post('/verify',function(req,res){ 	verifyCode(req.body.vcode,res); });

router.get('/new',function(req,res){ if(!req.session.user){res.redirect('/login');return};	
	users.find({user: req.session.user},function(err,docs){
		if(err){
			res.render('error', {message: err});
		}else{
			var user =  docs[0];
			res.render('new', {user: user, error: error});
		}
	});});

router.post('/new',function(req,res){
	if(!req.session.user){res.redirect('/login');return};	
	var title = req.body.title;
	var url = req.body.url;
	//var image = req.body.image;
	var author  = req.session.user;
	var image = req.body.datablob;
	var tags = req.body.hashtags;

	if(title.length > 3){}

	saveLink(title,url,image,author,tags);
	res.redirect(302, '/account');

});




router.get('/logout', function(req, res) {
	req.session.user = null;
	res.redirect('/');
});


router.get('/login', function(req, res) {
	res.render('login', {error: null});
});
router.post('/login',function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var c = crypto.createHash('sha256');
	c.update(password);
	var pwhash = c.digest('hex');
	users.find({user: username,password: pwhash},function(err,docs){
		if(err){
			res.render('error',{message: 'error loging in: ' + err });
		}else{
			var user = docs[0];
			if(user.verified != '1'){
				res.render('login',{error:'You have not validated your email yet'});
			}else{
				req.session.user = username;
				res.redirect(302, '/account');
			}
		}
	});
});

router.get('/account',function(req,res){
	if(!req.session.user){res.redirect('/login');return};
	var usr = req.session.user;
	users.find({user: usr},function(err,docs){
	 	if(err){
	 		res.render('error',{message: 'a login error has occured please try again' + err});
	 		//log this error
	 	}else{
	 		var user = docs[0];
	 		user.rank = Math.floor(Math.random() * 4000 + 400);
	 		res.render('account', {user: user});
	 	}
	 });
});













router.get('/join', function(req, res) {
  	var errors = {e1:null,e2: null,e3:null,e4:null};
  	var formdata = {username: '', email: ''};
	res.render('join', {errors: errors,formdata: formdata});
});

router.post('/join', function(req, res) {
	var username = req.body.username;
	var email = req.body.email;
	var password=  req.body.password;
	var cpassword=  req.body.cpassword;
	
	var formdata = {username: username, email: email};
	if(req.body.submit == 'Sign Up'){
		//set all errors
		var	e1="User name may only contain \"A-Z 0-9 - _\"";
		var e2="Email must be valid to receive your code";
		var e3="Password must be 5 or more characters";
		var e4="Passwords did not match";
		var errorcount = 4;
		//clear errors on successful pass of validation
		if(username.match(/[a-z0-9_-]/ig)){e1 =null;errorcount--;}
		if(email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)){e2 = null;errorcount--;}
		if(password.match(/.{5,}/)){e3 = null;errorcount--;}
		if(password == cpassword){e4 = null;errorcount--;}
		errors = {e1:e1,e2:e2,e3:e3,e4:e4};
		if(errorcount){
			res.render('join',{errors: errors, formdata: formdata});
		}else{
			//now we check if the user name is taken or email has been used
			users.find({user: username},function(err,docs){
				if(docs.length){
					this.errorcount++;
					errors.e1 = username + ' already registered';
					res.render('join', {errors: errors,formdata: formdata});
				}else{
					users.find({email: email},function(err,docs){
						if(docs.length){
							errorcount++;
							errors.e2 = email + ' already registered';
							res.render('join', {errors: errors,formdata: formdata});
						}else{
							saveUser(username,password, email,res );
						}
					});//users.find email
				}//users.find username
			});
		}//form errors
	}else{
		errors = {e1:null,e2: null,e3:null,e4:null};
		res.render('join', {errors: errors});
	}
});


router.get('/taco',function(req,res){
	res.render('error',{message: 'ah. so you come for da tacos? I fucking LOVE tacos! way to go man.'})
})


function saveLink(title, url, image, author, tags ){var link = new links();
	//title : String,  url : String ,  image : String , rating : Number,likes : Number, dislikes: Number, author : String ,  postdate : String ,  clicks : Number, tags : Array
	link.title = title 
	link.url = url 
	link.image = image 
	link.rating= 0;
	link.likes = 0;
	link.dislikes = 0;
	link.author = author 
	link.postdate = moment().format('l');
	link.clicks = 0;
	link.tags = tags
	link.save(function(result){
		console.log(result);
	});}
function saveUser(username,password, email,res ){	var c =  crypto.createHash('MD5');
	c.update(username + 'x' + password);
	var vcode =  c.digest('hex');
	c = crypto.createHash('sha256');
	c.update(password);
	var pwhash = c.digest('hex');

	var user = new users();
	user.user = username;
	user.email = email;
	user.password= pwhash;
	user.verified = vcode;
	user.joined = moment().format('l');
	user.social = JSON.stringify({});
	user.save(function(err){
		if(err){
			res.render('error', {message: err});
		}else{
			var msg = 'Thank you for singing up at linkme. You need to verify your email. You know the drill. Click the link or copy the code and enter it<br/><br/><a href="http://localhost:3000/verify/' + vcode + '">http://localhost:3000/verify/'+ vcode + '</a><br/>or<br/>Copy the following code:<br/><br/>' + vcode + ' and paste it in the field at http://localhost:3000/verify<br/><br/>Thanks for joining!<br/>-linkme team<br/><br/><Br/>if you have any questions or concerns. too bad address them to your mommy.';
			sendmail(email, "Verify your email",msg);
			res.render('verify', {error: null});	
		}
	});}
function verifyCode(vcode,res){users.find({verified: vcode},function(err,docs){
		if(docs.length){
			docs[0].verified= '1';
			docs[0].save(function(err,doc){
				res.render('thanks');
			});
		}else{
			res.render('verify',{error: 'sorry that code didnt work, perhaps its already been verified'});
		}
	});}
function sendmail(email,subject,body){	var transporter = mailman.createTransport({
		
//add your stmp details below. this uses nodemailer - type in terminal/console  'npm info nodemailer' to get url 
		service: 'Gmail',
		auth: {
			user: 'linkme.noreply@gmail.com',
			pass: '************' 
		}
	});
	var mailOptions={
		from: 'linkme <linkme.noreply@gmail.com>',
		to: email,
		subject: subject,
		html: body	};
	transporter.sendMail(mailOptions, function(error,info){
		return 1;
	});}

module.exports = router;