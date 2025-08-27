const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materiasController');
/**
 * @swagger
 * tags:
 *   name: Materias
 *   description: Endpoints para gestionar materias
 */

/**
 * @swagger
 * /materias:
 *   get:
 *     summary: Obtener todas las materias
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Lista de materias
 */
router.get('/', materiasController.getMaterias);

/**
 * @swagger
 * /materias/{id}:
 *   get:
 *     summary: Obtener materia por ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia encontrada
 *       404:
 *         description: No encontrado
 */
router.get('/:id', materiasController.getMateriaById);

/**
 * @swagger
 * /materias:
 *   post:
 *     summary: Crear una nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Materia creada
 */
router.post('/', materiasController.createMateria);

/**
 * @swagger
 * /materias/{id}:
 *   put:
 *     summary: Actualizar materia
 *     tags: [Materias]
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
 *     responses:
 *       200:
 *         description: Materia actualizada
 *       404:
 *         description: No encontrado
 */
router.put('/:id', materiasController.updateMateria);

/**
 * @swagger
 * /materias/{id}:
 *   delete:
 *     summary: Eliminar materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia eliminada
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', materiasController.deleteMateria);


router.post('/', materiasController.createMateria);
router.get('/', materiasController.getMaterias);
router.get('/:id', materiasController.getMateriaById);
router.put('/:id', materiasController.updateMateria);
router.delete('/:id', materiasController.deleteMateria);

module.exports = router;
