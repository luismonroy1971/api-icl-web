import {Servicio} from '../models/Servicio.js';

export const leerServicios = async (req, res) =>{
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const leerServicio = async (req, res) =>{
    const { id } = req.params;
    try {
        const servicio = await Servicio.findOne({
            where:{
                id
            }
        })
        res.json(servicio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearServicio = async (req, res) =>{
    const {typeservicio, period,  number, level2, flagselection, denomination, percentuit, amountsoles, amountuit } = req.body;
    try {
        const nuevoServicio = await Servicio.create({
            typeservicio,
            period,
            number,
            level2,
            flagselection,
            denomination,
            percentuit, 
            amountsoles,
            amountuit
        })
        res.json(nuevoServicio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarServicio = async (req, res) =>{
    const { id } = req.params;
    const { typeservicio, period,  number, level2, flagselection, denomination, percentuit, amountsoles, amountuit } = req.body;

    try{
    const servicio = await Servicio.findByPk(id);
    
    servicio.typeservicio = typeservicio;
    servicio.period = period;
    servicio.number = number;
    servicio.level2 = level2;
    servicio.flagselection = flagselection;
    servicio.denomination = denomination;
    servicio.percentuit = percentuit;
    servicio.amountsoles = amountsoles;
    servicio.amountuit = amountuit;

    await servicio.save(); 
    res.send('Actualizando');
    }
    catch(error){
         return res.status(500).json({ message: error.message })
    }
}

export const eliminarServicio = async (req, res) =>{

    try {
        const { id } = req.params
        await Servicio.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}