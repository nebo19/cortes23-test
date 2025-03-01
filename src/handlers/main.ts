import { response } from 'utils/response';
import { Sequelize } from 'sequelize-typescript';
import { quote } from '../api/quote';
import { validateRate } from 'src/api/validateRate';
import { RequestEvent } from 'types/RequestEvent';
import { Resource } from 'sst';
import Product from 'database/models/Product';
import Quote from 'database/models/Quote';

let db: Sequelize | null = null;

const connectToDatabase = async (): Promise<Sequelize> => {
  if (db) {
    return db;
  }

  db = new Sequelize({
    username: Resource.Database.username,
    password: Resource.Database.password,
    database: Resource.Database.database,
    host: Resource.Database.host,
    port: Resource.Database.port,
    dialect: 'mysql',
  });

  try {
    await db.authenticate();
    console.log('Database connection established successfully.');

    Product.initialize(db);
    Quote.initialize(db);

    return db;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const handler = async (event: RequestEvent) => {
  try {
    const sequelize = await connectToDatabase();
    
    switch (event.path) {
      case '/quote':
        return await quote(event, sequelize);
      case '/validate':
        return await validateRate(event);
      default:
        return response(404, { message: 'Route not found' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return response(500, { message: 'Internal server error' });
  }
};
