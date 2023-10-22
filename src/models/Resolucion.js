import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Resolucion = sequelize.define('resoluciones',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    periodo_resolucion:{
        type: DataTypes.INTEGER
    },
    numero_resolucion:{
        type: DataTypes.SMALLINT
    },
    adicional_resolucion:{
        type: DataTypes.CHAR(1)
    },
    sumilla_resolucion:{
        type: DataTypes.STRING(1500)
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },
    url_documento_resolucion:{
        type: DataTypes.STRING
    },
    // Campos para almacenar PDF en formato binario
    contenido_documento_resolucion: {
        type: DataTypes.BLOB('long'),
    },
    abreviacion_area: {
        type: DataTypes.CHAR(2),
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