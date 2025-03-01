import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

interface ProductAttributes {
  product_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'description' | 'created_at' | 'updated_at'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare product_id: string;
  declare name: string;
  declare description: string | null;
  declare created_at: Date;
  declare updated_at: Date;

  public static initialize(sequelize: Sequelize): void {
    if (!sequelize) {
      throw new Error('Sequelize instance is required to initialize Product model');
    }
    
    Product.init(
      {
        product_id: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        tableName: 'products',
        modelName: 'Product',
        timestamps: false,
      }
    );
  }
}

export default Product;