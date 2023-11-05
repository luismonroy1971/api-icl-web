import { Sequelize } from 'sequelize';
import {Distrito} from '../models/Distrito.js';
import {Convenio} from '../models/Convenio.js'

export const leerDistritos = async (req, res) => {
    try {
        // Obtén los valores de id_departamento e id_provincia de los query params
        const { id_departamento, id_provincia } = req.query;

        // Configura la condición para el filtro
        const whereCondition = {};

        if (id_departamento) {
            whereCondition.id_departamento = id_departamento;
        }

        if (id_provincia) {
            whereCondition.id_provincia = id_provincia;
        }

        // Realiza la consulta utilizando el where
        const distritos = await Distrito.findAll({ where: whereCondition });

        res.json(distritos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
}


export const distritosConvenio = async (req, res) => {
    try {
      const countConvenios = await Convenio.count();
  
      if (countConvenios === 0) {
        return res.status(404).json({ mensaje: 'No hay convenios disponibles.' });
      }
  
      // Obtén el id_departamento y el id_provincia de los query parameters si están presentes
      const id_departamento = req.query.id_departamento || null;
      const id_provincia = req.query.id_provincia || null;
  
      // Inicializa la condición de búsqueda como una cadena vacía
      let whereCondition = '';
  
      // Agrega la condición de id_departamento si está presente
      if (id_departamento) {
        whereCondition += `"convenios"."id_departamento" = '${id_departamento}'`;
      }
  
      // Agrega la condición de id_provincia si está presente
      if (id_provincia) {
        if (whereCondition) {
          // Si ya hay una condición, agrega un operador lógico 'AND'
          whereCondition += ' AND ';
        }
        whereCondition += `"convenios"."id_provincia" = '${id_provincia}'`;
      }
  
      const distritosConConvenio = await Distrito.findAll({
        include: [
          {
            model: Convenio,
            attributes: [],
            where: Sequelize.literal(whereCondition),
          },
        ],
        attributes: ['id', 'distrito'],
      });
  
      res.json(distritosConConvenio);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };

export const leerDistrito = async (req, res) =>{
    const { id } = req.params;
    try {
        const distrito = await Distrito.findOne({
            where:{
                id
            }
        })
        res.json(distrito);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearDistrito = async (req, res) =>{
    const {distrito, id_departamento, id_provincia } = req.body;
    try {
        const nuevaDistrito = await Distrito.create({
            distrito,
            id_provincia,
            id_departamento
        })
        res.json(nuevaDistrito);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarDistrito = async (req, res) =>{
    const { id } = req.params;
    const { id_provincia, distrito,  } = req.body;

    try {
        const distrito = await Distrito.findByPk(id);
        distrito.distrito = distrito;
        await distrito.save(); 
        res.send('Distrito actualizado');
    }
    catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarDistrito = async (req, res) =>{

    try {
        const { id } = req.params
        await Distrito.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}