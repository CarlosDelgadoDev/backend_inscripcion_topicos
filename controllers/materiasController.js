// Controlador CRUD para Materia
const { Materia } = require('../models');
const { saveUnique, update, deleteUnique } = require('../helpers/redisHelper');

// Crear materia
exports.createMateria = async (req, res) => {
  try {
    const data = req.body;

    // Validar duplicados en Redis usando "sigla"
    const result = await saveUnique('materias', data.sigla, data);
    if (!result.success) {
      return res.status(409).json({ error: result.message });
    }

    // Guardar en la base de datos
    const materia = await Materia.create(data);
    res.status(201).json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las materias
exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener materia por ID
exports.getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ error: 'No encontrado' });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar materia
exports.updateMateria = async (req, res) => {
  try {
    const [updated] = await Materia.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'No encontrado' });

    // Actualizar Redis si se cambia la sigla
    if (req.body.sigla) {
      await update('materias', req.body.sigla, req.body);
    }

    const materia = await Materia.findByPk(req.params.id);
    res.json(materia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar materia
exports.deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ error: 'No encontrado' });

    // Borrar de la base de datos
    await Materia.destroy({ where: { id: req.params.id } });

    // Borrar también de Redis
    await deleteUnique('materias', materia.sigla);

    res.json({ mensaje: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
