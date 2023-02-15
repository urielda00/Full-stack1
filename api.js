const express=require('express');
const app= express();
const port= process.env.port||2500;
const {pool}= require('./views/db.connect');
const session= require('express-session');
const bcrypt=require('bcrypt');
const passport= require('passport');
const cons = require('consolidate');
const path = require('node:path');
//middlewares:

//view engines:
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');

const initializePassport= require('./passport');
initializePassport(passport);
app.use(express.urlencoded({extended:false}));
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());



// GET paths:
app.get('/',(req,res)=>{
  res.render("home");
});

app.get('/users/register', checkAuthenticated,(req,res)=>{
  res.render("register");
});

app.get('/users/login',checkAuthenticated,(req,res)=>{
  res.render("login");
});

app.get('/users/dashboard',checkNotAuthenticated,(req,res)=>{
  res.render("dashboard", {user: req.user.name});
});

app.get('/users/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // if you're using express-flash
    console.log('you logged out!')
    res.redirect('/users/login');
  });
});



//POST paths:
app.post('/users/register', async (req,res)=>{
  let {name, email, password, password2}= req.body;
  console.log({
    name,
    email,
    password,
    password2
  });
  
  let errors=[];
  
  if(!name||!email||!password||!password2){
    errors.push({message:'please enter all the fields'});
  }
  
  if(password.length<6){
    errors.push({message:'password should be at least 6 characters!'});
  }
  
  if(password!= password2){
    errors.push({message:'passwords do not natch!'});
  }
  
  if(errors.length >0){
    res.render('register',{errors})
  }else{
    //form validation had passed
    let hashedPassword= await bcrypt.hash(password,10);
    console.log(hashedPassword);
    pool.query(
      `SELECT * FROM users
       WHERE email=$1`,[email],(err,results)=>{
        if(err){
          throw err;
        }else{
          console.log(results.rows);
  
  
  
          if(results.rows.length > 0){
            errors.push({messsge:'Email already registered'});
            res.render('register',{ errors })
          }else{
            pool.query(
              `INSERT INTO users(name,email,password)
              VALUES($1,$2,$3)
              RETURNING id, password`,[name,email,hashedPassword],
              (err,results)=>{
              if(err){
                throw err;
              }
              console.log(results.rows);
              res.redirect('/users/login');
              }
            )
          }
        }
       }
    )
  
  }
  });
  
  
  
  app.post('/users/login',
  passport.authenticate('local',{
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash:true
  })
  );
  
  
  
  
  function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return res.redirect('/users/dashboard')
    }
    next();
  }
  
  function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('users/login');
  }
  
  app.listen(port,()=>{
    console.log(`server is listening at port: ${port}`);
  });
