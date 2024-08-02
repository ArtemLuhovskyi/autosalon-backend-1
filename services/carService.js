const Cars = require('../db/models/Cars.js');
const GalleryCars = require('../db/models/GalleryCars.js');
const models = require('../db/models');

class CarService {
    constructor() {
        this.carModel = models.Cars;
    }
    async getAllCars() {
        const cars = await this.carModel.findAll({
            include: [
                {
                    model: models.GalleryCars,
                    as: 'images',

                }
            ]
        });
        console.log('cars: ', cars);
        return cars;

    }
    async getCarById(id) {
        return await this.carModel.findByPk(id);
    }
    async createCar(car) {
        return await this.carModel.create(car);
    }
    
    async updateCar(id, car) {
        return await this.carModel.update(car, {
            where: {
                id: id
            }
        });
    }
    async deleteCar(id) {
        await models.GalleryCars.destroy({
            where: {
                car_id: id
            }
        });

        return await this.carModel.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = CarService;