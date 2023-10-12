import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Funcionario = sequelize.define('funcionarios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING
    },
    position:{
        type: DataTypes.STRING
    },
    image:{
        type: DataTypes.STRING
    },
    link:{
        type: DataTypes.TEXT
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