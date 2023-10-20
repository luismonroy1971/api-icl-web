import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';
import fs from 'fs';
import multer from 'multer';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convocatoria.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convocatoria')), 'periodo_convocatoria'],
      ],
      order: [[Sequelize.col('periodo_convocatoria'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convocatoria'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convocatorias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const buscarConvocatorias = async (req, res) => {
    const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria, id_area, autorizado } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_convocatoria) {
        whereClause.tipo_convocatoria = tipo_convocatoria;
      }
      
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (id_area) {
        whereClause.id_area = id_area;
      }
  
      if (numero_convocatoria) {
        whereClause.numero_convocatoria = numero_convocatoria;
      }
  
      if (periodo_convocatoria) {
        whereClause.periodo_convocatoria = periodo_convocatoria;
      }
  
      if (estado_convocatoria) {
        whereClause.estado_convocatoria = estado_convocatoria;
      }
  
      if (descripcion_convocatoria) {
        whereClause.descripcion_convocatoria = {
          [Sequelize.Op.like]: `%${descripcion_convocatoria}%`
        };
      }

      whereClause.activo = '1';
  
      const convocatorias = await Convocatoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_convocatoria', 'ASC'],
          ['numero_convocatoria', 'ASC']
        ]
      });
  
      res.json(convocatorias);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  



export const leerConvocatorias = async (req, res) =>{
    try {
        const convocatorias = await Convocatoria.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convocatorias);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const activarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '1'; // Establecer activo en '1'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '0'; // Establecer activo en '0'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };


export const leerConvocatoria = async (req, res) =>{
    const { id } = req.params;
    try {
        const convocatoria = await Convocatoria.findOne({
            where:{
                id
            }
        })
        res.json(convocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}



export const crearConvocatoria = async (req, res) => {
    const {
        descripcion_convocatoria,
        id_area,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        creado_por,
        creado_fecha,
        // Campos de archivos
        anexos,
        comunicacion1,
        comunicacion2,
        comunicacion3,
        aviso,
        evaluacioncurricular,
        resultado_examen,
        resultado_entrevista,
        puntaje_final,
        // Campos de archivos
        anexosFile,
        comunicacion1File,
        comunicacion2File,
        comunicacion3File,
        avisoFile,
        resultado_evaluacion_curricularFile,
        resultado_examenFile,
        resultado_entrevistaFile,
        puntaje_finalFile
    } = req.body;

    try {
        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria,
            id_area,
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria,
            anexos,
            comunicacion1,
            comunicacion2,
            comunicacion3,
            aviso,
            evaluacioncurricular,
            resultado_examen,
            resultado_entrevista,
            puntaje_final,
            estado_convocatoria,
            creado_por,
            creado_fecha,
            // Campos BLOB
            contenido_anexos: fs.readFileSync(anexosFile.path),
            contenido_comunicacion1: fs.readFileSync(comunicacion1File.path),
            contenido_comunicacion2: fs.readFileSync(comunicacion2File.path),
            contenido_comunicacion3: fs.readFileSync(comunicacion3File.path),
            contenido_aviso: fs.readFileSync(avisoFile.path),
            contenido_resultado_evaluacion_curricular: fs.readFileSync(resultado_evaluacion_curricularFile.path),
            contenido_resultado_examen: fs.readFileSync(resultado_examenFile.path),
            contenido_resultado_entrevista: fs.readFileSync(resultado_entrevistaFile.path),
            contenido_puntaje_final: fs.readFileSync(puntaje_finalFile.path)
        });

        // Elimina los archivos temporales creados por Multer
        fs.unlinkSync(anexosFile.path);
        fs.unlinkSync(comunicacion1File.path);
        fs.unlinkSync(comunicacion2File.path);
        fs.unlinkSync(comunicacion3File.path);
        fs.unlinkSync(avisoFile.path);
        fs.unlinkSync(resultado_evaluacion_curricularFile.path);
        fs.unlinkSync(resultado_examenFile.path);
        fs.unlinkSync(resultado_entrevistaFile.path);
        fs.unlinkSync(puntaje_finalFile.path);

        res.json(nuevaConvocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const actualizarConvocatoria = async (req, res) => {
    const { id } = req.params;
    const {
        descripcion_convocatoria,
        id_area,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        modificado_por,
        modificado_fecha,
        activo,
        anexos,
        comunicacion1,
        comunicacion2,
        comunicacion3,
        aviso,
        evaluacioncurricular,
        resultado_examen,
        resultado_entrevista,
        puntaje_final,
        // Campos de archivos
        anexosFile,
        comunicacion1File,
        comunicacion2File,
        comunicacion3File,
        avisoFile,
        resultado_evaluacion_curricularFile,
        resultado_examenFile,
        resultado_entrevistaFile,
        puntaje_finalFile
    } = req.body;

    try {
        const convocatoria = await Convocatoria.findByPk(id);

        if (!convocatoria) {
            return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
        }

        convocatoria.descripcion_convocatoria = descripcion_convocatoria;
        convocatoria.id_area = id_area;
        convocatoria.tipo_convocatoria = tipo_convocatoria;
        convocatoria.numero_convocatoria = numero_convocatoria;
        convocatoria.periodo_convocatoria = periodo_convocatoria;
        convocatoria.estado_convocatoria = estado_convocatoria;
        convocatoria.modificado_por = modificado_por;
        convocatoria.modificado_fecha = modificado_fecha;
      convocatoria.activo = activo;
        convocatoria.anexos = anexos;
        convocatoria.comunicacion1 = comunicacion1 ;
        convocatoria.comunicacion2 = comunicacion2;
        convocatoria.comunicacion3 = comunicacion3 ;
        convocatoria.aviso = aviso;
        convocatoria.evaluacioncurricular = evaluacioncurricular;
        convocatoria.resultado_examen = resultado_examen;
        convocatoria.resultado_entrevista = resultado_entrevista;
        convocatoria.puntaje_final = puntaje_final;

        // Actualiza los campos BLOB si se proporcionan nuevos archivos
        if (anexosFile) {
            convocatoria.contenido_anexos = fs.readFileSync(anexosFile.path);
            fs.unlinkSync(anexosFile.path);
        }

        if (comunicacion1File) {
            convocatoria.contenido_comunicacion1 = fs.readFileSync(comunicacion1File.path);
            fs.unlinkSync(comunicacion1File.path);
        }

        if (comunicacion2File) {
              convocatoria.contenido_comunicacion2 = fs.readFileSync(comunicacion2File.path);
              fs.unlinkSync(comunicacion2File.path);
        }
        
        if (comunicacion3File) {
            convocatoria.contenido_comunicacion3 = fs.readFileSync(comunicacion3File.path);
            fs.unlinkSync(comunicacion3File.path);
        }
      
        if (avisoFile) {
            convocatoria.contenido_aviso = fs.readFileSync(avisoFile.path);
            fs.unlinkSync(avisoFile.path);
        }

        if (resultado_evaluacion_curricularFile) {
            convocatoria.contenido_resultado_evaluacion_curricular = fs.readFileSync(resultado_evaluacion_curricularFile.path);
            fs.unlinkSync(resultado_evaluacion_curricularFile.path);
         }
      
        if (resultado_examenFile) {
            convocatoria.contenido_resultado_examen = fs.readFileSync(resultado_examenFile.path);
            fs.unlinkSync(resultado_examenFile.path);
        }
      
        if (resultado_entrevistaFile) {
              convocatoria.contenido_resultado_entrevista = fs.readFileSync(resultado_entrevistaFile.path);
              fs.unlinkSync(resultado_entrevistaFile.path);
        }
        if (puntaje_finalFile) {
              convocatoria.contenido_puntaje_final = fs.readFileSync(puntaje_finalFile.path);
              fs.unlinkSync(puntaje_finalFile.path);
        }

        await convocatoria.save();
        res.send('Convocatoria actualizada');
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const autorizarConvocatoria = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {

      const convocatoria = await Convocatoria.findByPk(id);
      
      convocatoria.autorizado = autorizado;
      convocatoria.autorizado_por = autorizado_por;
      convocatoria.autorizado_fecha = autorizado_fecha;
      await convocatoria.save(); 
      
      res.send('Convocatoria autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarConvocatoria = async (req, res) =>{

    try {
        const { id } = req.params
        await Convocatoria.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}

