const { Model, DataTypes, literal } = require("sequelize");
const SequelizeConnector = require("../connectors/sequelizeConnector");
const sequelize = SequelizeConnector.getInstance().sequelizeInstance();

class GalleryCars extends Model { }

GalleryCars.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        img_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        img_type: {
            type: DataTypes.ENUM('main', 'hero', 'gallery', 'description'),
            allowNull: true
        },
        car_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
              model: 'cars',
              key: 'id'
            },
            allowNull: false
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
        tableName: "galleryCars",
        sequelize,
    }
);


GalleryCars.sync()
    .then(() => {
        console.log('Table galleryCars created successfully');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = GalleryCars;