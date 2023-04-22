'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class doctors extends Model {
    /**
     * Here indicate associations with other models:
     * Doctors:Addresses -> 1:1 (A doctor has an address)
     * Doctors:Users -> 1:1 (A doctor belongs to a user)
     * Doctors:Schedules -> 1:N (A doctor can do many schedules range with start and end dates)
     * Doctors:Appointments -> 1:N (A doctor can attend many appointments)
     */
    static associate(models) {
      doctors.belongsTo(models.addresses);
      doctors.belongsTo(models.users);
      doctors.hasMany(models.schedules);
      doctors.hasMany(models.appointments);
    }
  }
  doctors.init(
    {
      speciality: DataTypes.STRING,
      license: {
        type: DataTypes.STRING,
        validate: {
          len: [7, 8],
        },
      },
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'doctors',
    }
  );
  return doctors;
};
