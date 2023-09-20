import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Noticia = sequelize.define('noticias',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo_noticia:{
        type: DataTypes.STRING
    },
    descripcion_noticia:{
        type: DataTypes.STRING
    },
    fecha_noticia:{
        type: DataTypes.STRING
    },
    url_imagen1_noticia:{
        type: DataTypes.STRING
    },
    url_imagen2_noticia:{
        type: DataTypes.STRING
    },
    url_imagen3_noticia:{
        type: DataTypes.STRING
    },
    url_imagen4_noticia:{
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

