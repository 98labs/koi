import { Sequelize } from 'sequelize';
import { IConfig } from '../config/config';

import * as CoreModels from './core';

export const initModels = (sequelizeConfig: IConfig) => {

  const sequelize = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.user,
    sequelizeConfig.pass,
    {
      dialect: 'postgres',
      host: sequelizeConfig.host,
      port: sequelizeConfig.dbport,
    },
  );

  // step 1: init all the models
  Object.keys(CoreModels).forEach((key) => {

    const model = CoreModels[key];
    const tableNameConfig = model.getTableNameConfig();

    const initParams = {
      ...tableNameConfig,
      sequelize,
      timestamps  : true,
      underscored : true,
    };

    model.init(
      model.getAttributes(),
      initParams,
    );

  });

  // step 2: init all the associaations
  Object.keys(CoreModels).forEach((key) => {
    const model = CoreModels[key];
    model.initAssociations();
  });
};
