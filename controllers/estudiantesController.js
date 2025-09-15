// Controlador CRUD para Estudiantes
const { Estudiante } = require('../models');
const { saveUnique, getById, update, remove } = require('../helpers/redisHelper');

// Crear estudiante
exports.createEstudiante = async (req, res) => {
  try {
    const data = req.body;

    // Validar duplicados con Redis (usamos el campo "ci" como ID único)
    const result = await saveUnique("estudiantes", data.ci, data);

    if (!result.success) {
      return res.status(409).json({ error: result.message });
    }

    // Guardar en la base de datos
    const estudiante = await Estudiante.create(data);

    res.status(201).json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los estudiantes (solo desde DB)
exports.getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener estudiante por ID (desde DB)
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

    // Actualizamos también en Redis (si el "ci" está en el body)
    if (req.body.ci) {
      await update("estudiantes", req.body.ci, req.body);
    }

    const estudiante = await Estudiante.findByPk(req.params.id);
    res.json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar estudiante
exports.deleteEstudiante = async (req, res) => {
  try {
    // Primero buscamos el estudiante para obtener su CI
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });

    // Borramos de la DB
    await Estudiante.destroy({ where: { id: req.params.id } });

    // 🔹 Borramos también de Redis usando el CI
    const { deleteUnique } = require('../helpers/redisHelper');
    await deleteUnique('estudiantes', estudiante.ci);

    res.json({ mensaje: 'Estudiante eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

