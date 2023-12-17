import app from './app.js';
import {
  sequelize
} from './database/database.js';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

async function main() {
  try {
    // Lee el puerto desde las variables de entorno o utiliza el puerto 4000 por defecto
    const port = process.env.PORT || 4000;

    await sequelize.sync({
      force: true
    });
    app.listen(port, () => {
      console.log('Servidor está levantado en el puerto', port);
    });
  } catch (error) {
    console.error('No se pudo realizar la conexión a la BD', error);
  }
}

main();