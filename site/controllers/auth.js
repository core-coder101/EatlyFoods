const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const express = require('express')
var cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

app.use(session({
    secret: 'Key that will sign our cookie',
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser())



const db = mysql.createConnection(
    {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
}
)




exports.signup = async (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const gender = req.body.gender;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    try {
        const emailResults = await queryAsync('SELECT email FROM users WHERE email = ?', [email]);

        if (emailResults.length > 0) {
            return res.render('signup.ejs', {
                message: 'Email already in use!',
            });
        } else if (password !== passwordConfirm) {
            return res.render('signup.ejs', {
                message: 'Passwords do not match!',
            });
        }

        const usernameResults = await queryAsync('SELECT username FROM users WHERE username = ?', [userName]);

        if (usernameResults.length > 0) {
            return res.render('signup.ejs', {
                message: 'Username taken',
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // Inserting Data
        await queryAsync('INSERT INTO users SET ?', {
            name: name,
            gender: gender,
            userName: userName,
            email: email,
            password: hashedPassword,
        });

        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};






exports.login = (req,res) => {
    console.log(req.body);
    const username = req.body.userName

    db.query('SELECT * FROM users WHERE username = ?', [username], async(err, results) => {
        if(err){
            console.log(err);
        }
        console.log(results)
        // if username actually exists in DB
        if(results.length > 0){
            console.log("Username found in DB!")
            const email = results[0].email
            const user = results[0].username
            const userId = results[0].id
            console.log('Entered Username: ' + user)
            let enteredPassword = req.body.password
            await db.query("SELECT password FROM users WHERE username = ?", [username],(err,result) => {
                if(err){
                    console.log(err);
                } else {
                    if (result.length > 0) {
                        const hashedPassword = result[0].password;

                        console.log('Entered Password: ' + enteredPassword);
                        console.log('Hashed Password from DB: ' + hashedPassword);
                        bcrypt.compare(enteredPassword, hashedPassword, (err,result2) => {
                        if(err){
                            // Error
                            console.log(err);
                        } else if(result2 == true){
                            // Passwords Match
                            console.log("Password is Correct!")
                            const token = jwt.sign({email: email, userId: userId}, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRES
                            })

                            const cookieOptions = {
                                expiresIn: process.env.COOKIE_EXPIRES,
                                httpOnly: true
                            }
                            req.session = { userId: null }
                            req.session.userId = result[0].userId
                            res.cookie("token", token, cookieOptions).redirect('/');

                        } else if(result2 == false){
                            console.log("Passwords didn't match")
                            res.render('login.ejs', { message: 'Incorrect Password' })
                        } else {
                            res.render('login.ejs', { message: 'Username not found' })
                            }
            })
                    }
                }
            })
            
            


        } else if(!(results.length > 0)){
            res.render('login.ejs', { message: "Username not found" })
        }
    })
}

