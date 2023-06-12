require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const path = require('path')
const mongoose = require('mongoose')
const indexRouter = require('./routers/indexRouter')
const userRouter = require('./routers/userRouter');
const User = require('./models/user');

const app = express()


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


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));


//validate username and password, check if username exista and passwords match
passport.use(
  new LocalStrategy( async(username, password, done) => {
    try {
      const user = await User.findOne({username: username})
      if(!user) {
        return done(null, false, {message: 'Username not found'})
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          return done(null, user)
        }
        else {
          return done(null, false, {message: 'Incorrect password'})
        }
      })
    } catch (error) {
      done(error)
    }
  })
)

//serialize 
//serialization is changing the user object to a unique identifier format which can be stored in the session
//the user parameter here is what we got from the done() in the authentication above. 
//in this case we're using the user's id provided by mongodb as the identifier.
passport.serializeUser( function(user, done) {
  done(null, user.id)
})

//deserialize
//is used to retrieve the unique session id that was stored each time a user makes a request
passport.deserializeUser( async(id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


//use routers/controllers
app.use('/', indexRouter)
app.use('/', userRouter)


//server setup
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})