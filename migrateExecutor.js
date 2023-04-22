import db from './database';

import Sequelize from 'sequelize';
import path from 'path';
import Umzug from 'umzug';

const migrationsConfig = {
  migrations: {
    params: [db.getQueryInterface(), Sequelize],
    path: path.join(__dirname, 'database/migrations'), // Path to folder containing migrations
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: db,
    // modelName: 'SequelizeMeta' // No need to specify, because this is default behaviour
  },
};

const migrator = new Umzug(migrationsConfig);

(async () => {
  // checks migrations and run them if they are not already applied
  try {
    await migrator.up();
    console.log('All migrations performed successfully');
  } catch (error) {
    console.log(error);
    console.log('Migrations executed with errors... check this!');
  }
})();
