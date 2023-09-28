import { Sequelize } from 'sequelize';
import {Departamento} from '../models/Departamento.js';
import {Convenio} from '../models/Convenio.js'

export const leerDepartamentos = async (req, res) => {
  try {
    // Realiza una consulta que incluya los departamentos que tienen convenio asociado
    const departamentosConConvenio = await Departamento.findAll({
        include: [{
            model: Convenio,
            where: {
              id_departamento: Sequelize.col('Departamento.id') // Asocia el campo "departamento" de la tabla de convenios con el ID de la tabla de departamentos
            }
        }]
    });

    res.json(departamentosConConvenio);
} catch (error) {
    return res.status(500).json({ mensaje: error.message });
}
};
  

export const leerDepartamento = async (req, res) =>{
    const { id } = req.params;
    try {
        const departamento = await Departamento.findOne({
            where:{
                id
            }
        })
        res.json(departamento);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearDepartamento = async (req, res) =>{
    const {departamento } = req.body;
    try {
        const nuevaDepartamento = await Departamento.create({
            departamento
        })
        res.json(nuevaDepartamento);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarDepartamento = async (req, res) =>{
    const { id } = req.params;
    const { departamento } = req.body;

    try {
        const departamento = await Departamento.findByPk(id);
        departamento.departamento = departamento;
        await departamento.save(); 
        res.send('Departamento actualizado');
    }
    catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarDepartamento = async (req, res) =>{

    try {
        const { id } = req.params
        await Departamento.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}