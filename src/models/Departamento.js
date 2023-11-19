import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';
import { Provincia } from './Provincia.js';
import { Distrito } from './Distrito.js';

export const Departamento = sequelize.define('departamentos',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    departamento:{
        type: DataTypes.STRING
    },
    label:{
        type: DataTypes.STRING
    }
},{
    schema: "portal_icl",
    timestamps: false
})

Departamento.beforeCreate((departamento, options) => {
    departamento.label = departamento.departamento;
  });
  
  Departamento.beforeUpdate((departamento, options) => {
    // Verifica si el campo departamento ha cambiado antes de actualizar el campo label.
    if (departamento.changed('departamento')) {
      departamento.label = departamento.departamento;
    }
  });

Departamento.hasMany(Convenio, {
    foreignKey: 'id_departamento',
    required: true,
    order: [['id', 'ASC']]
});

Departamento.hasMany(Provincia, {
    foreignKey: 'id_departamento',
    required: true,
    order: [['id', 'ASC']]
});

Departamento.hasMany(Distrito, {
    foreignKey: 'id_departamento',
    required: true,
    order: [['id', 'ASC']]
});
