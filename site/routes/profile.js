const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs');

const app = express()
const router = express.Router();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())


  const db = mysql.createConnection(
    {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token
    console.log('Token:', token)
    if(!token){
      res.redirect('/login')
    }
    const user = jwt.verify(token, process.env.JWT_SECRET,(err, result) => {
    if(err){
      if(err.name == 'TokenExpiredError'){
        res.redirect('/login')
      } else {
        console.log(err)
      }
    }
    if(result){
      return next()
    }
  })
  }




router.get('/edit', isAuthenticated,(req,res) => {
    res.render('profile_edit.ejs', {
        name: 'Edit Profile',
        message: ''
    })
})

router.get('/', isAuthenticated,(req,res) => {
  let token = req.cookies.token
  jwt.verify(token, process.env.JWT_SECRET, (err,result) => {
    if(err){
      console.log(err)
    }
    if(result){
      console.log(result)
      let email = result.email
      db.query("SELECT * FROM users WHERE email = ?", [email], (err,result) => {
        if(err){
          console.log(err)
        }
        if(result){
          console.log(result)
          let info = result[0]  // we receive an array which has an object in 0 index, this object contains all the required info
          res.render('profile.ejs', {
            title_name: "Profile",
            name: info.name,
            gender: info.gender,
            username: info.username,
            email: info.email
          })
        }
      })
    }
  })
})


router.post('/edit', isAuthenticated  ,(req,res) => {
  console.log(req.body)
  const token = req.cookies.token
  let email = ''
  let count = 0 // response count
  jwt.verify(token, process.env.JWT_SECRET, (err,result)=>{
    if(err){
      console.log(err)
    }
    if(result){
      console.log(result)
      email = result.email
    }
  })



  const {name, gender, username, old_password, new_password, new_password_confirm} = req.body
  // if user enterd a New name, ONLY THEN we update it
  if(name){
    db.query("UPDATE users SET name = ? WHERE email = ?", [name, email],(err,result)=>{
      if(err){
        console.log(err)
      }
    })
  }
  // if user enterd a New Gender, ONLY THEN we update it
  if(gender){
    db.query("UPDATE users SET gender = ? WHERE email = ?", [gender, email],(err,result)=>{
      if(err){
        console.log(err)
      }
    })
  }

  // if user enterd a New username, ONLY THEN we update it
  if(username){
    db.query("SELECT username FROM users WHERE username = ?", [username], (err,result)=>{
      if(err){
        console.log(err)
      }
      console.log("Username result:", result)
      if(result.length > 0){
        res.render('profile_edit.ejs', { 
          message: 'Username taken',
          name: 'Edit Profile'
        }) } else {
          db.query("UPDATE users SET username = ? WHERE email = ?", [username, email],(err,result)=>{
            if(err){
              console.log(err)
            }
            if(result){
                res.render('profile_edit.ejs', { 
                  message: 'Successfull',
                  name: 'Edit Profile'
                })
            }
          })
        }
      }
    )
  } 
  
  
  
  
  if(old_password){
    db.query("SELECT * FROM users WHERE email = ?", [email], (err,result)=> {
      if(err){
        console.log(err)
      }
      if(result){
        console.log(result)
        const hashed_password = result[0].password
        bcrypt.compare(old_password, hashed_password, async (err,result) => {
          if(err){
            console.log(err)
          }
          if(result == true){ // if the entered old password matches with the DB then we further continue with new passwords
            if(new_password == new_password_confirm){
              let new_hashed_password = await bcrypt.hash(new_password, 8)
              db.query("UPDATE users SET password = ? WHERE email = ?", [new_hashed_password, email])
            } else {
              res.render('profile_edit.ejs', { 
                message: "New Passwords Don't Match ",
                name: 'Edit Profile'
              })
            }
          } else if(result == false){
            res.render('profile_edit.ejs', { 
              message: 'Invalid Old Password',
              name: 'Edit Profile'
            })
          } 
        })
      }
    })
  }


  
})










module.exports = router