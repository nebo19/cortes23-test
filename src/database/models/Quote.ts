import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

interface BaseQuoteParams {
  productId: string;
  state: string;
  sex: string;
  dateOfBirth: string;
  amount: number;
  benefitType: string;
  mode: string;
  riders: string[];
}

interface TermLifeParams extends BaseQuoteParams {}

interface DisabilityParams extends BaseQuoteParams {
  annualIncome: number;
  smoker: boolean;
  eliminationPeriod: string;
}

type InputParameters = TermLifeParams | DisabilityParams;

interface QuoteAttributes {
  quote_id: string;
  product_id: string;
  input_parameters: InputParameters;
  created_at: Date;
  updated_at: Date;
}

interface QuoteCreationAttributes
  extends Optional<QuoteAttributes, 'quote_id' | 'created_at' | 'updated_at'> {}

class Quote
  extends Model<QuoteAttributes, QuoteCreationAttributes>
  implements QuoteAttributes
{
  declare quote_id: string;
  declare product_id: string;
  declare input_parameters: InputParameters;
  declare created_at: Date;
  declare updated_at: Date;

  public static initialize(sequelize: Sequelize): void {
    if (!sequelize) {
      throw new Error(
        'Sequelize instance is required to initialize Quote model'
      );
    }

    Quote.init(
      {
        quote_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          references: {
            model: 'products',
            key: 'product_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        input_parameters: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'quotes',
        modelName: 'Quote',
        timestamps: false,
      }
    );
  }

  public static associate(models: any): void {
    Quote.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });

    Quote.hasMany(models.Rate, {
      foreignKey: 'quote_id',
      as: 'rates',
    });
  }
}

export default Quote;
