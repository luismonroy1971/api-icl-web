import { Sequelize } from 'sequelize';
import {Provincia} from '../models/Provincia.js';
import {Convenio} from '../models/Convenio.js'

export const leerProvincias = async (req, res) => {
    try {
        // Obtén el valor de id_departamento de los query params
        const id_departamento = req.query.id_departamento || null;

        // Configura la condición para el filtro
        const whereCondition = id_departamento
            ? { id_departamento: id_departamento }
            : {}; // Si no se proporciona id_departamento, se pasa un objeto vacío

        // Realiza la consulta utilizando el where
        const provincias = await Provincia.findAll({ where: whereCondition });

        res.json(provincias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
}


export const provinciasConvenio = async (req, res) => {
    try {
      const countConvenios = await Convenio.count();
  
      if (countConvenios === 0) {
        return res.status(404).json({ mensaje: 'No hay convenios disponibles.' });
      }
  
      // Obtén el id_departamento de los query parameters si está presente
      const id_departamento = req.query.id_departamento || null;
  
      // Construye la condición de búsqueda basada en si id_departamento está presente o no
      const whereCondition = id_departamento
        ? `"convenios"."id_departamento" = '${id_departamento}'`
        : '1=1'; // Si no se proporciona id_departamento, esta condición siempre es verdadera
  
      const provinciasConConvenio = await Provincia.findAll({
        include: [
          {
            model: Convenio,
            attributes: [],
            where: Sequelize.literal(whereCondition),
          },
        ],
        attributes: ['id', 'provincia'],
      });
  
      res.json(provinciasConConvenio);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerProvincia = async (req, res) =>{
    const { id } = req.params;
    try {
        const provincia = await Provincia.findOne({
            where:{
                id
            }
        })
        res.json(provincia);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearProvincia = async (req, res) =>{
    const {provincia, id_departamento } = req.body;
    try {
        const nuevaProvincia = await Provincia.create({
            provincia,
            id_departamento
        })
        res.json(nuevaProvincia);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarProvincia = async (req, res) =>{
    const { id } = req.params;
    const { provincia } = req.body;

    try {
        const provincia = await Provincia.findByPk(id);
        provincia.provincia = provincia;
        await provincia.save(); 
        res.send('Provincia actualizada');
    }
    catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarProvincia = async (req, res) =>{

    try {
        const { id } = req.params
        await Provincia.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}