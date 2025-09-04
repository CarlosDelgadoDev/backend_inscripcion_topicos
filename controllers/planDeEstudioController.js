// Controlador CRUD para Plan_de_estudio
const { Plan_de_estudio } = require('../models');

exports.createPlanDeEstudio = async (req, res) => {
  try {
    const plan = await Plan_de_estudio.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlanesDeEstudio = async (req, res) => {
  try {
    const planes = await Plan_de_estudio.findAll();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlanDeEstudioById = async (req, res) => {
  try {
    const plan = await Plan_de_estudio.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'No encontrado' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlanDeEstudio = async (req, res) => {
  try {
    const [updated] = await Plan_de_estudio.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const plan = await Plan_de_estudio.findByPk(req.params.id);
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlanDeEstudio = async (req, res) => {
  try {
    const deleted = await Plan_de_estudio.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Plan de estudio eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
