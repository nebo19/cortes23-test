import { Sequelize } from 'sequelize-typescript';
import Product from 'database/models/Product';
import { RequestEvent } from 'types/RequestEvent';
import { response } from 'utils/response';
import Quote from 'database/models/Quote';

export const quote = async (event: RequestEvent, db: Sequelize) => {
  const data = await Quote.findAll();
  
  return response(200, { data });
};
