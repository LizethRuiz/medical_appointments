'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedules extends Model {
    /**
     * Here indicate associations with other models:
     * Doctor:Schedule -> 1:N (A doctor can make his schedule)
     */
    static associate(models) {
      schedules.belongsTo(models.doctors);
    }
  }
  schedules.init(
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'schedules',
    }
  );
  return schedules;
};
