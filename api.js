const express=require('express');
const express= require('express');
const app= express();
const port= process.env.port||2500;
//const {pool}= require('');
const session= require('express-session');
const bcrypt=require('bcrypt');
const passport= require('passport');


//middlewares:
app.use(express.static('public'));