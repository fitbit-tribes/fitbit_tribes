'use strict';
const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const bodyParser = require('body-parser').json();
const jwToken = require(__dirname + '/../lib/jwt_auth');
const handleErr = require(__dirname + '/../lib/handle_err');

//since you're only using the Router function in one spot in this file you
//might want to both require and make the userRouter on the same line
let userRouter = module.exports = Router();

//I would get rid of the blank lines if you're calling things on the result
//of the .route function, makes it easier to see what's going on. Also,
//indent the the .post/get/put/and the rest calls.
userRouter.route('/user')

.post(jwToken, bodyParser, (req, res) => {
  let newUser = new User(req.body);
  newUser.save((err, data) => {
    if (err) return handleErr(err, res);
    res.status(200).json(data);
  });
})

.get((req, res) => {
  //you should make sure you're not sending your hashes along with the user objects
  User.find((err, userdata) => {
    if (err) return handleErr(err, res);
    res.status(200).json(userdata);
  });
});

userRouter.route('/user/:user_id')

.get((req, res) => {
  User.findById(req.params.user_id, (err, userdata) => {
    if (err) return handleErr(err, res);
    res.status(200).json(userdata);
  });
})

.put(jwToken, bodyParser, (req, res) => {
  //is there a reason you're not using update with a {_id: req.params.user_id}?
  //this method involves two callbacks for mongo, which means two separate mongo
  //requests
  User.findByIdAndUpdate(req.params.user_id, req.body, (err, userdata) => {
    if (err) return handleErr(err, res);
    userdata.save((err) => {
      if (err) return handleErr(err, res);
    });
    res.status(200).json({ msg: 'Successfully updated!' });
  });
})

.delete(jwToken, (req, res) => {
  //this styling should be consistent with the rest of your routes
  User.remove({
    _id: req.params.user_id
  }, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: 'Successfully deleted!' });
  });
});
