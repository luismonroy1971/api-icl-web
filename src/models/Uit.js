import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Uit = sequelize.define('uits',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    periodo_uit:{
        type: DataTypes.INTEGER
    },
    moneda_uit:{
        type: DataTypes.STRING
    },
    valor_uit:{
        type: DataTypes.INTEGER
    }, 
    base_legal:{
        type: DataTypes.STRING
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{
    schema: "portal_icl",
    timestamps: false
})

