'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      /**
       * Here indicate associations with other models:
       * User:Doctor -> 1:1 (A user has one doctor)
       * User:Patients -> 1:1 (A user has one patient)
       */
      users.hasOne(models.doctors);
      users.hasOne(models.patients);
    }
  }
  users.init(
    {
      name: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 10],
        },
      },
      deleted: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: 'users',
    }
  );
  return users;
};
