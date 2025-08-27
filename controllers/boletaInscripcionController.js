// Controlador CRUD para Boleta_Inscripcion
const { Boleta_Inscripcion } = require('../models');

exports.createBoletaInscripcion = async (req, res) => {
  try {
    const boleta = await Boleta_Inscripcion.create(req.body);
    res.status(201).json(boleta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBoletasInscripcion = async (req, res) => {
  try {
    const boletas = await Boleta_Inscripcion.findAll();
    res.json(boletas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBoletaInscripcionById = async (req, res) => {
  try {
    const boleta = await Boleta_Inscripcion.findByPk(req.params.id);
    if (!boleta) return res.status(404).json({ error: 'No encontrado' });
    res.json(boleta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBoletaInscripcion = async (req, res) => {
  try {
    const [updated] = await Boleta_Inscripcion.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const boleta = await Boleta_Inscripcion.findByPk(req.params.id);
    res.json(boleta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBoletaInscripcion = async (req, res) => {
  try {
    const deleted = await Boleta_Inscripcion.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Boleta de inscripción eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
