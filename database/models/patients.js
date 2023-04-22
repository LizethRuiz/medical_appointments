'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patients extends Model {
    /**
     * Here indicate associations with other models:
     * Patients:Appointments -> 1:N (A patient can schedule many appointments)
     * Patients:User -> 1:1 (A patient belongs to a user)
     */
    static associate(models) {
      patients.hasMany(models.appointments);
      patients.belongsTo(models.users);
    }
  }
  patients.init(
    {
      age: DataTypes.INTEGER,
      allergies: DataTypes.TEXT,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'patients',
    }
  );
  return patients;
};
