const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const createToken = require("../utilities/generateToken");

const register = async(req,res) =>{
    try {
        const {name,email,phone,password} = req.body

        if(!name || !email || !phone || !password){
            return res.status(400).json({error:'All fields are required'})
        }

        const salt =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({name,email,phone,password:hashedPassword})
        
        const userDetails = await newUser.save()
        return res.status(201).json({message: "Account created", userDetails})

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
        
    }
}

const login = async(req,res)=>{
    try {
        const {email, password}= req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const userExist = await userModel.findOne({ email })
        if (!userExist){
            return res.status(400).json({error:"user not found"})
        }
        const passwordMatch = await bcrypt.compare(password,userExist.password)
        console.log(passwordMatch, "===pMatch");
        
        if(!passwordMatch){
            return res.status(400).json({error:"not a valid password"})
        }

        const userObject = userExist.toObject()
        delete userObject.password

        const token = createToken(userExist._id)

        return res.status(200).json({message:"Login Successfull", userExist,token})

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
        
    }
}

const profile = async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
    }
}

const updateUser = async (req,res)=>{
    try {
        const userId = req.user
        const updatedUser = await userModel.findByIdAndUpdate(userId,req.body, {new:true})
        res.status(200).json({message:"user upated",updatedUser})
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
    }
}

const deleteUser = async (req,res)=>{
    try {
        const {userId} = req.params
        await userModel.findByIdAndDelete(userId)
        return res.status(200).json("user deleted")
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
    }
}



module.exports = {
    register, login, profile, updateUser,deleteUser
}