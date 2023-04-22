'use strict';
/** @type {import('sequelize-cli').Migration} */
/** In this migration skeleton we have de async up method that permit making changes in database
 * In this case, we create the appointments table with different fields
 * associations with patients and doctors tables
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      doctorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      notes: {
        type: Sequelize.STRING,
      },
      canceled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('appointments');
  },
};
