'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class appointments extends Model {
    /**
     * Here indicate associations with other models:
     * Patients:Appointments -> 1:N (A patient can be schedule many appointments)
     * Doctors:Appointments -> 1:N (A doctor can be attend many appointments)
     */
    static associate(models) {
      appointments.belongsTo(models.patients);
      appointments.belongsTo(models.doctors);
    }
  }
  appointments.init(
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      notes: DataTypes.STRING,
      canceled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'appointments',
    }
  );
  return appointments;
};
