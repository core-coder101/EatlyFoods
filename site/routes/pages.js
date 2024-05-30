const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const mysql = require('mysql')

app = express()

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



// Middleware that will check if the user is authenticated or not
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token
  console.log('Token:', token)
  if(!token){
    return res.redirect('/login')
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  try{
    if(err){
    if(err.name == 'TokenExpiredError'){
      res.redirect('/login')
    } else {
      console.log(err)
    }
  }
  if(decoded){
    await db.query("SELECT * FROM users WHERE email = ?", [decoded.email], (err,userResult) => {
      if(err){
        console.log(err)
      }
      if(userResult.length > 0){
        return next()
      } else {
        res.redirect('/login')
      }
    })
  }
} catch(err){
  console.log(err)
}
}
)
}

const sessionChecker = (req, res, next) => {
  const token = req.cookies.token
  if(!token){
    return next()
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err,session_decoded) => {
    if(err){
      if(err.name == 'TokenExpiredError'){
        return next();
      }
    } else {
      console.log(err)
    }
    if(session_decoded){
      await db.query("SELECT * FROM users WHERE email = ?", [session_decoded.email], (err,user_profile) => {
        if(err){
          console.log(err)
        }
        if(user_profile){
          console.log(user_profile)
          res.redirect('/')
        } else {
          return next()
        }
      })
    }
  })
}


const product_displayer = require('../controllers/product_displayer.js');
const { resolve } = require('path');
const { rejects } = require('assert');

router.get('/', isAuthenticated,product_displayer.home)

router.get('/signup', sessionChecker,(req,res) => {
    res.render('signup.ejs', { message: '' });
})

router.get('/login', sessionChecker,(req,res) => {
    res.render('login.ejs', { message: '' });
})
router.get('/about', isAuthenticated, (req,res) => {
  res.render('about.ejs', { name: "About" })
})
router.get('/menu', isAuthenticated, async (req,res) => {
  let i = 1
  let products_arr = []
  while(i < 8){
    try {const result = await new Promise((resolve,rejects)=>{
      db.query("SELECT * FROM products WHERE id = ?", [i], (err, products_result)=>{
        if(err){
          rejects(err)
        } else {
          resolve(products_result)
        }
      })
      
    })

    products_arr.push(result)
    i = i + 1
  } catch(err){
      console.log(err)
    }
  }
  res.render('menu.ejs', {
    name: "Menu",
    products: products_arr
  })
})


router.get('/logout', isAuthenticated,(req,res)=>{
  res.clearCookie('token').redirect('/')
})
router.get('/delete', isAuthenticated, (req,res)=>{
  const token = req.cookies.token
  const token_decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded_result)=>{
    if(err){
      console.log(err)
    }
    if(decoded_result){
      return decoded_result
    }
  })


  const email = token_decoded.email
  db.query("DELETE FROM users WHERE email = ?", [email], (err, query_result)=>{
    if(err){
      console.log(err)
    } else{
      res.clearCookie('token').redirect('/')
    }
  })

})


module.exports = router;