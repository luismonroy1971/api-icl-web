import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';

export const Distrito = sequelize.define('distritos',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    distrito:{
        type: DataTypes.STRING
    },
    ubigeo:{
        type: DataTypes.STRING
    }
},{timestamps: false})

Distrito.hasMany(Convenio,{
    foreignKey: 'id_distrito',
    sourceKey: 'id'
})
