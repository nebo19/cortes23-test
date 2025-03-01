import { response } from 'utils/response';
import { Sequelize } from 'sequelize-typescript';
import { quote } from 'api/quote';
import { validateRate } from 'api/validateRate';
import { RequestEvent } from 'types/RequestEvent';
import { Resource } from 'sst';
import Product from 'database/models/Product';
import Quote from 'database/models/Quote';
import Rate from 'database/models/Rate';

let db: Sequelize | null = null;

const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  try {
    db = new Sequelize({
      username: Resource.Database.username,
      password: Resource.Database.password,
      database: Resource.Database.database,
      host: Resource.Database.host,
      port: Resource.Database.port,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
      dialectOptions: { connectTimeout: 30000 },
      logging: false,
    });

    await db.authenticate();
    console.log('Database connection established successfully.');

    Product.initialize(db);
    Quote.initialize(db);
    Rate.initialize(db);

    Product.associate({ Product, Quote, Rate });
    Quote.associate({ Product, Quote, Rate });
    Rate.associate({ Product, Quote, Rate });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    db = null;
    throw error;
  }
};

export const handler = async (event: RequestEvent) => {
  try {
    await connectToDatabase();

    switch (event.path) {
      case '/quote':
        return await quote(event.body);
      case '/validate':
        return await validateRate(event.body);
      default:
        return response(404, { message: 'Route not found' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return response(500, { message: 'Internal server error' });
  }
};
