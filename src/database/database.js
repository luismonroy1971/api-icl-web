import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});
