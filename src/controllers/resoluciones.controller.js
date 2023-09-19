import {Resolucion} from '../models/Resolucion.js';

export const leerResoluciones = async (req, res) =>{
    try {
        const resoluciones = await Resolucion.findAll();
        res.json(resoluciones);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const leerResolucion = async (req, res) =>{
    const { id } = req.params;
    try {
        const resolucion = await Resolucion.findOne({
            where:{
                id
            }
        })
        res.json(resolucion);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearResolucion = async (req, res) =>{
    const {period, idarea, idtypedocument,  number, aditional, sumilla, linkdocument } = req.body;
    try {
        const nuevaResolucion = await Resolucion.create({
            period,
            idarea,
            idtypedocument,
            number,
            aditional,
            sumilla,
            linkdocument
        })
        res.json(nuevaResolucion);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarResolucion = async (req, res) =>{
    const { id } = req.params;
    const { period, idarea, idtypedocument,  number, aditional, sumilla, linkdocument } = req.body;

    try {

        const resolucion = await Resolucion.findByPk(id);
        resolucion.period = period;
        resolucion.idarea = idarea;
        resolucion.idtypedocument = idtypedocument;
        resolucion.number = number;
        resolucion.aditional = aditional;
        resolucion.sumilla = sumilla;
        resolucion.linkdocument = linkdocument;
        await resolucion.save(); 
        res.send('Actualizando');
    }
    catch(error){
        return res.status(500).json({ message: error.message })
    }
}

export const eliminarResolucion = async (req, res) =>{

    try {
        const { id } = req.params
        await Resolucion.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}