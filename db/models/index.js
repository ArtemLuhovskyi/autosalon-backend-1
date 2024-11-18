const Cars = require('./Cars');
const Team = require('./Team');
const Brand = require('./Brand');
const GalleryCars = require('./GalleryCars');

Brand.hasMany(Cars, {
  foreignKey: 'brand_id',
  as: 'cars'
});

Cars.belongsTo(Brand, {
  foreignKey: 'brand_id',
  as: 'brand'
});

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
    Brand,
    GalleryCars
};