import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';

export const TipoDocumento = sequelize.define('tipodocumento',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING
    }
})

TipoDocumento.hasMany(Resolucion,{
    foreignKey: 'idtypedocument',
    sourceKey: 'id'
})

Resolucion.belongsTo(TipoDocumento, {
    foreignKey: 'idtypedocument',
    targetId: 'id'
})