// Controlador CRUD para Materia
const { Materia } = require('../models');

exports.createMateria = async (req, res) => {
  try {
    const materia = await Materia.create(req.body);
    res.status(201).json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ error: 'No encontrado' });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMateria = async (req, res) => {
  try {
    const [updated] = await Materia.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const materia = await Materia.findByPk(req.params.id);
    res.json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMateria = async (req, res) => {
  try {
    const deleted = await Materia.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
