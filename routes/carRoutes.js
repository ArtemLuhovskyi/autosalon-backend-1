const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/getData', carController.getData);
router.get('/getTeam', carController.getTeam);
router.get('/getCars', carController.getCars);
router.post('/addCar', carController.addCar);
router.post('/deleteCar', carController.deleteCar);
router.put('/updateCar', carController.updateCar);
router.post('/getCarById', carController.getCarById);
router.post('/login', carController.login);
router.post('/register', carController.register);

module.exports = router;
