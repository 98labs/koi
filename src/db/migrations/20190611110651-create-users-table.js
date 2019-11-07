"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;

    return queryInterface.createSchema("core").then(() => {
      const tableConfig = {
        schema: "core",
        tableName: "users"
      };

      const tableProps = {
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

      return queryInterface.createTable(tableConfig, tableProps);
    });
  },

  down: (queryInterface, Sequelize) => {
    const tableConfig = {
      schema: "core",
      tableName: "users"
    };

    return queryInterface.dropTable(tableConfig).then(() => {
      return queryInterface.dropTable(tableConfig);
    });
  }
};
