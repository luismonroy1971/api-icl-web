import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Norma = sequelize.define('normasinstitucionales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo_norma: {
        type: DataTypes.ENUM(['Planes y Política', 'Instrumentos de Gestión']),
    },
    denominacion_norma: {
        type: DataTypes.STRING,
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },    
    url_norma: {
        type: DataTypes.STRING,
    },
    // Campo BLOB para el PDF
    contenido_norma: {
        type: DataTypes.BLOB('long'),
    },
    creado_por: {
        type: DataTypes.STRING,
    },
    creado_fecha: {
        type: DataTypes.DATE,
    },
    modificado_por: {
        type: DataTypes.STRING,
    },
    modificado_fecha: {
        type: DataTypes.DATE,
    },
    autorizado: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
    },
    autorizado_por: {
        type: DataTypes.STRING,
    },
    autorizado_fecha: {
        type: DataTypes.DATE,
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1',
    },
}, { timestamps: false });
