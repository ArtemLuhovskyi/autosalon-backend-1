const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../public/temp');
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/getData', carController.getData);

router.get('/getTeam', carController.getTeam);
router.post('/addTeam', upload.single('file'), carController.addTeam);
router.post('/deleteTeam', carController.deleteTeam);
router.put('/updateTeam', upload.single('file'), carController.updateTeam);

router.get('/getCars', carController.getCars);
router.post('/addCar',  upload.single('file'), carController.addCar);
router.post('/deleteCar', carController.deleteCar);
router.put('/updateCar',  upload.array('file'), carController.updateCar);
router.post('/getCarById', carController.getCarById);

router.post('/login', carController.login);
router.post('/register', carController.register);




module.exports = router;
