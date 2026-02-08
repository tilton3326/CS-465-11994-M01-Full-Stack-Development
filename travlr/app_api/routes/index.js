var express = require('express');
var router = express.Router();

// import the controllers to be routed
const tripsController = require('../controllers/trips');

/* GET /api/trips - list all trips */
router
    .route('/trips')
    .get(tripsController.tripsList);

// Get method routes tripsFindByCode - required param
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode);

module.exports = router;