import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';

export const TipoDocumento = sequelize.define('tipodocumento',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_tipo_documento:{
        type: DataTypes.STRING
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})

TipoDocumento.hasMany(Resolucion,{
    foreignKey: 'id_tipo_documento',
    sourceKey: 'id'
})

Resolucion.belongsTo(TipoDocumento, {
    foreignKey: 'id_tipo_documento',
    targetId: 'id'
})