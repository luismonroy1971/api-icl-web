import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';

export const Departamento = sequelize.define('departamentos',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    departamento:{
        type: DataTypes.STRING
    }
},{timestamps: false})

Departamento.hasMany(Convenio,{
    foreignKey: 'id_departamento',
    sourceKey: 'id'
})
