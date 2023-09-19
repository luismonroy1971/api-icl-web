import {Noticia} from '../models/Noticia.js';

export const leerNoticias = async (req, res) =>{
    try {
        const noticias = await Noticia.findAll();
        res.json(noticias);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const leerNoticia = async (req, res) =>{
    const { id } = req.params;
    try {
        const noticia = await Noticia.findOne({
            where:{
                id
            }
        })
        res.json(noticia);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearNoticia = async (req, res) =>{
    const {title, description, date, linkimage1, linkimage2, linkimage3, linkimage4, categoriaId } = req.body;
    try {
        const nuevaNoticia = await Noticia.create({
            title,
            description,
            date,
            linkimage1,
            linkimage2,
            linkimage3,
            linkimage4,
            categoriaId
        })
        res.json(nuevaNoticia);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarNoticia = async (req, res) =>{
    const { id } = req.params;
    const { title,
        description,
        date,
        linkimage1,
        linkimage2,
        linkimage3,
        linkimage4,
        categoriaId } = req.body;

    try {
    const noticia = await Noticia.findByPk(id);
    
    noticia.title = title;
    noticia.description = description;
    noticia.date = date;
    noticia.linkimage1 = linkimage1;
    noticia.linkimage2 = linkimage2;
    noticia.linkimage3 = linkimage3;
    noticia.linkimage4 = linkimage4;
    noticia.categoriaId = categoriaId;
    await noticia.save(); 
    res.send('Actualizando noticias');
    }
    catch(error){
         return res.status(500).json({ message: error.message })
    }
}

export const eliminarNoticia = async (req, res) =>{

    try {
        const { id } = req.params
        await Noticia.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}