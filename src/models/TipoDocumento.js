import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';
import { Directiva } from './Directiva.js';

export const TipoDocumento = sequelize.define('tipodocumento',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_tipo_documento:{
        type: DataTypes.STRING
    },
    codigo_tramite_documentario:{
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

TipoDocumento.hasMany(Directiva,{
    foreignKey: 'id_tipo_documento',
    sourceKey: 'id'
})
