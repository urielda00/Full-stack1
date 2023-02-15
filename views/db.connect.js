require('dotenv').config();
const {Pool}= require('pg');

const pool= new Pool({
  host:"localhost",
  user:"postgres",
  port:5432,
  password:"postgres",
  database:"Registeration"
});

module.exports={ pool };



/*require('dotenv').config();
const {Pool}= require('pg');

const pool= new Pool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  port:process.env.DB_PORT,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE
});


module.exports={pool};
*/