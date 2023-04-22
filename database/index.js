/** Import environment variables to connect database */
import { DB } from '../config/environment';

/** Import sequelize class */
import Sequelize from 'sequelize';

/** Create a Sequelize instance to connect to the database, passing the connection parameters:
 * - Name
 * - User
 * - Password
 * - Host
 * - Dialect (In this case Postgres)
 */
export default new Sequelize(DB.NAME, DB.USER, DB.PASSWORD, {
  host: DB.HOST,
  dialect: DB.DIALECT,
});
