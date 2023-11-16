import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Comunicacion3 = sequelize.define('comunicacion3', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },    
    url_documento: {
        type: DataTypes.STRING,
    },
    // Campo BLOB para el PDF
    contenido_documento: {
        type: DataTypes.BLOB('long'),
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1',
    }
}, { timestamps: false });

