import { response } from 'utils/response';
import { RequestEvent } from 'types/RequestEvent';

export const validateRate = async (event: RequestEvent) => {
  return response(200, { message: 'VALIDATE PREMIUM' });
};
