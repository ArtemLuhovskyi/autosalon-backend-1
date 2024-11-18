const { Model, DataTypes, literal } = require("sequelize");
const SequelizeConnector = require("../connectors/sequelizeConnector");
const sequelize = SequelizeConnector.getInstance().sequelizeInstance();

class Connections extends Model {}

Connections.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true, 
            },
        },
        problems: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wishes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: "connections",
        sequelize,
    }
);

Connections.sync()
  .then(() => {
    console.log('Table connections created successfully');
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = Connections;