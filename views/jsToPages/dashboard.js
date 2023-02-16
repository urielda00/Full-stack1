const {pool}= require('/Users/uriel/Desktop/Full-stack/views/db.connect');
const user= pool.query(`SELECT name FROM users WHERE email=$1`,['uri123@gmail.com'],(err,results)=>{
    if(err){
      throw err;
    }else{
      console.log(results.rows);
    }
    });
  

let userPname=user.charAt(0).toUpperCase() + user.slice(1);
document.getElementById("H1").innerHTML = `hello ${user}`;

