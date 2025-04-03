const { loginManger, getManagerData, manageBooking, createTurf, updateTurf, deleteTurf } = require('../controllers/managerController')
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../middlewares/multer')
const roleMiddleware = require('../middlewares/roleMiddleware')

const managerRoutes = require('express').Router()

managerRoutes.post('/login',loginManger)
managerRoutes.get('/dashboard', authMiddleware,getManagerData)
managerRoutes.get('/bookings/:bookingId', authMiddleware,roleMiddleware(['manger']),manageBooking)

//turf management
managerRoutes.post('/create-turf',authMiddleware, upload.array("images",3), createTurf)
managerRoutes.patch('/update-turf/:turfId',authMiddleware, upload.array("images",3), updateTurf)
managerRoutes.delete('/delete-turf/:turfId',authMiddleware, deleteTurf)
deleteTurf



module.exports = managerRoutes