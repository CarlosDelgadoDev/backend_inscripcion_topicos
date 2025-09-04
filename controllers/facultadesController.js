// Controlador CRUD para Facultad
const { Facultad } = require('../models');

// Crear facultad
exports.createFacultad = async (req, res) => {
  try {
    const facultad = await Facultad.create(req.body);
    res.status(201).json(facultad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las facultades
exports.getFacultades = async (req, res) => {
  try {
    const facultades = await Facultad.findAll();
    res.json(facultades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener facultad por ID
exports.getFacultadById = async (req, res) => {
  try {
    const facultad = await Facultad.findByPk(req.params.id);
    if (!facultad) return res.status(404).json({ error: 'No encontrado' });
    res.json(facultad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar facultad
exports.updateFacultad = async (req, res) => {
  try {
    const [updated] = await Facultad.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const facultad = await Facultad.findByPk(req.params.id);
    res.json(facultad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar facultad
exports.deleteFacultad = async (req, res) => {
  try {
    const deleted = await Facultad.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Facultad eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
