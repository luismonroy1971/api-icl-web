import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Convenio } from './Convenio.js';

export const Distrito = sequelize.define('distritos',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    distrito:{
        type: DataTypes.STRING
    },
    ubigeo:{
        type: DataTypes.STRING
    }
},{timestamps: false})

Distrito.hasMany(Convenio, {
    foreignKey: 'id_distrito',
    sourceKey: 'id',
    allowNull: true // Esto permite que id_distrito en Convenio sea nulo
});

// También, para que la relación funcione correctamente, debes definir la relación inversa en el modelo Convenio
Convenio.belongsTo(Distrito, {
    foreignKey: 'id_distrito',
    targetKey: 'id'
});