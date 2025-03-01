import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Define types for rate options based on product types
interface TermLifeRateOptions {
  term10?: number;
  term15?: number;
  term20?: number;
  term30?: number;
  [key: string]: number | undefined;
}

interface DisabilityRateOptions {
  '2BP-30EP'?: number;
  '2BP-90EP'?: number;
  '2BP-180EP'?: number;
  '5BP-90EP'?: number;
  '5BP-180EP'?: number;
  [key: string]: number | undefined;
}

// Union type for all possible rate option types
type RateOptions = TermLifeRateOptions | DisabilityRateOptions;

interface RateAttributes {
  rate_id: string;
  quote_id: string;
  rate_class: string;
  rate_options: RateOptions;
  created_at: Date;
  updated_at: Date;
}

interface RateCreationAttributes
  extends Optional<RateAttributes, 'rate_id' | 'created_at' | 'updated_at'> {}

class Rate
  extends Model<RateAttributes, RateCreationAttributes>
  implements RateAttributes
{
  declare rate_id: string;
  declare quote_id: string;
  declare rate_class: string;
  declare rate_options: RateOptions;
  declare created_at: Date;
  declare updated_at: Date;

  public static initialize(sequelize: Sequelize): void {
    if (!sequelize) {
      throw new Error(
        'Sequelize instance is required to initialize Rate model'
      );
    }

    Rate.init(
      {
        rate_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        quote_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'quotes',
            key: 'quote_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        rate_class: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: 'Rate class (e.g., preferredPlus, standard, 4A, 4M)',
        },
        rate_options: {
          type: DataTypes.JSON,
          allowNull: false,
          comment:
            'JSON object containing rate options (e.g., term10, term15, 2BP-30EP)',
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
        tableName: 'rates',
        modelName: 'Rate',
        timestamps: false,
      }
    );
  }

  public static associate(models: any): void {
    Rate.belongsTo(models.Quote, {
      foreignKey: 'quote_id',
      as: 'quote',
    });
  }
}

export default Rate;
