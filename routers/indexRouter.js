const router = require('express').Router()

router.get('/', (req, res) => {
  res.render('index', { user: req.user }) //we will check if there is a user object in the cookie that comes with the request. 
  //If the user is logged in, we should see the user object in the request body. 
  //We'll use it to display a different content from users who are not logged in
})

module.exports = router