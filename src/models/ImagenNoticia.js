import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const ImagenNoticia = sequelize.define('imagenes',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url_imagen:{
        type: DataTypes.STRING
    }, 
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})

