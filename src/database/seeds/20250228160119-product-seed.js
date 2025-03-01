'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('products', [
      {
        product_id: 'term-life',
        name: 'Term Life Insurance',
        description: 'Life insurance that provides coverage for a specified term',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 'disability',
        name: 'Disability Insurance',
        description: 'Insurance that provides income if you become disabled and unable to work',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
