import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Video = sequelize.define('videos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo_video:{
        type: DataTypes.STRING
    },
    descripcion_video:{
        type: DataTypes.STRING(500)
    },
    fecha_video:{
        type: DataTypes.STRING
    },
    url_imagen_video:{
        type: DataTypes.STRING
    },
    url_video:{
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