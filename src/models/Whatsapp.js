import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Whatsapp = sequelize.define('whatsapp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    numero_whatsapp: {
        type: DataTypes.STRING,
    },
    label:{
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1',
    }
}, {
    schema: "portal_icl",
    timestamps: false
});

Whatsapp.beforeCreate((whatsapp, options) => {
    whatsapp.label = whatsapp.numero_whatsapp;
  });
  
  Whatsapp.beforeUpdate((whatsapp, options) => {
    // Verifica si el campo descripcion_whatsapp ha cambiado antes de actualizar el campo label.
    if (whatsapp.changed('numero_whatsapp')) {
    whatsapp.label = whatsapp.numero_whatsapp;
    }
  });