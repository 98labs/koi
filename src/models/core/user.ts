import {
  Model,
  DataTypes,
  BuildOptions,
  ModelAttributes,
  HasOneGetAssociationMixin,
} from 'sequelize';

import { BaseModel, ITableConfig } from '../baseModel';

export interface IUser {
  id?: number;
  name: string;
  password: string;
}

export class User extends BaseModel implements IUser {
  // =====
  // Model Properties
  // =====
  public id: number;
  public name: string;
  public password: string;

  static getAttributes(): ModelAttributes {
    return {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    };
  }

  public static getValidationRules(): any {
    // Guide for validation Rules https://validatejs.org
    return {};
  }

  static getTableNameConfig(): ITableConfig {
    return {
      schema: 'core',
      tableName: 'users',
    };
  }

  public static initAssociations(): void {
    // Define your model association here
  }
}
