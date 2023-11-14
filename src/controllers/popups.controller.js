import fs from 'fs';
import { Popup } from '../models/Popup.js';

const baseUrl = process.env.BASE_URL; // Obtener la variable de entorno BASE_URL

export const crearPopup = async (req, res) => {
  console.log('Solicitud recibida:', req);
  const {
    descripcion_popup,
    fecha_inicial,
    fecha_final,
    flag_adjunto,
    creado_por,
    creado_fecha,
  } = req.body;

  const imgFile = req.file; // Acceder al archivo cargado

  try {
    let nuevoPopup = {
      fecha_inicial,
      fecha_final,
      descripcion_popup,
      creado_por,
      creado_fecha,
    };

    if (flag_adjunto === 'URL' && imgFile) {
      // Guardar la URL del archivo en el registro
      nuevoPopup.url_popup = `${baseUrl}/documentos/popups/${imgFile.filename}`;
    } else if (flag_adjunto === 'BIN' && imgFile) {
      // Si es BIN, guarda el contenido del archivo
      nuevoPopup.contenido_popup = fs.readFileSync(imgFile.path);
    }

    nuevoPopup = await Popup.create(nuevoPopup);
    res.json({ mensaje: 'Popup creado correctamente', nuevoPopup });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarPopup = async (req, res) => {
  const { id } = req.params;
  const {
    fecha_inicial,
    fecha_final,
    descripcion_popup,
    modificado_por,
    modificado_fecha,
    activo,
    flag_adjunto,
  } = req.body;

  const imgFile = req.file; // Acceder al archivo cargado

  try {
    const popup = await Popup.findByPk(id);

    if (!popup) {
      return res.status(404).json({ mensaje: 'Popup no encontrado' });
    }

    popup.fecha_inicial = fecha_inicial;
    popup.fecha_final = fecha_final;
    popup.descripcion_popup = descripcion_popup;
    popup.modificado_por = modificado_por;
    popup.modificado_fecha = modificado_fecha;
    popup.autorizado = '0';
    popup.autorizado_por = null;
    popup.autorizado_fecha = null;
    popup.activo = activo;

    if (flag_adjunto === 'URL' && imgFile) {
      // Guardar la URL del archivo en el registro
      popup.url_popup = `${baseUrl}/documentos/popups/${imgFile.filename}`;
      popup.contenido_popup = null; // Elimina el contenido binario
    } else if (flag_adjunto === 'BIN' && imgFile) {
      // Almacena el nombre del archivo, si es necesario
      popup.url_popup = imgFile.originalname;
      popup.contenido_popup = fs.readFileSync(imgFile.path);
    }

    // Actualizar el campo BLOB si se proporciona un nuevo archivo
    if (imgFile) {
      fs.unlinkSync(imgFile.path);
    }

    await popup.save();
    res.json({ mensaje: 'Popup actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const buscarPopups = async (req, res) => {
  const { descripcion_popup, autorizado, activo, fechaActual } = req.query;

  try {
    const whereClause = {};

    if (autorizado) {
      whereClause.autorizado = autorizado;
    }

    if (descripcion_popup) {
      whereClause.descripcion_popup = {
        [Sequelize.Op.like]: `%${descripcion_popup}%`
      };
    }

    if (activo) {
      whereClause.activo = activo;
    }

    if (fechaActual) {
      // Utiliza Sequelize.Op.and para construir una condición compuesta
      whereClause[Sequelize.Op.and] = [
        {
          fecha_inicial: {
            [Sequelize.Op.lte]: fechaActual,
          },
        },
        {
          fecha_final: {
            [Sequelize.Op.gte]: fechaActual,
          },
        },
      ];
    }

    const popups = await Popup.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause,
      order: [
        ['fecha_final', 'DESC'],
      ],
    });

    res.json(popups);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const leerPopup = async (req, res) =>{
    const { id } = req.params;
    try {
        const popup = await Popup.findOne({
            where:{
                id
            }
        })
        res.json(popup);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}


export const autorizarPopup = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha} = req.body;

  try {
      const popup = await Popup.findByPk(id);
      popup.autorizado = autorizado;
      popup.autorizado_por = autorizado_por;
      popup.autorizado_fecha = autorizado_fecha;
      await popup.save(); 
      res.send('Popup autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarPopup = async (req, res) =>{

    try {
        const { id } = req.params
        await Popup.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarPopup = async (req, res) => {
  try {
    const { id } = req.params; 

    const popup = await Popup.findByPk(id);

    if (!popup) {
      return res.status(404).json({ mensaje: 'Popup no encontrado' });
    }

    popup.activo = '1'; // Establecer activo en '1'
    await popup.save();

    res.json({ mensaje: 'Popup activado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarPopup = async (req, res) => {
  try {
    const { id } = req.params; 

    const popup = await Popup.findByPk(id);

    if (!popup) {
      return res.status(404).json({ mensaje: 'Popup no encontrada' });
    }

    popup.activo = '0'; // Establecer activo en '0'
    await popup.save();

    res.json({ mensaje: 'Popup desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
