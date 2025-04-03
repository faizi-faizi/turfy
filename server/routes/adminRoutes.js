const { createManager, adminLogin, adminProfile, listTurf } = require('../controllers/adminControllers')
const hashPassword = require('../controllers/hashPassword')
const authMiddleware = require('../middlewares/authMiddleware')


const adminRoutes = require('express').Router()

adminRoutes.post('/admin-login',adminLogin)
adminRoutes.get('/profile',authMiddleware,adminProfile)
adminRoutes.post('/create-manager',authMiddleware, createManager)



module.exports = adminRoutes