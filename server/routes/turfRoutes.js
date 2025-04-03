const { listTurf, turfDetails } = require('../controllers/turfControllers')

const turfRoutes = require('express').Router()

turfRoutes.get('/list-turfs', listTurf)
turfRoutes.get('/list-turfs/:turfId', turfDetails)

module.exports = turfRoutes