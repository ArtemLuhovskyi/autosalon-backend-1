const bcrypt = require('bcrypt');
const Cars = require('../db/models/Cars.js');
const Users = require('../db/models/Users.js');
const dataCars = require('../data.js');
const Team = require('../db/models/Team.js');
const carService = require('../services/carService');
const teamService = require('../services/teamService');
const models = require('../db/models');
const path = require('path');
const fs = require('fs');

const CarsService = new carService();
const TeamService = new teamService();

exports.getData = (req, res) => {
    res.send({ data: dataCars });
};

exports.getTeam = async (req, res) => {
    const dataTeam = await TeamService.getAllTeams();
    console.log(dataTeam);
    res.send({ data: dataTeam });
};

exports.addTeam = async (req, res) => {
    const { img, title, description } = req.body;
    const newTeamObj = {
      img,
      title,
      description,
    };
    await TeamService.createTeam(newTeamObj);
    res.send({ message: 'Team added' });
};

exports.deleteTeam = async (req, res) => {
    const { id } = req.body;
    await TeamService.deleteTeam(id);
    res.send({ message: 'Team deleted' });
};

exports.updateTeam = async (req, res) => {
    const { id, img,title, description } = req.body;
    const newTeamObj = {
      id,
      img,
      title,
      description,
    };
    await TeamService.updateTeam(id, newTeamObj);
    res.send({ message: 'Team updated' });
};


exports.getCars = async (req, res) => {
    const dataCars = await CarsService.getAllCars();
    res.send({ data: dataCars });
};

exports.addCar = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const newCarObj = { title, description, price };
    const newCar = await CarsService.createCar(newCarObj);

    if (req.file) {
      const tempPath = req.file.path;
      const carId = newCar.id.toString();
      const imgDir = path.join(__dirname, '../public/img', carId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(tempPath, imgPath);

      await models.GalleryCars.create({
        img_url: path.join('img', carId, req.file.originalname),
        img_type: 'main',
        car_id: newCar.id
      });

      console.log('Image saved at:', imgPath);
    }

    res.status(201).send({ message: 'Car added', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).send({ message: 'Error adding car', error });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id, title, description, price } = req.body;
    const car = await CarsService.getCarById(id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    car.title = title;
    car.description = description;
    car.price = price;

    if (req.file) {
      const tempPath = req.file.path;
      const carId = car.id.toString();
      const imgDir = path.join(__dirname, '../public/img', carId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(tempPath, imgPath);

      await models.GalleryCars.update({
        img_url: path.join('img', carId, req.file.originalname),
        img_type: 'main',
        car_id: car.id
      }, {
        where: {
          car_id: car.id
        }
      });

      console.log('Image saved at:', imgPath);
    }

    await car.save();
    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).send({ message: 'Error updating car', error });
  }
};

exports.deleteCar = async (req, res) => {
  try {
      const { id } = req.body;
      await CarsService.deleteCar(id);
      res.send({ message: 'Car deleted' });
  } catch (error) {
      res.status(500).send({ message: 'Error deleting car', error });
  }
};

exports.getCarById = async (req, res) => {
    const { id } = req.body;
    const car = await CarsService.getCarById(id);
    res.send({ car });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};