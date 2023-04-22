'use strict';
/** @type {import('sequelize-cli').Migration} */
/** In this migration skeleton we have de async up method that permit making changes in database
 * In this case, we create the doctors table with different fields
 * associations with users and addresses tables
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctors', {
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
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      license: {
        type: Sequelize.STRING,
        validate: {
          len: [7, 8],
        },
      },
      speciality: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('doctors');
  },
};
