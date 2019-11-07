import { Model, ModelAttributes } from 'sequelize';

export interface ITableConfig {
  schema: string;
  tableName: string;
}

export class BaseModel extends Model {
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // @TODO: move this to an abstract static method when Typescript supported it
  //        for now it is meant to be overriden on the child class
  public static getAttributes(): ModelAttributes {
    return {};
  }

  // @TODO: move this to an abstract static method when Typescript supported it
  //        for now it is meant to be overriden on the child class
  public static getValidationRules(): any {
    // https://validatejs.org
    return {};
  }

  // @TODO: move this to an abstract static method when Typescript supported it
  //        for now it is meant to be overriden on the child class
  public static getTableNameConfig(): ITableConfig {
    return {
      schema: '',
      tableName: '',
    };
  }

  // @TODO: move this to an abstract static method when Typescript supported it
  //        for now it is meant to be overriden on the child class
  public static initAssociations(): void {}
}
