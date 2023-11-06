import { Sequelize } from 'sequelize';
import {Norma} from '../models/NormasInstitucionales.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único

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
    const { tipo_norma, denominacion_norma, autorizado, activo } = req.query;
  
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

      if (activo) {
        whereClause.activo = activo;
      }
  
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

export const crearNorma = async (req, res) => {
    const {
        tipo_norma,
        denominacion_norma,
        flag_adjunto,
        creado_por,
        creado_fecha,
    } = req.body;

    const pdfFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaNorma = await Norma.create({
            tipo_norma,
            denominacion_norma,
            creado_por,
            creado_fecha
        });

        if (flag_adjunto === 'URL' && pdfFile) {
            const uniqueSuffix = uuidv4(); // Generar un nombre de archivo único
            const fileName = `${uniqueSuffix}-${pdfFile.originalname}`;
            const uploadPath = path.join(process.cwd(), '/documentos/normas', fileName); // Ruta de destino del archivo

            // Mueve el archivo a la carpeta de documentos/normas
            fs.renameSync(pdfFile.path, uploadPath);

            // Guarda la URL del archivo en la base de datos
            nuevaNorma.url_norma = `/documentos/normas/${fileName}`;
            nuevaNorma.contenido_norma = null; // Elimina el contenido binario
        } else if (flag_adjunto === 'BIN' && pdfFile) {
            nuevaNorma.url_norma = pdfFile.originalname; // Almacena el nombre del archivo, si es necesario
            nuevaNorma.contenido_norma = fs.readFileSync(pdfFile.path);
        }

        // Elimina el archivo temporal creado por Multer
        fs.unlinkSync(pdfFile.path);

        await nuevaNorma.save();
        return res.status(200).json(nuevaNorma);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al crear norma', error: error.message });
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

    const pdfFile = req.file; // Acceder al archivo cargado

    try {
        const norma = await Norma.findByPk(id);

        if (!norma) {
            return res.status(404).json({ mensaje: 'Norma no encontrada' });
        }

        norma.tipo_norma = tipo_norma;
        norma.denominacion_norma = denominacion_norma;
        norma.modificado_por = modificado_por;
        norma.modificado_fecha = modificado_fecha;
        norma.autorizado = '0';
        norma.autorizado_por = null;
        norma.autorizado_fecha = null;
        norma.activo = activo;

        if (flag_adjunto === 'URL' && pdfFile) {
            const uniqueSuffix = uuidv4(); // Generar un nombre de archivo único
            const fileName = `${uniqueSuffix}-${pdfFile.originalname}`;
            const uploadPath = path.join(process.cwd(), '/documentos/normas', fileName); // Ruta de destino del archivo

            // Mueve el archivo a la carpeta de documentos/normas
            fs.renameSync(pdfFile.path, uploadPath);

            // Guarda la URL del archivo en la base de datos
            norma.url_norma = `/documentos/normas/${fileName}`;
            norma.contenido_norma = null; // Elimina el contenido binario
        } else if (flag_adjunto === 'BIN' && pdfFile) {
            norma.url_norma = null; // Establece url_norma en null
            norma.contenido_norma = fs.readFileSync(pdfFile.path); // Llena el campo contenido_norma con el archivo en binario
        }

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (pdfFile) {
            fs.unlinkSync(pdfFile.path);
        }

        await norma.save();
        return res.status(200).json({ mensaje: 'Norma actualizada con éxito' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al modificar norma', error: error.message });
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
