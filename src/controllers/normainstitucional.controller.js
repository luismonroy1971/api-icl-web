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
        flag_adjunto,
        creado_por,
        creado_fecha,
    } = req.body;

    const normaFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaNorma = await Norma.create({
            tipo_norma,
            denominacion_norma,
            creado_por,
            creado_fecha
        });

        if (flag_adjunto === 'URL' && normaFile) {
            // Generar un nombre de archivo único
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${normaFile.originalname}-${uniqueSuffix}`;
            nuevaNorma.url_norma = `\\normas\\${fileName}`;
            nuevaNorma.contenido_norma = null; // Elimina el contenido binario
        } else if (flag_adjunto === 'BIN' && normaFile) {
            nuevaNorma.url_norma = normaFile.originalname; // Almacena el nombre del archivo, si es necesario
            nuevaNorma.contenido_norma = fs.readFileSync(normaFile.path);
        }

        // Elimina el archivo temporal creado por Multer
        fs.unlinkSync(normaFile.path);

        await nuevaNorma.save();
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
        flag_adjunto,
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

        if (flag_adjunto === 'URL' && normaFile) {
            // Generar un nombre de archivo único
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${normaFile.originalname}-${uniqueSuffix}`;
            norma.url_norma = `\\normas\\${fileName}`;
            norma.contenido_norma = null; // Elimina el contenido binario
        } else if (flag_adjunto === 'BIN' && normaFile) {
            norma.url_norma = null; // Establece url_norma en null
            norma.contenido_norma = fs.readFileSync(normaFile.path); // Llena el campo contenido_norma con el archivo en binario
        }

        norma.modificado_por = modificado_por;
        norma.modificado_fecha = modificado_fecha;
        norma.activo = activo;

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (normaFile) {
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
