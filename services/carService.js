const Cars = require('../db/models/Cars.js');
const GalleryCars = require('../db/models/GalleryCars.js');
const Brand = require('../db/models/Brand.js');
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

                },
                {
                    model: models.Brand,
                    as: 'brand',
                  }
            ]
        });
        console.log('cars: ', cars);
        return cars;

    }
    async getCarById(id) {
        const car = await this.carModel.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: models.GalleryCars,
                    as: 'images',

                },
                {
                    model: models.Brand,
                    as: 'brand',
                  }
            ]  
        });
        if(car && car.additional_info) {
            car.additional_info = JSON.parse(car.additional_info);
        }
        if(car && car.description_info) {
            car.description_info = JSON.parse(car.description_info);
        }
        
        console.log('car: ', car);
        return car;
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

    // async getAllAdditionInfoCars() {
    //     const additionInfoCars = await this.carModel.findAll
    //     ({
    //         where: {
    //             id: id
    //         },

    //     })
    //     return additionInfoCars;
    // }
}
module.exports = CarService;