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
  try {
    const { title, description } = req.body;
    const newTeamObj = { title, description };
    const newTeam = await TeamService.createTeam(newTeamObj);

    if (req.file) {
      const teamId = newTeam.id.toString();
      const imgDir = path.join(__dirname, '../public/images/team', teamId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(req.file.path, imgPath);

      newTeam.img = `images/team/${teamId}/${req.file.originalname}`;
      await newTeam.save();
    }

    res.status(201).send({ message: 'Team added', team: newTeam });
  } catch (error) {
    res.status(500).send({ message: 'Error adding team', error });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.body;
    await TeamService.deleteTeam(id);
    const teamImagePath = path.join(__dirname, '../public/images/team', id.toString());

    fs.rmdirSync(teamImagePath, { recursive: true });
    res.send({ message: 'Team deleted' });
} catch (error) {
    res.status(500).send({ message: 'Error deleting team', error });
}
};

exports.updateTeam = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    const team = await TeamService.getTeamById(id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.title = title;
    team.description = description;

    if (req.file) {
      const teamId = team.id.toString();
      const imgDir = path.join(__dirname, '../public/images/team', teamId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(req.file.path, imgPath);

      team.img = `images/team/${teamId}/${req.file.originalname}`;
    }

    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).send({ message: 'Error updating team', error });
  }
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
      const imgDir = path.join(__dirname, '../public/images/cars', carId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(tempPath, imgPath);

      await models.GalleryCars.create({
        img_url: path.join('images/cars', carId, req.file.originalname),
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
      const imgDir = path.join(__dirname, '../public/images/cars', carId);
      const imgPath = path.join(imgDir, req.file.originalname);

      fs.mkdirSync(imgDir, { recursive: true });
      fs.renameSync(tempPath, imgPath);

      await models.GalleryCars.update({
        img_url: path.join('images/cars', carId, req.file.originalname),
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
      const carImagePath = path.join(__dirname, '../public/images/cars', id.toString());

      fs.rmdirSync(carImagePath, { recursive: true });
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