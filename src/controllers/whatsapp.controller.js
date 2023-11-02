import {Whatsapp} from '../models/Whatsapp.js';

export const leerWhatsapps = async (req, res) => {
    try {
      const { activo } = req.params;
      const whereClause = activo ? { activo } : {};
  
      const whatsapps = await Whatsapp.findAll({
        where: whereClause,
        order: [['id', 'DESC']],
      });
  
      res.json(whatsapps);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  }
  

export const leerWhatsapp = async (req, res) =>{
    const { id } = req.params;
    try {
        const whatsapp = await Whatsapp.findOne({
            where:{
                id
            }
        })
        res.json(whatsapp);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearWhatsapp = async (req, res) =>{
    const {numero_whatsapp} = req.body;
    try {
        const nuevaWhatsapp = await Whatsapp.create({
            numero_whatsapp
        })
        res.json(nuevaWhatsapp);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarWhatsapp = async (req, res) => {
    const { id } = req.params;
    const { numero_whatsapp, activo } = req.body;

    try {
        const whatsapp = await Whatsapp.findByPk(id);

        if (!whatsapp) {
            return res.status(404).json({ mensaje: 'Whatsapp no encontrado' });
        }

        whatsapp.numero_whatsapp = numero_whatsapp;
        whatsapp.activo = activo;

        await whatsapp.save();

        return res.json({ mensaje: 'Whatsapp actualizado con éxito' });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
}


export const eliminarWhatsapp = async (req, res) =>{

    try {
        const { id } = req.params
        await Whatsapp.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarWhatsapp = async (req, res) => {
    try {
      const { id } = req.params; // ID del área a activar
  
      const whatsapp = await Whatsapp.findByPk(id);
  
      if (!whatsapp) {
        return res.status(404).json({ mensaje: 'Whatsapp no encontrada' });
      }
  
      whatsapp.activo = '1'; // Establecer activo en '1'
      await whatsapp.save();
  
      res.json({ mensaje: 'Whatsapp activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  export const desactivarWhatsapp = async (req, res) => {
    try {
      const { id } = req.params; // ID del área a desactivar
  
      const whatsapp = await Whatsapp.findByPk(id);
  
      if (!whatsapp) {
        return res.status(404).json({ mensaje: 'Whatsapp no encontrado' });
      }
  
      whatsapp.activo = '0'; // Establecer activo en '0'
      await whatsapp.save();
  
      res.json({ mensaje: 'Whatsapp desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };