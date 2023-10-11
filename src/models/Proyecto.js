import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Proyecto = sequelize.define('proyectos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagen_proyecto:{
        type: DataTypes.STRING
    },
    video_proyecto:{
        type: DataTypes.STRING
    },
    titulo_proyecto:{
        type: DataTypes.STRING
    },
    descripcion_proyecto:{
        type: DataTypes.TEXT
    },
    url_proyecto:{
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