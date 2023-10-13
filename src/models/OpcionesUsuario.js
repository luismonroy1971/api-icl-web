import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const OpcionesUsuario = sequelize.define('opcionesusuario',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},{timestamps: false})