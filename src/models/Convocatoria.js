import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Convocatoria = sequelize.define('convocatorias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion_convocatoria: {
        type: DataTypes.STRING(300),
    },
    tipo_convocatoria: {
        type: DataTypes.ENUM(['CAS', 'PPP']),
    },
    numero_convocatoria: {
        type: DataTypes.INTEGER,
    },
    periodo_convocatoria: {
        type: DataTypes.INTEGER,
    },
    url_anexos: {
        type: DataTypes.STRING,
    },
    url_comunicacion1: {
        type: DataTypes.STRING,
    },
    url_comunicacion2: {
        type: DataTypes.STRING,
    },
    url_comunicacion3: {
        type: DataTypes.STRING,
    },
    url_aviso: {
        type: DataTypes.STRING,
    },
    url_resultado_evaluacion_curricular: {
        type: DataTypes.STRING,
    },
    url_resultado_examen: {
        type: DataTypes.STRING,
    },
    url_resultado_entrevista: {
        type: DataTypes.STRING,
    },
    url_puntaje_final: {
        type: DataTypes.STRING,
    },
    // Nuevos campos con tipo BLOB
    contenido_anexos: {
        type: DataTypes.BLOB('long'),
    },
    contenido_comunicacion1: {
        type: DataTypes.BLOB('long'),
    },
    contenido_comunicacion2: {
        type: DataTypes.BLOB('long'),
    },
    contenido_comunicacion3: {
        type: DataTypes.BLOB('long'),
    },
    contenido_aviso: {
        type: DataTypes.BLOB('long'),
    },
    contenido_resultado_evaluacion_curricular: {
        type: DataTypes.BLOB('long'),
    },
    contenido_resultado_examen: {
        type: DataTypes.BLOB('long'),
    },
    contenido_resultado_entrevista: {
        type: DataTypes.BLOB('long'),
    },
    contenido_puntaje_final: {
        type: DataTypes.BLOB('long'),
    },
    estado_convocatoria: {
        type: DataTypes.ENUM(['Cancelado', 'Cerrado', 'Desierto']),
    },
    creado_por: {
        type: DataTypes.STRING,
    },
    creado_fecha: {
        type: DataTypes.DATE,
    },
    modificado_por: {
        type: DataTypes.STRING,
    },
    modificado_fecha: {
        type: DataTypes.DATE,
    },
    autorizado: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
    },
    autorizado_por: {
        type: DataTypes.STRING,
    },
    autorizado_fecha: {
        type: DataTypes.DATE,
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1',
    }
}, { timestamps: false });
