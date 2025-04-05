const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    turfId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Turf',
        required:'true'
    },
    managerId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    date:{
        type:Date,
        required:true
    },
    slot:{
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    }, 
    status:{
        type:String,
        enum: ['pending','confirmed','cancelled'],
        default:'pending'
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Payment'
    }
},{timestamps:true})

const bookingModel = mongoose.model('booking',bookingSchema)
module.exports = bookingModel