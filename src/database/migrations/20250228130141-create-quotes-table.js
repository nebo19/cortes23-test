'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quotes', {
      quote_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'products',
          key: 'product_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      input_parameters: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Complete input request parameters'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('quotes');
  }
};