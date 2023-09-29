import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';

export const Provincia = sequelize.define('provincias',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    provincia:{
        type: DataTypes.STRING
    }
},{timestamps: false})

Provincia.hasMany(Convenio,{
    foreignKey: 'id_provincia',
    sourceKey: 'id'
})
