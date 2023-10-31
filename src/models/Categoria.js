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
    label:{
        type: DataTypes.STRING
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})

Categoria.beforeCreate((categoria, options) => {
    categoria.label = categoria.descripcion_categoria;
  });
  
  Categoria.beforeUpdate((categoria, options) => {
    // Verifica si el campo descripcion_categoria ha cambiado antes de actualizar el campo label.
    if (categoria.changed('descripcion_categoria')) {
      categoria.label = categoria.descripcion_categoria;
    }
  });
  

Categoria.hasMany(Noticia,{
    foreignKey: 'id_categoria_noticia',
    sourceKey: 'id'
})

Categoria.hasMany(Video,{
    foreignKey: 'id_categoria_video',
    sourceKey: 'id'
})
