import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Curso = sequelize.define('cursos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image:{
        type: DataTypes.STRING
    },
    video:{
        type: DataTypes.STRING
    },
    title:{
        type: DataTypes.STRING
    },
    content:{
        type: DataTypes.TEXT
    },
    link:{
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