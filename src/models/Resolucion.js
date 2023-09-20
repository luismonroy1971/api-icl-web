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
    id_area:{
        type: DataTypes.INTEGER
    },
    id_tipo_documento:{
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
    url_documento_resolucion:{
        type: DataTypes.STRING
    },
    autorizado:{
        type:DataTypes.CHAR(1),
        defaultValue: '0'
    },
    autorizado_por:{
        type: DataTypes.STRING
    },  
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})