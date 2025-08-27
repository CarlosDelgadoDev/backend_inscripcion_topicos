const express = require('express');
const router = express.Router();
const boletaInscripcionController = require('../controllers/boletaInscripcionController');
/**
 * @swagger
 * tags:
 *   name: BoletaInscripcion
 *   description: Endpoints para gestionar boletas de inscripción
 */

/**
 * @swagger
 * /boleta_inscripcion:
 *   get:
 *     summary: Obtener todas las boletas de inscripción
 *     tags: [BoletaInscripcion]
 *     responses:
 *       200:
 *         description: Lista de boletas de inscripción
 */
router.get('/', boletaInscripcionController.getBoletasInscripcion);

/**
 * @swagger
 * /boleta_inscripcion/{id}:
 *   get:
 *     summary: Obtener boleta de inscripción por ID
 *     tags: [BoletaInscripcion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Boleta de inscripción encontrada
 *       404:
 *         description: No encontrado
 */
router.get('/:id', boletaInscripcionController.getBoletaInscripcionById);

/**
 * @swagger
 * /boleta_inscripcion:
 *   post:
 *     summary: Crear una nueva boleta de inscripción
 *     tags: [BoletaInscripcion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: integer
 *               gestionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Boleta de inscripción creada
 */
router.post('/', boletaInscripcionController.createBoletaInscripcion);

/**
 * @swagger
 * /boleta_inscripcion/{id}:
 *   put:
 *     summary: Actualizar boleta de inscripción
 *     tags: [BoletaInscripcion]
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
 *               estudianteId:
 *                 type: integer
 *               gestionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Boleta de inscripción actualizada
 *       404:
 *         description: No encontrado
 */
router.put('/:id', boletaInscripcionController.updateBoletaInscripcion);

/**
 * @swagger
 * /boleta_inscripcion/{id}:
 *   delete:
 *     summary: Eliminar boleta de inscripción
 *     tags: [BoletaInscripcion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Boleta de inscripción eliminada
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', boletaInscripcionController.deleteBoletaInscripcion);


router.post('/', boletaInscripcionController.createBoletaInscripcion);
router.get('/', boletaInscripcionController.getBoletasInscripcion);
router.get('/:id', boletaInscripcionController.getBoletaInscripcionById);
router.put('/:id', boletaInscripcionController.updateBoletaInscripcion);
router.delete('/:id', boletaInscripcionController.deleteBoletaInscripcion);

module.exports = router;
