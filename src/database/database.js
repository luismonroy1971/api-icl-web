import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const { POSTGRES_URL } = process.env;

export const sequelize = new Sequelize(POSTGRES_URL, {
  dialectOptions: {
    ssl: { rejectUnauthorized: false }, // Configuración de SSL
  },
});
