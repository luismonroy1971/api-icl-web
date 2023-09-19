import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { toDefaultValue } from 'sequelize/types/utils.js';

export const Servicio = sequelize.define('servicios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    typeservicio:{
        type: DataTypes.ENUM(['TUPA','TUSNE'])
    },
    period:{
        type: DataTypes.INTEGER
    },
    number:{
        type: DataTypes.SMALLINT
    },
    level2:{
        type: DataTypes.SMALLINT
    },
    flagselection:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    denomination:{
        type: DataTypes.STRING
    },
    percentuit:{
        type: DataTypes.DECIMAL
    },
    amountsoles:{
        type: DataTypes.DECIMAL
    },
    amountuit:{
        type: DataTypes.DECIMAL
    },
})