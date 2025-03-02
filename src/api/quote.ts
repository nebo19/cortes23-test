import { response } from 'utils/response';
import Rate from 'database/models/Rate';
import Quote from 'database/models/Quote';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { z } from 'zod';
import { parseData } from 'utils/parseData';

interface QuoteWithRates extends Quote {
  rates?: Rate[];
}

const schema = z.object({ productId: z.string() }).passthrough();

export const quote = async (payload: string) => {
  const validationResult = parseData(schema, payload);

  if (validationResult.success === false) {
    return validationResult.response;
  }

  const data = validationResult.data;

  const arrayParametersKeys = Object.keys(data)
    .filter((key) => Array.isArray(data[key as keyof typeof data]))
    .map((key) => key);

  const filteredInputParams = { ...data };

  arrayParametersKeys.forEach((key) => {
    delete filteredInputParams[key as keyof typeof data];
  });

  const whereClause: WhereOptions<any> = {
    product_id: data.productId,
    input_parameters: filteredInputParams,
  };

  if (arrayParametersKeys.length > 0) {
    whereClause[Op.and as any] = arrayParametersKeys.flatMap((key) => {
      const arrayValues = data[key as keyof typeof data] as string[];
      return arrayValues.map((value: string) =>
        Sequelize.literal(
          `JSON_CONTAINS(JSON_EXTRACT(input_parameters, '$.${key}'), '"${value}"')`
        )
      );
    });
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
