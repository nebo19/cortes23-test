'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const quotes = await queryInterface.sequelize.query(
      'SELECT quote_id, product_id FROM quotes',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const termLifeQuotes = quotes.filter(
      (quote) => quote.product_id === 'term-life'
    );
    const disabilityQuotes = quotes.filter(
      (quote) => quote.product_id === 'disability'
    );

    const termLifeRates = [];
    for (const quote of termLifeQuotes) {
      termLifeRates.push({
        rate_id: uuidv4(),
        quote_id: quote.quote_id,
        rate_class: 'preferredPlus',
        rate_options: JSON.stringify({
          term10: 4474,
          term15: 4630,
          term20: 4697,
          term30: 4919,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });

      termLifeRates.push({
        rate_id: uuidv4(),
        quote_id: quote.quote_id,
        rate_class: 'standard',
        rate_options: JSON.stringify({
          term10: 5997,
          term15: 6215,
          term20: 6308,
          term30: 6620,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const disabilityRates = [];
    for (const quote of disabilityQuotes) {
      disabilityRates.push({
        rate_id: uuidv4(),
        quote_id: quote.quote_id,
        rate_class: '4A',
        rate_options: JSON.stringify({
          '2BP-30EP': 4474,
          '2BP-90EP': 4630,
          '2BP-180EP': 4697,
          '5BP-90EP': 4919,
          '5BP-180EP': 4999,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });

      disabilityRates.push({
        rate_id: uuidv4(),
        quote_id: quote.quote_id,
        rate_class: '4M',
        rate_options: JSON.stringify({
          '2BP-30EP': 5236,
          '2BP-90EP': 5422,
          '2BP-180EP': 5503,
          '5BP-90EP': 5770,
          '5BP-180EP': 5870,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('rates', [
      ...termLifeRates,
      ...disabilityRates,
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rates', null, {});
  },
};
