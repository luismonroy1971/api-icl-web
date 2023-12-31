import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Area } from './Area.js';

export const Directiva = sequelize.define('directivas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    periodo_resolucion: {
        type: DataTypes.INTEGER,
    },
    numero_resolucion: {
        type: DataTypes.SMALLINT,
    },
    adicional_resolucion: {
        type: DataTypes.CHAR(1),
    },
    codigo_directiva: {
        type: DataTypes.STRING(30),
    },
    sumilla_resolucion: {
        type: DataTypes.STRING(1500),
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },
    url_documento: {
        type: DataTypes.STRING,
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
}, {
    schema: "portal_icl",
    timestamps: false
});

Directiva.beforeCreate(async (directiva, options) => {
    const area = await Area.findByPk(directiva.id_area);
    directiva.abreviacion_area = area ? area.abreviacion_area : null;
});

Directiva.beforeUpdate(async (directiva, options) => {
    if (directiva.changed('id_area')) {
        const area = await Area.findByPk(directiva.id_area);
        directiva.abreviacion_area = area ? area.abreviacion_area : null;
    }
});

function generateCodigoDirectiva(directiva) {
    return new Promise(async (resolve) => {
        // Generate codigo_directiva without spaces on the sides
        const numeroResolucion = directiva.numero_resolucion.toString().trim();
        const periodoResolucion = directiva.periodo_resolucion.toString().trim();

        // Fetch the area if not already available
        if (!directiva.abreviacion_area && directiva.id_area) {
            const area = await Area.findByPk(directiva.id_area);
            directiva.abreviacion_area = area ? area.abreviacion_area : null;
        }

        const abreviacionArea = directiva.abreviacion_area ? directiva.abreviacion_area.trim() : '';
        

        // Adjust the format as needed
        const codigoDirectiva = `${numeroResolucion}-${periodoResolucion}-${abreviacionArea}-ICL/MML`;
        resolve(codigoDirectiva);
    });
}

Directiva.beforeCreate(async (directiva, options) => {
    directiva.codigo_directiva = await generateCodigoDirectiva(directiva);
});

Directiva.beforeUpdate(async (directiva, options) => {
    if (directiva.changed('id_area')) {
        directiva.codigo_directiva = await generateCodigoDirectiva(directiva);
    }
});