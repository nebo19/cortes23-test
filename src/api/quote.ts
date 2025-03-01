import { response } from 'utils/response';
import Rate from 'database/models/Rate';
import Quote from 'database/models/Quote';
import { Op, Sequelize } from 'sequelize';
import { z } from 'zod';
import { parseData } from 'utils/parseData';

interface QuoteWithRates extends Quote {
  rates?: Rate[];
}

const schema = z
  .object({
    productId: z.string(),
    state: z.string().optional(),
    sex: z.string().optional(),
    dateOfBirth: z.string().optional(),
    amount: z.number().optional(),
    benefitType: z.string().optional(),
    mode: z.string().optional(),
    riders: z.array(z.string()).nonempty().optional(),
    annualIncome: z.number().optional(),
    smoker: z.boolean().optional(),
    eliminationPeriod: z.string().optional(),
  })
  .strict();

export const quote = async (payload: string) => {
  const validationResult = parseData(schema, payload);

  if (validationResult.success === false) {
    return validationResult.response;
  }

  const data = validationResult.data;

  const whereClause = { product_id: data.productId };

  const arrayParametersKeys = Object.keys(data)
    .filter((key) => Array.isArray(data[key]))
    .map((key) => key);

  // Handle array parameters
  if (arrayParametersKeys.length > 0) {
    whereClause[Op.and] = arrayParametersKeys.flatMap((key) =>
      data[key].map((value: string) =>
        Sequelize.literal(
          `JSON_CONTAINS(JSON_EXTRACT(input_parameters, '$.${key}'), '"${value}"')`
        )
      )
    );
  }

  const quote = await Quote.findOne<QuoteWithRates>({
    where: whereClause,
    include: [
      {
        model: Rate,
        as: 'rates',
        required: false,
        attributes: ['rate_class', 'rate_options'],
      },
    ],
  });

  if (!quote?.rates || quote.rates.length === 0) {
    return response(404, { message: 'Rates not found' });
  }

  const rates = quote.rates.map((rate) => ({
    rate_class: rate.rate_class,
    ...rate.rate_options,
  }));

  return response(200, { rates });
};
