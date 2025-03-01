'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rates', {
      rate_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      quote_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quotes',
          key: 'quote_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rate_class: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rate_options: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    await queryInterface.addIndex('rates', ['quote_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rates');
  },
};
