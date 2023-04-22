'use strict';
/** Each model class representates a database table, in the model we can define:
 * In the init method indicate the fields and their properties
 * Here indicate associations with other models, for example the addresses table has a relation 1:1 with doctors table
 */
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    static associate(models) {
      addresses.hasOne(models.doctors);
    }
  }
  addresses.init(
    {
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      fullAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'addresses',
    }
  );
  return addresses;
};
