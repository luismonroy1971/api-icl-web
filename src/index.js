import app from './app.js';
import {sequelize} from './database/database.js';

async function main(){
try {
    await sequelize.sync({force : false});
    app.listen(4000);
    console.log('Servidor está levantado en el puerto', 4000);
} catch (error) {
    console.error('No se pudo realizar la conexión a la BD', error)
}
}


main();