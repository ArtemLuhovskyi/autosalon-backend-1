const { Model, DataTypes, literal } = require("sequelize");
const SequelizeConnector = require("../connectors/sequelizeConnector");
const sequelize = SequelizeConnector.getInstance().sequelizeInstance();

class Cars extends Model { }

Cars.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    },
    {
        tableName: "cars",
        sequelize,
    }
);


Cars.sync()
    .then(() => {
        console.log('Table cars created successfully');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = Cars;