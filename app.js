//configuration elements
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const ConnectMongo = require('connect-mongo')(session);
const ConnectDB = require('./config/index');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//config passport.js
require('./config/passport')(passport);

//load config
dotenv.config({ path: './config/config.env'});
const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;

//database connection
ConnectDB;

/*middleware*/
//body-parser
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//view engine and public
app.set('view engine','ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,'public')));

//Express-session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
      store : new ConnectMongo({mongooseConnection : mongoose.connection})
    })
  );
  
//passport middleware
app.use(passport.initialize());
app.use(passport.session());



//session variables
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})


//route handling
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/users'));

//server launch
app.listen(PORT, ()=>{
    console.log(`connected to port ${PORT} in ${ENV}`);
});