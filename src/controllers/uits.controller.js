import {Uit} from '../models/Uit.js'

export const leerUits = async (req, res) => {
    try {
      const { activo } = req.params;
      const whereClause = activo ? { activo } : {};
  
      const uits = await Uit.findAll({
        where: whereClause,
        order: [['periodo_uit', 'DESC']],
      });
  
      res.json(uits);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  }
  

export const leerUit = async (req, res) =>{
    const { id } = req.params;
    try {
        const uit = await Uit.findOne({
            where:{
                id
            }
        })
        res.json(uit);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearUit = async (req, res) =>{
    const {periodo_uit,  moneda_uit, valor_uit, base_legal } = req.body;
    console.log( periodo_uit, moneda_uit, valor_uit, base_legal)
    try {
        const nuevaUit = await Uit.create({
            periodo_uit,  
            moneda_uit, 
            valor_uit, 
            base_legal
        })
        res.json(nuevaUit);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarUit = async (req, res) =>{
    const { id } = req.params;
    const { periodo_uit,  moneda_uit, valor_uit, base_legal , activo } = req.body;

    try{
    const uit = await Uit.findByPk(id);
    
    area.periodo_uit = periodo_uit;
    area.moneda_uit = moneda_uit;
    area.valor_uit = valor_uit;
    area.base_legal = base_legal;
    area.activo = activo;
    await uit.save(); 
    res.send('Uit actualizada');
    }
        catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarUit = async (req, res) =>{

    try {
        const { id } = req.params
        await Uit.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarUit = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const uit = await Uit.findByPk(id);
  
      if (!uit) {
        return res.status(404).json({ mensaje: 'Uit no encontrada' });
      }
  
      uit.activo = '1'; // Establecer activo en '1'
      await uit.save();
  
      res.json({ mensaje: 'Uit activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarUit = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const uit = await Uit.findByPk(id);
  
      if (!uit) {
        return res.status(404).json({ mensaje: 'Uit no encontrada' });
      }
  
      uit.activo = '0'; // Establecer activo en '0'
      await uit.save();
  
      res.json({ mensaje: 'Uit desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  