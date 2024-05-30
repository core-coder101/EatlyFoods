const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

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
    const user = jwt.verify(token, process.env.JWT_SECRET,async (err, result) => {
    try{
      if(err){
      if(err.name == 'TokenExpiredError'){
        res.redirect('/login')
      } else {
        console.log(err)
      }
    }
    if(result){
      await db.query("SELECT * FROM users WHERE email = ?", [result.email], (err,result) => {
        if(err){
          console.log(err)
        }
        if(result.length > 0){
          return next()
        } else {
          res.sendStatus(401)
        }
      })
    }
  } catch(err){
    console.log(err)
  }
  }
  )
  }








router.get('/:item', isAuthenticated,async function(req,res){
    try{
        let name = req.params.item
        console.log(name)
        await db.query("SELECT * FROM breakfast WHERE name = ?", [name], (err,result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
            }
            if (result.length == 0){
                return res.status(404).send("Product not found");
            }

            let product = result[0]
            console.log(product)
            res.render('details.ejs', {
                name: product.name,
                description: product.description,
                path: '/' + product.img
            })
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router