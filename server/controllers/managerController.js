const bookingModel = require('../model/bookingModel')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const turfModel = require('../model/turfModel')
const uploadToCloudinary = require('../utilities/imageUpload')

const loginManger = async (req,res)=>{
    try {
        const {email,password}= req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await userModel.findOne({email, role:'manager'})
        if(!user){
            return res.status(404).json({message:"manager not found"})
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user._id,role:'manager'}, process.env.JWT_SECRET_KEY)

        res.status(200).json({message:"Manager login successful",token,user})


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


const getManagerData = async (req,res)=>{
    try {
        const managerId = req.user._id
        const bookings = await bookingModel.find({managerId}).populate('turfId')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


//for creating turf
const createTurf = async (req,res)=>{
    try {
        if(req.user.role !== 'manager'){
            return res.status(403).json({message:"Access denied, only managers can create turfs"})
        }

        const {name,location,price,slots,amenities}= req.body;
        if(!name|| !location || !price || !slots || !amenities){
            return res.status(400).json({message:"all fields are required"})
        }


        if(!req.files || req.files.length===0){
            return res.status(400).json({message:"at least one image is required"})
        }
        
        const parsedLocation = JSON.parse(location)

        const cloudinaryRes = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.path)) 
        );

        const newTurf = new turfModel({
            name,
            location:parsedLocation,
            price,
            slots:slots.split(","),
            amenities:amenities.split(","),
            images:cloudinaryRes,
            managerId:req.user.id
        })

        const savedTurf = await newTurf.save();
        res.status(201).json({message:"Turf created successfully", turf:savedTurf});


    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json( error.message || "Internal server error")
    }
}


const updateTurf = async(req,res)=>{
    try{
        const {turfId} = req.params;
        const {name,location,price,slots,amenities} = req.body
        let imageUrl;
        let cloudinaryRes = [];

        let isTurfExist = await turfModel.findById(turfId)

        if(!isTurfExist){
            return res.status(400).json({error:"Turf not found"})
        }

        let parsedLocation = isTurfExist.location;
        if (location) {
            try {
                parsedLocation = JSON.parse(location);
            } catch (err) {
                return res.status(400).json({ error: "Invalid location format" });
            }
        }


        if(req.file){
                const cloudinaryRes = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.path)) 
            );
            imageUrl = cloudinaryRes
        }

        const updatedTurf = await turfModel.findByIdAndUpdate(turfId,{name,
            location:parsedLocation,
            price,
            slots: slots ? slots.split(",") : isTurfExist.slots,
            amenities:amenities? amenities.split(","): isTurfExist.amenities,
            images:cloudinaryRes,
            image:imageUrl}, {new:true})

            return res.status(200).json({ message: "Turf updated successfully", turf: updatedTurf });

    } catch(error){
        console.log(error)
        res.status(error.status || 500).json(error.message || "internal server error")
    }
}



//to manage the bookings
const manageBooking = async (req,res)=>{
    try{
        const { bookingId } = req.params
        const { status } = req.body

        const udatedBooking = await bookingModel.findByIdAndUpdate(bookingId,{status},{new: true})
        
        res.status(200).json({message:"Booking updated", updatedBooing})

        }
        catch{
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
        }
}

const deleteTurf = async(req, res)=>{
    try {
        const {turfId} = req.params
        const deleteTurf = await turfModel.findByIdAndDelete(turfId)

        if(!deleteTurf){
            return res.status(400).json({message:"Turf not found"})
        }

        res.status(200).json({message:"Turf Deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = { loginManger, getManagerData, manageBooking, createTurf, updateTurf,deleteTurf }