import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Rendicion = sequelize.define('rendiciones',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_rendicion:{
        type: DataTypes.STRING
    },
    periodo_rendicion:{
        type: DataTypes.INTEGER
    },
    url_rendicion:{
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
    },
},{timestamps: false})