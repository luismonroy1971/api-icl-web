import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Area } from './Area.js';

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
    codigo_resolucion: {
        type: DataTypes.STRING
    },
    sumilla_resolucion:{
        type: DataTypes.STRING(1500)
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },
    url_documento:{
        type: DataTypes.STRING
    },
    // Campos para almacenar PDF en formato binario
    contenido_documento: {
        type: DataTypes.BLOB('long'),
    },
    id_area: {
        type: DataTypes.SMALLINT,
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
},{
    schema: "portal_icl",
    timestamps: false
})

Resolucion.beforeCreate(async (resolucion, options) => {
    const area = await Area.findByPk(resolucion.id_area);
    resolucion.abreviacion_area = area ? area.abreviacion_area : null;
});

Resolucion.beforeUpdate(async (resolucion, options) => {
    if (resolucion.changed('id_area')) {
        const area = await Area.findByPk(resolucion.id_area);
        resolucion.abreviacion_area = area ? area.abreviacion_area : null;
    }
});

function generateCodigoResolucion(resolucion) {
    return new Promise(async (resolve) => {
        // Generate codigo_resolucion without spaces on the sides
        const numeroResolucion = resolucion.numero_resolucion.toString().trim();
        const periodoResolucion = resolucion.periodo_resolucion.toString().trim();
        // Fetch the area if not already available
        if (!resolucion.abreviacion_area && resolucion.id_area) {
            const area = await Area.findByPk(resolucion.id_area);
            resolucion.abreviacion_area = area ? area.abreviacion_area : null;
        }
        const abreviacionArea = resolucion.abreviacion_area ? resolucion.abreviacion_area.trim() : '';
        // Adjust the format as needed
        const codigoResolucion = `${numeroResolucion}-${periodoResolucion}-${abreviacionArea}-ICL/MML`;
        resolve(codigoResolucion);
    });
}

Resolucion.beforeCreate(async (resolucion, options) => {
    resolucion.codigo_resolucion = await generateCodigoResolucion(resolucion);
});

Resolucion.beforeUpdate(async (resolucion, options) => {
    if (resolucion.changed('id_area')) {
        resolucion.codigo_resolucion = await generateCodigoResolucion(resolucion);
    }
});