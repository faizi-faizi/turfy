const jwt = require('jsonwebtoken')

const userModel = require('../model/userModel')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        console.log(authHeader, "===header");
        

        const authToken = authHeader && authHeader.split(" ")[1];
        // if there is no tocken
        if (!authToken) return res.json({ loginfail: true, status: false, message: "no auth token" });

        //decording the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY)
        //checking whether the user is exist or not
        const user = await userModel.findOne({ _id: decoded.id })
        if (!user) return res.json({ loginfail: true, status: false, message: "User not Found" })
        
        req.user = decoded.id

        next()
    } catch (error) {
        return res.json({ loginfail: true, status: false, message: "Please Login" })
    }
}