import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Convocatoria = sequelize.define('convocatorias',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING
    },
    type:{
        type: DataTypes.ENUM(['CAS','PRACTICAS'])
    },
    number:{
        type: DataTypes.INTEGER
    },
    period:{
        type: DataTypes.INTEGER
    },
    linkcommunication:{
        type: DataTypes.STRING
    },
    linknotification:{
        type: DataTypes.STRING
    },
    linkcurricularevaluationresult:{
        type: DataTypes.STRING
    },
    linkvirtualexamresult:{
        type: DataTypes.STRING
    },
    linkvirtualinterviewresult:{
        type: DataTypes.STRING
    },
    linkfinalscore:{
        type: DataTypes.STRING
    },
})