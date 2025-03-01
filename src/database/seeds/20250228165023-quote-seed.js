'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('quotes', [
      {
        quote_id: uuidv4(),
        product_id: 'term-life',
        input_parameters: JSON.stringify({
          productId: 'term-life',
          state: 'PA',
          sex: 'M',
          dateOfBirth: '1970-01-01',
          amount: 25000000,
          benefitType: 'LS',
          mode: 'M',
          riders: ['child', 'chronic'],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        quote_id: uuidv4(),
        product_id: 'term-life',
        input_parameters: JSON.stringify({
          productId: 'term-life',
          state: 'NY',
          sex: 'F',
          dateOfBirth: '1985-05-15',
          amount: 10000000,
          benefitType: 'LS',
          mode: 'A',
          riders: [],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        quote_id: uuidv4(),
        product_id: 'disability',
        input_parameters: JSON.stringify({
          productId: 'disability',
          state: 'PA',
          sex: 'M',
          dateOfBirth: '1970-01-01',
          amount: 25000000,
          benefitType: 'LS',
          mode: 'M',
          riders: ['child', 'chronic'],
          annualIncome: 10000000,
          smoker: false,
          eliminationPeriod: '90',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        quote_id: uuidv4(),
        product_id: 'disability',
        input_parameters: JSON.stringify({
          productId: 'disability',
          state: 'CA',
          sex: 'F',
          dateOfBirth: '1982-08-20',
          amount: 15000000,
          benefitType: 'LS',
          mode: 'Q',
          riders: ['chronic'],
          annualIncome: 8500000,
          smoker: true,
          eliminationPeriod: '180',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('quotes', null, {});
  },
};
