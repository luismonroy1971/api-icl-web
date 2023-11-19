import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const ImagenNoticia = sequelize.define('imagenes',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flag_adjunto:{
        type: DataTypes.ENUM(['URL', 'BIN']),
    },
    url_documento:{
        type: DataTypes.STRING
    }, 
    contenido_documento:{
        type: DataTypes.BLOB('long')
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{
    schema: "portal_icl",
    timestamps: false
})

