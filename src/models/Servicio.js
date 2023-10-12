import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Servicio = sequelize.define('servicios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_servicio:{
        type: DataTypes.ENUM(['TUPA','TUSNE'])
    },
    flag_construccion:{
        type: DataTypes.CHAR(2)
    },
    flag_calculo:{
        type: DataTypes.CHAR(2)
    },
    requisitos_servicio:{
        type: DataTypes.STRING
    },
    flag_metraje:{
        type: DataTypes.CHAR(2)
    },
    metraje_inicial:{
        type: DataTypes.DECIMAL
    },
    metraje_final:{
        type: DataTypes.DECIMAL
    },
    periodo_servicio:{
        type: DataTypes.INTEGER
    },
    numero_servicio:{
        type: DataTypes.SMALLINT
    },
    sub_nivel_servicio:{
        type: DataTypes.SMALLINT
    },
    flag_seleccion:{
        type: DataTypes.CHAR(1),
        defaultValue: '0'
    },
    denominacion_servicio:{
        type: DataTypes.STRING
    },
    por_uit:{
        type: DataTypes.DECIMAL
    },
    monto_soles:{
        type: DataTypes.DECIMAL
    },
    monto_uit:{
        type: DataTypes.DECIMAL
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