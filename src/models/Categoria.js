import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Noticia } from './Noticia.js'
import { Video } from './Video.js';

export const Categoria = sequelize.define('categorias',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_categoria:{
        type: DataTypes.STRING
    },  
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})

Categoria.hasMany(Noticia,{
    foreignKey: 'id_categoria_noticia',
    sourceKey: 'id'
})

Categoria.hasMany(Video,{
    foreignKey: 'id_categoria_video',
    sourceKey: 'id'
})
