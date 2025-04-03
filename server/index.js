const express = require('express')
const dbConnection = require('./config/dbConnection')
const userRoutes = require('./routes/userRoutes')
const managerRoutes = require('./routes/managerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const turfRoutes = require('./routes/turfRoutes')
require('dotenv').config()

const app = express()


app.get('/',(req,res)=>{
    res.json("server started")
})

dbConnection()

app.use(express.json())  

//routes
app.use('/user', userRoutes)
app.use('/manager',managerRoutes)
app.use('/admin', adminRoutes)
app.use('/turfs', turfRoutes)

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err);
    } else{
        console.log(`server starts on port ${process.env.PORT}`);
        
    }
})