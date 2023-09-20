import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Convocatoria = sequelize.define('convocatorias',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_convocatoria:{
        type: DataTypes.STRING
    },
    tipo_convocatoria:{
        type: DataTypes.ENUM(['CAS','PRACTICAS'])
    },
    numero_convocatoria:{
        type: DataTypes.INTEGER
    },
    periodo_convocatoria:{
        type: DataTypes.INTEGER
    },
    url_comunicacion:{
        type: DataTypes.STRING
    },
    url_aviso:{
        type: DataTypes.STRING
    },
    url_resultado_evaluacion_curricular:{
        type: DataTypes.STRING
    },
    url_resultado_examen_virtual:{
        type: DataTypes.STRING
    },
    url_resultado_entrevista_virtual:{
        type: DataTypes.STRING
    },
    url_puntaje_final:{
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