const turfModel = require("../model/turfModel");

const listTurf = async(req,res)=>{
    try {
        const turfList = await turfModel.find();
        res.status(200).json(turfList)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const turfDetails = async(req,res)=>{
    try {
        const { turfId } = req.params;
        
        const turfDetails = await turfModel.findById(turfId)
        if(!turfDetails){ 
           return res.status(400).json({error:"Turf not found"})
        }

        res.status(200).json(turfDetails)

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}

module.exports = { listTurf, turfDetails }