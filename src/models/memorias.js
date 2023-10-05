import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Memoria = sequelize.define('memorias',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    periodo_memoria:{
        type: DataTypes.INTEGER
    },
    descripcion_memoria:{
        type: DataTypes.STRING
    },
    url_memoria:{
        type: DataTypes.STRING
    },
    autorizado:{
        type:DataTypes.CHAR(1),
        defaultValue: '0'
    },
    autorizado_por:{
        type: DataTypes.STRING
    },  
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})