const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: true
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    }
},{timestamps:true})

const reviewModel = mongoose.model('review',reviewSchema)
module.exports = reviewModel