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
    label:{
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

TipoDocumento.beforeCreate((tipoDocumento, options) => {
    tipoDocumento.label = tipoDocumento.descripcion_tipo_documento;
  });
  
  TipoDocumento.beforeUpdate((tipoDocumento, options) => {
    // Verifica si el campo descripcion_tipo_documento ha cambiado antes de actualizar el campo label.
    if (tipoDocumento.changed('descripcion_tipo_documento')) {
      tipoDocumento.label = tipoDocumento.descripcion_tipo_documento;
    }
  });

TipoDocumento.hasMany(Resolucion,{
    foreignKey: 'id_tipo_documento',
    sourceKey: 'id'
})

TipoDocumento.hasMany(Directiva,{
    foreignKey: 'id_tipo_documento',
    sourceKey: 'id'
})
