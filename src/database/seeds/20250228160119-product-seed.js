'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', [
      {
        product_id: 'term-life',
        name: 'Term Life Insurance',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 'disability',
        name: 'Disability Insurance',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
