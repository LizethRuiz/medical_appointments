/** Import dotenv package to charge environment variables from .env file */
import dotenv from 'dotenv';
dotenv.config();
/** Create object where each property take an environment value from process.env:
 * - PORT: Server port
 * - DB: Connection parameters for database instance
 * - JWT: Parameters to perform and verify JWT
 */

/** We have constants values to dialect and time zone */
const DEFAULT_DB_DIALECT = 'postgres';
const DEFAULT_TIME_ZONE = 'America/Mazatlan';

module.exports = {
  PORT: process.env.PORT,
  DB: {
    HOST: process.env.DB_HOST,
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT,
    DIALECT: process.env.ENV || DEFAULT_DB_DIALECT,
  },
  SELF_HOST: process.env.SELF_HOST,
  JWT: {
    SEED: process.env.SEED,
    EXPIRES_TOKEN: process.env.EXPIRES_TOKEN,
  },
  TIME_ZONE: process.env.TZ || DEFAULT_TIME_ZONE,
};
