const mysql = require('mysql');

const db = mysql.createConnection(
    {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})







exports.home = async (req,res) => {
    // Selecting 4 random products to display on Home Page
    let counter = 1
    let randomArray = []
    let random = 1
    while(counter <= 4){
        // 7 is the total number of products for now and we add 1 to include fisrt and last product
        let n = (Math.floor( (Math.random() * 7) + 1 ))
        if(randomArray.includes(n)){
            // skip this number then
        } else {
            randomArray.push(n)
            counter = counter + 1
            }
    }
    console.log(randomArray)
    const products_array = []
    let i = 0
    while(i<4){
        
        try {const result = await new Promise((resolve,reject) => {
            db.query("SELECT * FROM products WHERE id = ?", [randomArray[i]],(err,result) => {
                if(err){
                    reject(err)
                } else{
                    resolve(result)
                }
            })
        })
        products_array.push(result)
        i = i + 1
    } catch(err){
        console.log(err)
    }
    }

    // Now we display the 4 products stored in product_array
    res.render('home.ejs', { products: products_array })
}