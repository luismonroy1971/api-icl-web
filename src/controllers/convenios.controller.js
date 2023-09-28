import { Sequelize } from 'sequelize';
import {Convenio} from '../models/Convenio.js';

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
    const { descripcion_convenio, periodo_convenio, numero_convenio } = req.query;
  
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
  
      if (numero_convenio) {
        whereClause.numero_convenio = numero_convenio;
      }
  
      const convenios = await Convenio.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
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
    const {descripcion_convenio, url_documento_convenio, periodo_convenio, numero_convenio, id_departamento,id_provincia, id_distrito } = req.body;
    try {
        const nuevoConvenio = await Convenio.create({
            descripcion_convenio,
            url_documento_convenio,
            periodo_convenio,
            numero_convenio,
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
    const { descripcion_convenio, url_documento_convenio, periodo_convenio, numero_convenio, id_departamento, id_provincia, id_distrito, autorizado, autorizado_por, activo } = req.body;

    try{
    const convenio = await Convenio.findByPk(id);
    
    convenio.descripcion_convenio = descripcion_convenio;
    convenio.url_documento_convenio = url_documento_convenio;
    convenio.periodo_convenio = periodo_convenio;
    convenio.numero_convenio = numero_convenio;
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
  
      const area = await Convenio.findByPk(id);
  
      if (!area) {
        return res.status(404).json({ mensaje: 'Convenio no encontrada' });
      }
  
      area.activo = '1'; // Establecer activo en '1'
      await area.save();
  
      res.json({ mensaje: 'Convenio activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const area = await Convenio.findByPk(id);
  
      if (!area) {
        return res.status(404).json({ mensaje: 'Convenio no encontrado' });
      }
  
      area.activo = '0'; // Establecer activo en '0'
      await area.save();
  
      res.json({ mensaje: 'Convenio desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };