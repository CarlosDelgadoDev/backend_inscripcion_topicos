const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantesController');


/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: Endpoints para gestionar estudiantes
 */

/**
 * @swagger
 * /estudiantes:
 *   get:
 *     summary: Obtener todos los estudiantes
 *     tags: [Estudiantes]
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 */
router.get('/', estudiantesController.getEstudiantes);

/**
 * @swagger
 * /estudiantes/{id}:
 *   get:
 *     summary: Obtener estudiante por ID
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', estudiantesController.getEstudianteById);

/**
 * @swagger
 * /estudiantes:
 *   post:
 *     summary: Crear un nuevo estudiante
 *     tags: [Estudiantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidoPaterno:
 *                 type: string
 *               apellidoMaterno:
 *                 type: string
 *               ci:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               nacionalidad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante creado
 */
router.post('/', estudiantesController.createEstudiante);

/**
 * @swagger
 * /estudiantes/{id}:
 *   put:
 *     summary: Actualizar estudiante
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidoPaterno:
 *                 type: string
 *               apellidoMaterno:
 *                 type: string
 *               ci:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               nacionalidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', estudiantesController.updateEstudiante);

/**
 * @swagger
 * /estudiantes/{id}:
 *   delete:
 *     summary: Eliminar estudiante
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', estudiantesController.deleteEstudiante);

module.exports = router;
