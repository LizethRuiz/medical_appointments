'use strict';
/** @type {import('sequelize-cli').Migration} */

/** In this migration skeleton we have de async up method that permit making changes in database
 * In this case, we create the patients table with different fields
 * association with users table
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      age: {
        type: Sequelize.INTEGER,
      },
      allergies: {
        type: Sequelize.TEXT,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patients');
  },
};
