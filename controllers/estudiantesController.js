// Controlador CRUD para Estudiantes
const { Estudiante } = require('../models');

// Crear estudiante
exports.createEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.create(req.body);
    res.status(201).json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los estudiantes
exports.getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener estudiante por ID
exports.getEstudianteById = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estudiante
exports.updateEstudiante = async (req, res) => {
  try {
    const [updated] = await Estudiante.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    const estudiante = await Estudiante.findByPk(req.params.id);
    res.json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar estudiante
exports.deleteEstudiante = async (req, res) => {
  try {
    const deleted = await Estudiante.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Estudiante eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
