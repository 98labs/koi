'use strict';
const path = require('path');
const fs = require('fs');

const dotenv = require("dotenv");
const customenv = require("custom-env");

customenv.env(true);
dotenv.config({ path: '.env' });

const env = process.env.NODE_ENV;
const jsonFilePattern = /\.[json]+$/i;

const validEnvs = [
  'testing', 
  'local', 
  'staging', 
  'production'
];

let fixturesDir = undefined;

if (validEnvs.includes(env)) {
  fixturesDir = path.resolve(
    'src', 
    'db', 
    'seeders', 
    'fixtures',
    env
  );
}

const commonDir = path.resolve(
  'src', 
  'db', 
  'seeders', 
  'fixtures',
  'common',
);

module.exports = {
  up: (queryInterface, Sequelize) => {
    const filesEnvRelated = fs.readdirSync(fixturesDir);
    const filesCommon = fs.readdirSync(commonDir);

    // ===== HACKY =====
    // Process the array of files 'synchronously' then respond with a promise
    // =================

    async function processInsertArray(array, baseDir, fn) {
      let results = [];

      for(let i=0; i<array.length; i++) {
        let xResult = await fn(array[i], baseDir);
        results.push(xResult);
      }

      return results;
    }

    async function processItem(file, baseDir) {
      if (file.match(jsonFilePattern)) {
        const filePath = path.resolve(baseDir, file);
        const fileNameSplit = file.replace('.json', '').split('.');

        const tableConfig = {
          schema: fileNameSplit[1],
          tableName: fileNameSplit[2],
        }

        const buldInsertOptions = {};
        const data = JSON.parse(fs.readFileSync(filePath));
        
        data.forEach(xRow => {
          xRow.created_at = Sequelize.fn('NOW');
          xRow.updated_at = Sequelize.fn('NOW');
        });

        const queryInsertPromise = await queryInterface.bulkInsert(
          tableConfig, 
          data, 
          buldInsertOptions
        );

        return queryInsertPromise;
      }
    }

    async function processAllFiles() {
      const results = [
        await processInsertArray(filesCommon, commonDir, processItem),
        await processInsertArray(filesEnvRelated, fixturesDir, processItem),
      ];

      return results;
    }

    return processAllFiles();
  },

  down: (queryInterface, Sequelize) => {
    const filesEnvRelated = fs.readdirSync(fixturesDir);
    const filesCommon = fs.readdirSync(commonDir);

    // ===== HACKY =====
    // Process the array of files 'synchronously' [backwards] then respond with a promise
    // =================
    
    async function processDropArray(array, baseDir, fn) {
      let results = [];

      for(let i = array.length -1; i >= 0; i--) {
        let xResult = await fn(array[i], baseDir);
        results.push(xResult);
      }

      return results;
    }
    
    async function processItem(file, baseDir) {
      
      if (file.match(jsonFilePattern)) {
        const filePath = path.resolve(baseDir, file);
        const fileNameSplit = file.replace('.json', '').split('.');

        const tableConfig = {
          schema: fileNameSplit[1],
          tableName: fileNameSplit[2],
        };

        const queryDeletePromise = await queryInterface.bulkDelete(
          tableConfig, 
          null,
          {}
        );

        return queryDeletePromise;
      }
    }

    async function processAllFiles() {
      const results = [
        await processDropArray(filesCommon, commonDir, processItem),
        await processDropArray(filesEnvRelated, fixturesDir, processItem),
      ];

      return results;
    }

    return processAllFiles();
  }
};
