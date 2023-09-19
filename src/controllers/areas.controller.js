import {Area} from '../models/Area.js';

export const leerAreas = async (req, res) =>{
    try {
        const areas = await Area.findAll();
        res.json(areas);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const leerArea = async (req, res) =>{
    const { id } = req.params;
    try {
        const area = await Area.findOne({
            where:{
                id
            }
        })
        res.json(area);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearArea = async (req, res) =>{
    const {description, abreviation } = req.body;
    try {
        const nuevaArea = await Area.create({
            description,
            abreviation
        })
        res.json(nuevaArea);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarArea = async (req, res) =>{
    const { id } = req.params;
    const { description, abreviation } = req.body;

    try{
    const area = await Area.findByPk(id);
    
    area.description = description;
    area.abreviation = abreviation;
    await area.save(); 
    res.send('Actualizando');
    }
        catch(error){
        return res.status(500).json({ message: error.message })
    }
}

export const eliminarArea = async (req, res) =>{

    try {
        const { id } = req.params
        await Area.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}