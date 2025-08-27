// Controlador CRUD para Carreras
const { Carrera } = require('../models');

// Crear carrera
exports.createCarrera = async (req, res) => {
  try {
    const carrera = await Carrera.create(req.body);
    res.status(201).json(carrera);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las carreras
exports.getCarreras = async (req, res) => {
  try {
    const carreras = await Carrera.findAll();
    res.json(carreras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener carrera por ID
exports.getCarreraById = async (req, res) => {
  try {
    const carrera = await Carrera.findByPk(req.params.id);
    if (!carrera) return res.status(404).json({ error: 'No encontrado' });
    res.json(carrera);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar carrera
exports.updateCarrera = async (req, res) => {
  try {
    const [updated] = await Carrera.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const carrera = await Carrera.findByPk(req.params.id);
    res.json(carrera);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar carrera
exports.deleteCarrera = async (req, res) => {
  try {
    const deleted = await Carrera.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Carrera eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
