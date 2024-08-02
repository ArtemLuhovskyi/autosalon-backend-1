const Cars = require('./Cars');
const Team = require('./Team');
const GalleryCars = require('./GalleryCars');

Cars.hasMany(GalleryCars, {
  foreignKey: 'car_id',
  as: 'images'
});

GalleryCars.belongsTo(Cars, {
  foreignKey: 'car_id',
  as: 'car'
});

module.exports = {
    Cars,
    Team,
    GalleryCars
};