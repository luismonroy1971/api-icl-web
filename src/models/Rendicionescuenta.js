import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Rendicion = sequelize.define('rendiciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion_rendicion: {
        type: DataTypes.STRING,
    },
    periodo_rendicion: {
        type: DataTypes.INTEGER,
    },
    url_rendicion: {
        type: DataTypes.STRING,
    },
    // Campo BLOB para el PDF
    contenido_rendicion: {
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
