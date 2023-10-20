import { Sequelize } from 'sequelize';
import {Norma} from '../models/NormasInstitucionales.js';

export const leerNormas = async (req, res) =>{
    try {
        const normas = await Norma.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(normas);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarNormas = async (req, res) => {
    const { tipo_norma, denominacion_norma, autorizado } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_norma) {
        whereClause.tipo_norma = tipo_norma;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (denominacion_norma) {
        whereClause.denominacion_norma = {
          [Sequelize.Op.like]: `%${denominacion_norma}%`
        };
      }

      whereClause.activo = '1';
  
      const normas = await Norma.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(normas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerNorma = async (req, res) =>{
    const { id } = req.params;
    try {
        const norma = await Norma.findOne({
            where:{
                id
            }
        })
        res.json(norma);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

import fs from 'fs';

export const crearNorma = async (req, res) => {
    const {
        tipo_norma,
        denominacion_norma,
        url_norma,
        creado_por,
        creado_fecha,
    } = req.body;

    const normaFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaNorma = await Norma.create({
            tipo_norma,
            denominacion_norma,
            url_norma,
            creado_por,
            creado_fecha,
            contenido_norma: fs.readFileSync(normaFile.path),
        });

        // Elimina el archivo temporal creado por Multer
        fs.unlinkSync(normaFile.path);

        res.json(nuevaNorma);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const actualizarNorma = async (req, res) => {
    const { id } = req.params;
    const {
        tipo_norma,
        denominacion_norma,
        url_norma,
        modificado_por,
        modificado_fecha,
        activo,
    } = req.body;

    const normaFile = req.file; // Acceder al archivo cargado

    try {
        const norma = await Norma.findByPk(id);

        if (!norma) {
            return res.status(404).json({ mensaje: 'Norma no encontrada' });
        }

        norma.tipo_norma = tipo_norma;
        norma.denominacion_norma = denominacion_norma;
        norma.url_norma = url_norma;
        norma.modificado_por = modificado_por;
        norma.modificado_fecha = modificado_fecha;
        norma.activo = activo;

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (normaFile) {
            norma.contenido_norma = fs.readFileSync(normaFile.path);
            fs.unlinkSync(normaFile.path);
        }

        await norma.save();
        res.send('Norma actualizada');
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const autorizarNorma = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const norma = await Norma.findByPk(id);
  norma.autorizado = autorizado;
  norma.autorizado_por = autorizado_por;
  norma.autorizado_fecha = autorizado_fecha;
  await norma.save(); 
  res.send('Norma autorizada / desautorizada');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarNorma = async (req, res) =>{

    try {
        const { id } = req.params
        await Norma.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarNorma = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const norma = await Norma.findByPk(id);
  
      if (!norma) {
        return res.status(404).json({ mensaje: 'Norma no encontrada' });
      }
  
      norma.activo = '1'; // Establecer activo en '1'
      await norma.save();
  
      res.json({ mensaje: 'Norma activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarNorma = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const norma = await Norma.findByPk(id);
  
      if (!norma) {
        return res.status(404).json({ mensaje: 'Norma no encontrada' });
      }
  
      norma.activo = '0'; // Establecer activo en '0'
      await norma.save();
  
      res.json({ mensaje: 'Norma desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
