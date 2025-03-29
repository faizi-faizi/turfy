const express = require('express')
const dbConnection = require('./config/dbConnection')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

const app = express()


app.get('/',(req,res)=>{
    res.json("server started")
})

dbConnection()

app.use(express.json())  

//routes
app.use('/user', userRoutes)

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err);
    } else{
        console.log(`server starts on port ${process.env.PORT}`);
        
    }
})