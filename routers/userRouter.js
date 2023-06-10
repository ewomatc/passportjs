const router = require('express').Router()
const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/user')


router.get('/sign-up', (req, res) => {
  res.render('sign-up-form')
})

router.post('/sign-up', async(req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    })
    await user.save()
    res.redirect('/')
  }
  catch(err) {
    next(err);
  }
})

router.get('/log-in', (req, res) => {
  res.render('log-in-form')
})

router.post('/log-in', passport.authenticate('local', {
  successRedirect: ('/'),
  failureRedirect: ('/log-in')
}))

//logout function
router.get('/log-out', (req, res, next) => {
  req.logout( err => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

module.exports = router