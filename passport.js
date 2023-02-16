const localStrategy= require('passport-local').Strategy;
const {pool}= require('./db.connect');
const bcrypt=require('bcrypt');
const { authenticate } = require('passport');

function initialize(passport){
const authenticateUser= (email, password, done)=>{
  pool.query(
    `SELECT * FROM users WHERE email=$1`,[email] , (err,results)=>{
      if(err){
        throw err;
      }
      console.log(results.rows);
      if(results.rows.length>0){
        const user= results.rows[0];
        bcrypt.compare(password, user.password, (err,isMatch)=>{
          if(err){
            throw err;
          }
          if(isMatch){
            return done(null, user);
          }else{
            return done(null,false, {message:"Password is not correct!"});
          }
        });
      }else{
          return done(null,false, {message:"Email is not registered!"} );
        }
      }
  );
};

  passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
  },authenticateUser
  ))
  //use to store the user.id in session coockie:
  passport.serializeUser((user,done)=>done(null, user.id));


    passport.deserializeUser((id,done)=>{//use to pull the this id.
      pool.query(
        `SELECT * FROM users WHERE id=$1`,[id],(err,results)=>{
          if(err){
            throw err;
          }
          return done(null,results.rows[0]);
        });
    });
}

module.exports=initialize;