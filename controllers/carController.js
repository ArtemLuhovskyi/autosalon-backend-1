const bcrypt = require('bcrypt');
const Cars = require('../db/models/Cars.js');
const Users = require('../db/models/Users.js');
const dataCars = require('../data.js');
const Team = require('../db/models/Team.js');
const carService = require('../services/carService');
const teamService = require('../services/teamService');

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
    console.log('body ', req.body);
    const {img, title, description, price } = req.body;

    const newCarObj = {
      img,
        title,
        description,
        price,
    };
    await CarsService.createCar(newCarObj);

    res.send({ message: 'Car added' });
};

exports.deleteCar = async (req, res) => {
    const { id } = req.body;
    await CarsService.deleteCar(id);
    res.send({ message: 'Car deleted' });
};

exports.updateCar = async (req, res) => {
    const { id, img,title, description, price } = req.body;
    const newCarObj = {
      id,
      img,
        title,
        description,
        price,
    };
    await CarsService.updateCar(id, newCarObj);
    res.send({ message: 'Car updated' });
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