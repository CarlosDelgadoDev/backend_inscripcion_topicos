// Controlador CRUD para Docente
const { Docente } = require('../models');

exports.createDocente = async (req, res) => {
  try {
    const docente = await Docente.create(req.body);
    res.status(201).json(docente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll();
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocenteById = async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);
    if (!docente) return res.status(404).json({ error: 'No encontrado' });
    res.json(docente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocente = async (req, res) => {
  try {
    const [updated] = await Docente.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const docente = await Docente.findByPk(req.params.id);
    res.json(docente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDocente = async (req, res) => {
  try {
    const deleted = await Docente.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Docente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
