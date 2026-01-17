const express = require('express');  
const app = express();  
const bcrypt = require('bcryptjs');  
const bodyParser = require('body-parser');  
const cors = require('cors');  
const mysql = require('mysql2');    
app.use(cors());  
app.use(express.static('public')); 
app.use(express.json()); 
const { Pool } = require('pg');

// Use the Environment Variable Render gives you
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render cloud connections
}); 
// This creates the table automatically if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`, (err, res) => {
  if (err) console.error("Error creating table:", err);
  else console.log("Users table is ready!");
});

app.use(bodyParser.urlencoded({ extended: true}));  
const db = mysql.createPool({
          host: 'localhost',
          user: 'root',  
          password: 'password',  
          database: 'userdb',  
          port: 3306,  
          connectionLimit: 10
})  
db.getConnection((err, connection)=>{
          if(err){
                    console.error("Error connecting to database: ",err);  
                    return;
          }  
          console.log("connected to database"); 
          connection.release();   
})  
app.get('/', (req,res) => {
          res.send("Hello World!");
})  
app.post('/register', async(req,res) => {
          const { username, password} = req.body;  
          
          const hashedPassword = await bcrypt.hash(password, 10); 
          
          
                    db.query(`INSERT INTO users (username, passwordHash) VALUES (?,?)`,[username, hashedPassword], (err,result) => {
          if(err){
                    console.log("error: ",err);
                    return res.status(500).send("Error registering user");
          }  
          else{
                    console.log("user regisered successfully");
                    return res.status(200).send("user registered successfully");  
                    return;  
          }
})    
})  
app.post('/login', (req,res) => {
          const { username, password} = req.body;  
          db.query(`SELECT * FROM users WHERE username = ?`, [username], async(err,results) => {
                    if(err){
                              console.log("error: ",err);  
                              return res.status(500).send("Error Logging in user");
                    }  
                    if(results.length === 0){
                              return res.status(400).send("user not found");  
                              return;  
                    }  
                    const user = results[0];  
                    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);  
                    if(!isPasswordValid){
                              return res.status(400).send("Invalid password");  
                              return;  
                    }  
                    return res.status(200).send("Login successful");  
          })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});