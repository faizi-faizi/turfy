const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    method:{
        type:String,
        required:true
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true })

const Payment = mongoose.model('payments', paymentSchema)
module.exports = Payment