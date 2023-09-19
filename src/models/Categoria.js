import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Noticia } from './Noticia.js'

export const Categoria = sequelize.define('categorias',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING
    }
})

Categoria.hasMany(Noticia,{
    foreignKey: 'categoriaId',
    sourceKey: 'id'
})

Noticia.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    targetId: 'id'
})