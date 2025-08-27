const express = require('express');
const router = express.Router();
const facultadesController = require('../controllers/facultadesController');


/**
 * @swagger
 * tags:
 *   name: Facultades
 *   description: Endpoints para gestionar facultades
 */

/**
 * @swagger
 * /facultades:
 *   get:
 *     summary: Obtener todas las facultades
 *     tags: [Facultades]
 *     responses:
 *       200:
 *         description: Lista de facultades
 */
router.get('/', facultadesController.getFacultades);

/**
 * @swagger
 * /facultades/{id}:
 *   get:
 *     summary: Obtener facultad por ID
 *     tags: [Facultades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facultad encontrada
 *       404:
 *         description: No encontrado
 */
router.get('/:id', facultadesController.getFacultadById);

/**
 * @swagger
 * /facultades:
 *   post:
 *     summary: Crear una nueva facultad
 *     tags: [Facultades]
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
 *         description: Facultad creada
 */
router.post('/', facultadesController.createFacultad);

/**
 * @swagger
 * /facultades/{id}:
 *   put:
 *     summary: Actualizar facultad
 *     tags: [Facultades]
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
 *         description: Facultad actualizada
 *       404:
 *         description: No encontrado
 */
router.put('/:id', facultadesController.updateFacultad);

/**
 * @swagger
 * /facultades/{id}:
 *   delete:
 *     summary: Eliminar facultad
 *     tags: [Facultades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facultad eliminada
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', facultadesController.deleteFacultad);

module.exports = router;
