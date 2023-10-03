import {ImagenNoticia} from '../models/ImagenNoticia.js';

export const leerImagenes = async (req, res) =>{
    try {
        const imagenes = await ImagenNoticia.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(imagenes);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerImagen = async (req, res) =>{
    const { id } = req.params;
    try {
        const imagen = await ImagenNoticia.findOne({
            where:{
                id
            }
        })
        res.json(imagen);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearImagen = async (req, res) =>{
    const {url_imagen, id_noticia } = req.body;
    console.log(url_noticia, id_noticia)
    try {
        const nuevaImagen = await ImagenNoticia.create({
            url_imagen, 
            id_noticia
        })
        res.json(nuevaImagen);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarImagen = async (req, res) =>{
    const { id } = req.params;
    const { url_imagen, id_noticia } = req.body;

    try{
    const imagen = await ImagenNoticia.findByPk(id);
    
    imagen.url_imagen = url_imagen;
    imagen.id_noticia = id_noticia;
    
    await imagen.save(); 
    res.send('Imagen actualizada');
    }
        catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarImagen = async (req, res) =>{

    try {
        const { id } = req.params
        await ImagenNoticia.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}
