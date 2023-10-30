import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Popup = sequelize.define('popup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    periodo_popup: {
        type: DataTypes.INTEGER,
    },
    descripcion_popup: {
        type: DataTypes.STRING,
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },    
    url_popup: {
        type: DataTypes.STRING,
    },
    // Campo BLOB para el PDF
    contenido_popup: {
        type: DataTypes.BLOB('long'),
    },
    fecha_inicial: {
        type: DataTypes.DATE,
    },
    fecha_final: {
        type: DataTypes.DATE,
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
    }
}, { timestamps: false });
