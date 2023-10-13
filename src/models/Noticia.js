import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { ImagenNoticia } from './ImagenNoticia.js';

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
        type: DataTypes.STRING(2000)
    },
    fecha_noticia:{
        type: DataTypes.STRING
    },
    url_imagen_portada:{
        type: DataTypes.STRING
    },
    creado_por:{
        type: DataTypes.STRING
    },
    creado_fecha:{
        type: DataTypes.DATE
    },
    modificado_por:{
        type: DataTypes.STRING
    },
    modificado_fecha:{
        type: DataTypes.DATE
    },
    autorizado:{
        type:DataTypes.CHAR(1),
        defaultValue: '0'
    },
    autorizado_por:{
        type: DataTypes.STRING
    },
    autorizado_fecha:{
      type: DataTypes.DATE
    },  
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})


Noticia.hasMany(ImagenNoticia,{
    foreignKey: 'id_noticia',
    sourceKey: 'id'
})
