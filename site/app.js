const express = require('express');
const app = express();

const dotenv = require('dotenv')
dotenv.config({ path: './info.env' }) // We can't make all our passwords, users, DB Names etc public

const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const db = mysql.createConnection(
    {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
}
)

db.connect(function(err){
    if(err){
        console.log(err);
    } else {
        console.log("MYSQL Database Connected!")
    }
})


app.set('view engine' , require('ejs'))
app.use(express.static('public'))
app.use(express.static('public/images'))

// Parse URL -encoded bodies (as sent by the html form)
app.use(express.urlencoded({ extended: false }))
// Parse JSON bodies (as sent by API Clients)
app.use(express.json())
app.use(cookieParser())








// Defining Routes
app.use('/', require('./routes/pages.js'))
app.use('/auth', require('./routes/auth.js'))
app.use('/details', require('./routes/details.js'))
app.use('/breakfast', require('./routes/breakfast.js'))
app.use('/profile', require('./routes/profile.js'))

app.listen(3000, function(){
    console.log('Server started on port 3000!')
})