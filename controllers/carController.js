const bcrypt = require('bcrypt');
const Cars = require('../db/models/Cars.js');
const Users = require('../db/models/Users.js');
const dataCars = require('../data.js');
const Team = require('../db/models/Team.js');
const carService = require('../services/carService');

const CarsService = new carService();

exports.getData = (req, res) => {
    res.send({ data: dataCars });
};

exports.getTeam = async (req, res) => {
    // await Team.create({
    //   img: '/img/01.png',
    //       title: "Артем Луговський",
    //       description: "Керівник фірми"
    // });
    // await Team.create({
    //   img: '/img/02.png',
    //       title: "Марія Михайлівна",
    //       description: "Менеджер"
    // });
    // await Team.create({
    //   img: '/img/03.png',
    //   title: "Вікторія Вікторівна",
    //   description: "Менеджер"
    // });
    // await Team.create({
    //   img: '/img/04.png',
    //   title: "Вадим Вадимович",
    //   description: "Фахівець із запчастин"
    // });

    const dataTeam = await Team.findAll();
    console.log(dataTeam);
    res.send({ data: dataTeam });
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
    console.log('body ', req.body);
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