const { Model, DataTypes, literal } = require("sequelize");
const SequelizeConnector = require("../connectors/sequelizeConnector");
const sequelize = SequelizeConnector.getInstance().sequelizeInstance();

class Brand extends Model { }

Brand.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        brand: {
            type: DataTypes.STRING,
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
        tableName: "brand",
        sequelize,
    }
);

Brand.sync()
    .then(() => {
        console.log('Table brand created successfully');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = Brand;