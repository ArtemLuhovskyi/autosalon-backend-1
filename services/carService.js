const Cars = require('../db/models/Cars.js');

class CarService {
    constructor() {
        this.carModel = Cars;
    }
    async getAllCars() {
        return await this.carModel.findAll();
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
        return await this.carModel.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = CarService;