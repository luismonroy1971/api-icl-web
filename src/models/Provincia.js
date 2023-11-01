import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';
import { Distrito } from './Distrito.js';

export const Provincia = sequelize.define('provincias',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    provincia:{
        type: DataTypes.STRING
    },
    label:{
        type: DataTypes.STRING
    }
},{timestamps: false})

Provincia.beforeCreate((provincia, options) => {
    provincia.label = provincia.provincia;
  });
  
  Provincia.beforeUpdate((provincia, options) => {
    // Verifica si el campo provincia ha cambiado antes de actualizar el campo label.
    if (provincia.changed('provincia')) {
      provincia.label = provincia.provincia;
    }
  });

Provincia.hasMany(Convenio, {
    foreignKey: 'id_provincia',
    sourceKey: 'id',
    allowNull: true // Esto permite que id_provincia en Convenio sea nulo
});

// Define la relación Provincia -> Distrito
Provincia.hasMany(Distrito, {
    foreignKey: 'id_provincia',
    sourceKey: 'id',
    order: [['id', 'ASC']]
});
