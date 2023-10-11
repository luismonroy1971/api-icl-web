import { Sequelize } from 'sequelize';
import {Convenio} from '../models/Convenio.js';


export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convenio.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convenio')), 'periodo_convenio'],
      ],
      order: [[Sequelize.col('periodo_convenio'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convenio'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convenios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerConvenios = async (req, res) =>{
    try {
        const convenios = await Convenio.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convenios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarConvenios = async (req, res) => {
  const { descripcion_convenio, periodo_convenio, periodo_mes, id_departamento, id_provincia, id_distrito } = req.query;

  try {
    const whereClause = {};

    if (descripcion_convenio) {
      whereClause.descripcion_convenio = {
        [Sequelize.Op.like]: `%${descripcion_convenio}%`
      };
    }

    if (periodo_convenio) {
      whereClause.periodo_convenio = periodo_convenio;
    }

    if (periodo_mes) {
      whereClause.periodo_mes = periodo_mes;
    }

    if (id_departamento) {
      whereClause.id_departamento = id_departamento;
    }

    if (id_provincia) {
      whereClause.id_provincia = id_provincia;
    }

    if (id_distrito) {
      whereClause.id_distrito = id_distrito;
    }

    whereClause.activo = '1';
    
    const convenios = await Convenio.findAll({
      where: whereClause
    });

    res.json(convenios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
  

export const leerConvenio = async (req, res) =>{
    const { id } = req.params;
    try {
        const convenio = await Convenio.findOne({
            where:{
                id
            }
        })
        res.json(convenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearConvenio = async (req, res) =>{
    const {descripcion_convenio, url_documento_convenio, fecha_convenio, id_departamento,id_provincia, id_distrito } = req.body;
    try {
        const nuevoConvenio = await Convenio.create({
            descripcion_convenio,
            url_documento_convenio,
            fecha_convenio,
            id_departamento,
            id_provincia,
            id_distrito
        })
        res.json(nuevoConvenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvenio = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_convenio, url_documento_convenio, id_departamento, id_provincia, id_distrito, autorizado, autorizado_por, activo } = req.body;

    try{
    const convenio = await Convenio.findByPk(id);
    
    convenio.descripcion_convenio = descripcion_convenio;
    convenio.url_documento_convenio = url_documento_convenio;
    convenio.fecha_convenio = fecha_convenio;
    convenio.id_departamento = id_departamento;
    convenio.id_provincia = id_provincia;
    convenio.id_distrito = id_distrito;

    convenio.autorizado = autorizado;
    convenio.autorizado_por = autorizado_por;
    convenio.activo = activo;
    await convenio.save(); 
    res.send('Convenio actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarConvenio = async (req, res) =>{

    try {
        const { id } = req.params
        await Convenio.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrada' });
      }
  
      convenio.activo = '1'; // Establecer activo en '1'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrado' });
      }
  
      convenio.activo = '0'; // Establecer activo en '0'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };