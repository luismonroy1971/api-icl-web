import { Sequelize } from 'sequelize';
import {Funcionario} from '../models/Funcionario.js';

export const leerFuncionarios = async (req, res) =>{
    try {
        const funcionarios = await Funcionario.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(funcionarios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarFuncionarios = async (req, res) => {
    const { name, position } = req.query;
  
    try {
      const whereClause = {};
  
      if (name) {
        whereClause.name = name;
      }
  
      if (position) {
        whereClause.position = {
          [Sequelize.Op.like]: `%${position}%`
        };
      }
  
      whereClause.activo = '1';
      
      const funcionarios = await Funcionario.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(funcionarios);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerFuncionario = async (req, res) =>{
    const { id } = req.params;
    try {
        const funcionario = await Funcionario.findOne({
            where:{
                id
            }
        })
        res.json(funcionario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearFuncionario = async (req, res) =>{
    const {name, position, image, link } = req.body;
    try {
        const nuevoFuncionario = await Funcionario.create({
          name,
          position,
          image,
          link
        })
        res.json(nuevoFuncionario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarFuncionario = async (req, res) =>{
    const { id } = req.params;
    const { name, position, image, link, autorizado, autorizado_por, activo } = req.body;

    try{
    const funcionario = await Funcionario.findByPk(id);
    
    funcionario.name = name;
    funcionario.position = position;
    funcionario.image = image;
    funcionario.link = link;
    funcionario.autorizado = autorizado;
    funcionario.autorizado_por = autorizado_por;
    funcionario.activo = activo;
    await funcionario.save(); 
    res.send('Funcionario actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarFuncionario = async (req, res) =>{

    try {
        const { id } = req.params
        await Funcionario.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '1'; // Establecer activo en '1'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '0'; // Establecer activo en '0'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
