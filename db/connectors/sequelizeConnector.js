const { Sequelize } = require('sequelize');

class SequelizeConnector {
    static instance = null;

    static getInstance() {
        if (!SequelizeConnector.instance) {
            SequelizeConnector.instance = new SequelizeConnector();
        }
        return SequelizeConnector.instance;
    }

    constructor() {
        if (SequelizeConnector.instance) {
            throw new Error("Use SequelizeConnector.getInstance()");
        }
        this.sequelize = this.initConnection();
    }

    initConnection() {
        const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: 3306,
            dialect: "mysql",
            dialectOptions: {
                connectTimeout: 60000,
            },
            define: {
                timestamps: true,
            },
        });

        sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.')
            })
            .catch((err) => {
                console.log('Unable to connect to the database:', err)
            })

        return sequelize;
    }

    sequelizeInstance() {
        return this.sequelize;
    }
}

module.exports = SequelizeConnector;