const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.create({ email, password, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.aboutme_get = (req, res) => {
  res.render('aboutme');
}

module.exports.user_get = async(req, res) => {
  var users = await User.find();
    res.render('user',{
      users:users
    });
}
module.exports.upusers_get = (req, res) =>{
  User.findById(req.params.id,(err, user) =>{
    if(!err){
      res.render('upusers', {
        user: user.toJSON()
      });
    }
  });
}
//sua user by id 
module.exports.user_update = async (req, res) =>{
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);
  User.updateOne({ _id:req.params.id }, req.body, {new:true},(err, doc) =>{
    if(!err){
     res.status(200).json({ message: "OK" });
    } 
    else{
      console.log(err);
      res.render('upusers', {
          viewTitle: "Error updated"
      });
    }
 });

  }
// xoa user by id
module.exports.user_delete = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    // res.status(200).json({ message: 'Thanh cong ' });
    return res.status(200).send("OK");
  });
}