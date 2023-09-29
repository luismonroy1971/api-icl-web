import { Sequelize } from 'sequelize';
import {Departamento} from '../models/Departamento.js';
import {Convenio} from '../models/Convenio.js'

export const leerDepartamentos = async (req, res) =>{
    try {
        const departamentos = await Departamento.findAll();
          res.json(departamentos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const departamentosConvenio = async (req, res) => {
    try {
        const countConvenios = await Convenio.count();

        if (countConvenios === 0) {
            // Manejar el caso en el que no hay convenios disponibles
            return res.status(404).json({ mensaje: 'No hay convenios disponibles.' });
        }
      
        const departamentosConConvenio = await Departamento.findAll({
            include: [
              {
                model: Convenio,
                attributes: [],
              },
            ],
            attributes: [
              'id',
              'departamento',
            ],
            where: Sequelize.literal('(SELECT COUNT(*) FROM "convenios" WHERE "convenios"."id_departamento" = "departamentos"."id") > 0'),
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