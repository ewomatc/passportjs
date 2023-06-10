require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const path = require('path')
const mongoose = require('mongoose')
const indexRouter = require('./routers/indexRouter')
const userRouter = require('./routers/userRouter')

const app = express()
app.use(express.urlencoded({ extended: false }));


//database setup
const connectToDb = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    console.log('connected to database')
  }
  catch(err){
    console.error('error connecting to database ... ', err.message)
  }
}
connectToDb()

//define path for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//use routers/controllers
app.use('/', indexRouter)
app.use('/', userRouter)


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());




//server setup
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})