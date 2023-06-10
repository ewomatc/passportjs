const router = require('express').Router()
const mongoose = require('mongoose')
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
    res.json({message: 'User created successfully'})
  }
  catch(err) {
    next(err);
  }
})

module.exports = router