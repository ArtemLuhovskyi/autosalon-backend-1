const bcrypt = require('bcrypt');
const Cars = require('../db/models/Cars.js');
const Brand = require('../db/models/Brand.js');
const Users = require('../db/models/Users.js');
const dataCars = require('../data.js');
const Team = require('../db/models/Team.js');
const Orders = require('../db/models/Orders.js');
const Connections = require('../db/models/Connections.js');
const TestDrives = require('../db/models/TestDrives.js');
const carService = require('../services/carService');
const teamService = require('../services/teamService');
const models = require('../db/models');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

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
    const { title, description, price, blocks, descriptionBlocks, brand } = req.body;
    let {instruction} = req.body;

    if (instruction) {
      instruction = JSON.parse(instruction);
    }

    const newCarObj = { title, description, price, additional_info: blocks, description_info: descriptionBlocks, brand_id: brand };
    const newCar = await CarsService.createCar(newCarObj);
    const carId = newCar.id.toString();
    
      // await models.GalleryCars.create({
      //   img_url: path.join('images/cars', carId, req.file.originalname),
      //   img_type: 'main',
      //   car_id: newCar.id
      // });

    if (req.files && req.files.length > 0) {
      
      for (const file of req.files) {
        const tempPath = file.path;
        const imgDir = path.join(__dirname, '../public/images/cars', carId);
        const imgPath = path.join(imgDir, file.originalname);

        fs.mkdirSync(imgDir, { recursive: true });
        fs.renameSync(tempPath, imgPath);

        const instructionNew = instruction.find((inst) => inst.fileName === file.originalname);
        if (instructionNew) {
          if (instructionNew.imgType === "main") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'main',
              car_id: newCar.id
            });
          }
          if (instructionNew.imgType === "hero") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'hero',
              car_id: newCar.id
            });
          }
          if (instructionNew.imgType === "gallery") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'gallery',
              car_id: newCar.id
            });
          }
          if (instructionNew.imgType === 'description') {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'description',
              car_id: newCar.id
            });
          }
        }

      console.log('ImageGallery saved at:', imgPath);
      }
    }

    res.status(201).send({ message: 'Car added', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).send({ message: 'Error adding car', error });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id, title, description, price, blocks, descriptionBlocks, brand } = req.body;
    let {instruction, deleteImages} = req.body;
    const car = await CarsService.getCarById(id);

    if (instruction) {
      instruction = JSON.parse(instruction);
    }

    if (deleteImages) {
      deleteImages = JSON.parse(deleteImages);
    }

    console.log('instruction:', instruction);
    console.log('deleteImages:', deleteImages);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    const carId = car.id.toString();
    car.title = title;
    car.description = description;
    car.brand_id = brand;
    car.price = price;
    car.additional_info = blocks;
    car.description_info = descriptionBlocks;
    
    await models.GalleryCars.destroy(
      {
        where: {
          id: {
            [Op.in]: deleteImages
          }
        }
      });

    if (req.files && req.files.length > 0) {

      if (deleteImages) {
        // for (const img of deleteImages) {
        //   const imgPath = path.join(__dirname, '../public/images/cars', carId, img);
        //   fs.unlinkSync(imgPath);
        // }

      }

      console.log('req.files:', req.files);
      for (const file of req.files) {
        const tempPath = file.path;
        const imgDir = path.join(__dirname, '../public/images/cars', carId);
        const imgPath = path.join(imgDir, file.originalname);

        fs.mkdirSync(imgDir, { recursive: true });
        fs.renameSync(tempPath, imgPath);

        const instructionNew = instruction.find((inst) => inst.fileName === file.originalname);
        if (instructionNew) {
          if (instructionNew.imgType === "main") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'main',
              car_id: car.id
            });
          }
          if (instructionNew.imgType === "hero") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'hero',
              car_id: car.id
            });
          }
          if (instructionNew.imgType === "gallery") {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'gallery',
              car_id: car.id
            });
          }
          if (instructionNew.imgType === 'description') {
            await models.GalleryCars.create({
              img_url: path.join('images/cars', carId, file.originalname),
              img_type: 'description',
              car_id: car.id
            });
          }
        }
        
      console.log('ImageGallery saved at:', imgPath);
      }
    }

    // await CarsService.updateCar(id, car);
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

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.send({ data: brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const { brand } = req.body;

    if (!brand) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const newBrand = await Brand.create({ brand });

    res.status(201).json({ message: 'Brand added successfully', data: newBrand });
  } catch (error) {
    console.error('Error adding brand:', error);

    res.status(500).json({ message: 'Error adding brand' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ message: 'Brand ID is required' });
    }

    const deleted = await Brand.destroy({
      where: { id }
    });

    if (deleted) {
      return res.status(200).send({ message: 'Brand deleted successfully' });
    } else {
      return res.status(404).send({ message: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting brand', error });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id, brand } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Brand ID is required' });
    }

    if (!brand) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const existingBrand = await Brand.findByPk(id);

    if (!existingBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    existingBrand.brand = brand;
    await existingBrand.save();

    res.status(200).json({
      message: 'Brand updated successfully',
      data: existingBrand,
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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

exports.submitOrder = async (req, res) => {
  const { username, company_name, telephone, email, car, wishes } = req.body;
  try {
    
    const newOrder = await Orders.create({
      username,
      company_name,
      telephone,
      email,
      car,
      wishes,
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.submitDrive = async (req, res) => {
  const { username, company_name, telephone, email, time, car, color ,  transmission, wishes } = req.body;
  try {
    
    const newTestDrive = await TestDrives.create({
      username,
      company_name,
      telephone,
      email,
      time,
      car,
      color,
      transmission,
      wishes,
    });
    res.status(201).json({ message: 'TestDrive created successfully', TestDrives: newTestDrive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

exports.getDrives = async (req, res) => {
  try {
    const drives = await TestDrives.findAll();
    res.status(200).json(drives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.submitConnection = async (req, res) => {
  const { username, company_name, telephone, email, problems, wishes } = req.body;
  try {

    const newConnection = await Connections.create({
      username,
      company_name,
      telephone,
      email,
      problems,
      wishes,
    });
    res.status(201).json({ message: 'Connection created successfully', Connections: newConnection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

exports.getConnection = async (req, res) => {
  try {
    const connections = await Connections.findAll();
    res.status(200).json(connections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};