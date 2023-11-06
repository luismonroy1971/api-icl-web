import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria, id_area, autorizado, activo } = req.query;
  
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

      if (activo) {
        whereClause.activo = activo;
      }
  
      const convocatorias = await Convocatoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_convocatoria', 'DESC'],
          ['numero_convocatoria', 'DESC']
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
     console.log('Campos en req.body:', Object.keys(req.body));
    console.log('Campos de archivos en req.files:', Object.keys(req.files));
    const {
        descripcion_convocatoria,
        id_area,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        creado_por,
        creado_fecha,
        flag_adjunto
    } = req.body;

    const {
        url_anexos,
        url_comunicacion1,
        url_comunicacion2,
        url_comunicacion3,
        url_comunicaciones,
        url_aviso,
        url_resultado_evaluacion_curricular,
        url_resultado_examen,
        url_resultado_entrevista,
        url_puntaje_final,
        contenido_anexos,
        contenido_comunicacion1,
        contenido_comunicacion2,
        contenido_comunicacion3,
        contenido_comunicaciones,
        contenido_aviso,
        contenido_resultado_evaluacion_curricular,
        contenido_resultado_examen,
        contenido_resultado_entrevista,
        contenido_puntaje_final
    } = req.files;

    let todosArchivosVacios = true;

    const generarNombreUnico = (archivo) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const nombreArchivo = archivo.originalname.replace(/\s+/g, '_');
        return `${nombreArchivo}_${uniqueSuffix}`;
    };

    // Verifica si al menos un campo tiene un archivo adjunto
    for (const key in req.files) {
        if (req.files[key]) {
            todosArchivosVacios = false; // Al menos un campo tiene un archivo
            break; // Sal del bucle ya que no es necesario seguir verificando
        }
    }

    const urls = {};

    if (flag_adjunto === 'URL' && !todosArchivosVacios) {
        const camposUrl = ['url_anexos', 'url_comunicacion1', 'url_comunicacion2', 'url_comunicacion3', 'url_comunicaciones', 'url_aviso', 'url_resultado_evaluacion_curricular', 'url_resultado_examen', 'url_resultado_entrevista', 'url_puntaje_final'];

        camposUrl.forEach((campo) => {
            if (req.files[campo]) {
                const fileName = generarNombreUnico(req.files[campo][0]);
                const ruta = path.join(process.cwd(), 'documentos', 'convocatorias', fileName);
                urls[campo] = ruta;
            }
        });
    }

    const contenidoBinario = {};

    if (flag_adjunto === 'BIN' && !todosArchivosVacios) {
        const camposBinarios = ['contenido_anexos', 'contenido_comunicacion1', 'contenido_comunicacion2', 'contenido_comunicacion3', 'contenido_comunicaciones', 'contenido_aviso', 'contenido_resultado_evaluacion_curricular', 'contenido_resultado_examen', 'contenido_resultado_entrevista', 'contenido_puntaje_final'];

        camposBinarios.forEach((campo) => {
            if (req.files[campo]) {
                contenidoBinario[campo] = fs.readFileSync(req.files[campo][0].path);
            }
        });
    }

    try {
        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria,
            id_area,
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria,
            estado_convocatoria,
            creado_por,
            creado_fecha,
            ...generateUrls(urls, flag_adjunto),
            ...generateBinaryContent(contenidoBinario, flag_adjunto)
        });

        const archivosTemporales = [
            'contenido_anexos',
            'contenido_comunicacion1',
            'contenido_comunicacion2',
            'contenido_comunicacion3',
            'contenido_comunicaciones',
            'contenido_aviso',
            'contenido_resultado_evaluacion_curricular',
            'contenido_resultado_examen',
            'contenido_resultado_entrevista',
            'contenido_puntaje_final'
        ];

        archivosTemporales.forEach((campo) => {
            if (req.files[campo] && req.files[campo].length > 0) {
                fs.unlinkSync(req.files[campo][0].path);
            }
        });

        res.status(201).json(nuevaConvocatoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error al crear la convocatoria: ${error.message}` });
    }
};

const generateUrls = (urls, flagAdjunto) => {
    const campos = [
        'url_anexos',
        'url_comunicacion1',
        'url_comunicacion2',
        'url_comunicacion3',
        'url_comunicaciones',
        'url_aviso',
        'url_resultado_evaluacion_curricular',
        'url_resultado_examen',
        'url_resultado_entrevista',
        'url_puntaje_final'
    ];

    const result = {};

    campos.forEach((campo) => {
        result[campo] = flagAdjunto === 'URL' && urls[campo] ? urls[campo] : null;
    });

    return result;
};

const generateBinaryContent = (contenidoBinario, flagAdjunto) => {
    const campos = [
        'contenido_anexos',
        'contenido_comunicacion1',
        'contenido_comunicacion2',
        'contenido_comunicacion3',
        'contenido_comunicaciones',
        'contenido_aviso',
        'contenido_resultado_evaluacion_curricular',
        'contenido_resultado_examen',
        'contenido_resultado_entrevista',
        'contenido_puntaje_final'
    ];

    const result = {};

    campos.forEach((campo) => {
        result[campo] = flagAdjunto === 'BIN' && contenidoBinario[campo] ? contenidoBinario[campo] : null;
    });

    return result;
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
        flag_adjunto
    } = req.body;

    const {
      url_anexos,
      url_comunicacion1,
      url_comunicacion2,
      url_comunicacion3,
      url_comunicaciones,
      url_aviso,
      url_resultado_evaluacion_curricular,
      url_resultado_examen,
      url_resultado_entrevista,
      url_puntaje_final,
      contenido_anexos,
      contenido_comunicacion1,
      contenido_comunicacion2,
      contenido_comunicacion3,
      contenido_comunicaciones,
      contenido_aviso,
      contenido_resultado_evaluacion_curricular,
      contenido_resultado_examen,
      contenido_resultado_entrevista,
      contenido_puntaje_final
    } = req.files;

    let todosArchivosVacios = true;

    const generarNombreUnico = (archivo) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const nombreArchivo = archivo.originalname.replace(/\s+/g, '_');
        return `${nombreArchivo}_${uniqueSuffix}`;
    };

    // Verifica si al menos un campo tiene un archivo adjunto
    for (const key in req.files) {
      if (req.files[key]) {
          todosArchivosVacios = false; // Al menos un campo tiene un archivo
          break; // Sal del bucle ya que no es necesario seguir verificando
      }
    }

    const urls = {};

    if (flag_adjunto === 'URL' && !todosArchivosVacios) {
      const camposUrl = ['url_anexos', 'url_comunicacion1', 'url_comunicacion2', 'url_comunicacion3', 'url_comunicaciones', 'url_aviso', 'url_resultado_evaluacion_curricular', 'url_resultado_examen', 'url_resultado_entrevista', 'url_puntaje_final'];

        camposUrl.forEach((campo) => {
            if (req.files[campo]) {
                const fileName = generarNombreUnico(req.files[campo][0]);
                const ruta = path.join('/', 'documentos', 'convocatorias', fileName); // Utiliza path.join para crear la ruta
                urls[campo] = ruta;
            }
        });
        
    }

    const contenidoBinario = {};

    if (flag_adjunto === 'BIN' && !todosArchivosVacios) {
      const camposBinarios = ['contenido_anexos', 'contenido_comunicacion1', 'contenido_comunicacion2', 'contenido_comunicacion3', 'contenido_comunicaciones', 'contenido_aviso', 'contenido_resultado_evaluacion_curricular', 'contenido_resultado_examen', 'contenido_resultado_entrevista', 'contenido_puntaje_final'];

        camposBinarios.forEach((campo) => {
            if (req.files[campo]) {
                contenidoBinario[campo] = fs.readFileSync(req.files[campo][0].path);
            }
        });
    }

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
        convocatoria.autorizado = '0';
        convocatoria.autorizado_por = null;
        convocatoria.autorizado_fecha = null;
        convocatoria.activo = activo;

        if (flag_adjunto === 'URL' && !todosArchivosVacios) {
            // Actualiza las URLs desde los archivos
            convocatoria.url_anexos = urls.url_anexos || null;
            convocatoria.url_comunicacion1 = urls.url_comunicacion1 || null;
            convocatoria.url_comunicacion2 = urls.url_comunicacion2 || null;
            convocatoria.url_comunicacion3 = urls.url_comunicacion3 || null;
            convocatoria.url_comunicaciones = urls.url_comunicaciones || null;
            convocatoria.url_aviso = urls.url_aviso || null;
            convocatoria.url_resultado_evaluacion_curricular = urls.url_resultado_evaluacion_curricular || null;
            convocatoria.url_resultado_examen = urls.url_resultado_examen || null;
            convocatoria.url_resultado_entrevista = urls.url_resultado_entrevista || null;
            convocatoria.url_puntaje_final = urls.url_puntaje_final || null;
        } else if (flag_adjunto === 'BIN' && !todosArchivosVacios) {
            // Actualiza el contenido binario desde los archivos
            convocatoria.contenido_anexos = contenidoBinario.contenido_anexos || null;
            convocatoria.contenido_comunicacion1 = contenidoBinario.contenido_comunicacion1 || null;
            convocatoria.contenido_comunicacion2 = contenidoBinario.contenido_comunicacion2 || null;
            convocatoria.contenido_comunicacion3 = contenidoBinario.contenido_comunicacion3 || null;
            convocatoria.contenido_comunicaciones = contenidoBinario.contenido_comunicaciones || null;
            convocatoria.contenido_aviso = contenidoBinario.contenido_aviso || null;
            convocatoria.contenido_resultado_evaluacion_curricular = contenidoBinario.contenido_resultado_evaluacion_curricular || null;
            convocatoria.contenido_resultado_examen = contenidoBinario.contenido_resultado_examen || null;
            convocatoria.contenido_resultado_entrevista = contenidoBinario.contenido_resultado_entrevista || null;
            convocatoria.contenido_puntaje_final = contenidoBinario.contenido_puntaje_final || null;
        }

        await convocatoria.save();

        // Elimina los archivos temporales creados por Multer
        const archivosTemporales = ['contenido_anexos', 'contenido_comunicacion1', 'contenido_comunicacion2', 'contenido_comunicacion3', 'contenido_comunicaciones', 'contenido_aviso', 'contenido_resultado_evaluacion_curricular', 'contenido_resultado_examen', 'contenido_resultado_entrevista', 'contenido_puntaje_final'];

        archivosTemporales.forEach((campo) => {
            if (req.files[campo] && req.files[campo].length > 0) {
                fs.unlinkSync(req.files[campo][0].path);
            }
        });

        res.json({ mensaje: 'Convocatoria actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: `Error al modificar la convocatoria: ${error.message}` });
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

