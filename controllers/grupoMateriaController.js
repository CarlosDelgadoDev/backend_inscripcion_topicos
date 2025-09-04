// Controlador CRUD para Grupo_Materia
const { Grupo_Materia } = require('../models');

exports.createGrupoMateria = async (req, res) => {
  try {
    const grupo = await Grupo_Materia.create(req.body);
    res.status(201).json(grupo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGruposMateria = async (req, res) => {
  try {
    const grupos = await Grupo_Materia.findAll();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGrupoMateriaById = async (req, res) => {
  try {
    const grupo = await Grupo_Materia.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'No encontrado' });
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGrupoMateria = async (req, res) => {
  try {
    const [updated] = await Grupo_Materia.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const grupo = await Grupo_Materia.findByPk(req.params.id);
    res.json(grupo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGrupoMateria = async (req, res) => {
  try {
    const deleted = await Grupo_Materia.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Grupo materia eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
