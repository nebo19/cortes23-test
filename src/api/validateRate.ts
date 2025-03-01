import Rate from 'database/models/Rate';
import { response } from 'utils/response';
import { parseData } from 'utils/parseData';
import { z } from 'zod';

const schema = z
  .object({
    rateClass: z.string(),
    coveragePeriod: z.union([
      z.literal('term10'),
      z.literal('term15'),
      z.literal('term20'),
      z.literal('term30'),
      z.literal('2BP-30EP'),
      z.literal('2BP-90EP'),
      z.literal('2BP-180EP'),
      z.literal('5BP-90EP'),
      z.literal('5BP-180EP'),
    ]),
    selectedPremium: z.number(),
  })
  .strict();

export const validateRate = async (payload: string) => {
  const validationResult = parseData(schema, payload);

  if (validationResult.success === false) {
    return validationResult.response;
  }

  const data = validationResult.data;

  const rate = await Rate.findOne({
    where: {
      rate_class: data.rateClass,
      [`rate_options.${data.coveragePeriod}`]: data.selectedPremium,
    },
  });

  if (!rate) {
    return response(400, { message: 'Rate not valid' });
  }

  return response(200, { message: 'Success' });
};
