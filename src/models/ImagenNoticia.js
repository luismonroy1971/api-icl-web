import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const ImagenNoticia = sequelize.define('imagenes',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url_noticia:{
        type: DataTypes.STRING
    },
},{timestamps: false})

