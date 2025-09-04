const express = require('express');
const router = express.Router();
const carrerasController = require('../controllers/carrerasController');


/**
 * @swagger
 * tags:
 *   name: Carreras
 *   description: Endpoints para gestionar carreras
 */

/**
 * @swagger
 * /carreras:
 *   get:
 *     summary: Obtener todas las carreras
 *     tags: [Carreras]
 *     responses:
 *       200:
 *         description: Lista de carreras
 */
router.get('/', carrerasController.getCarreras);

/**
 * @swagger
 * /carreras/{id}:
 *   get:
 *     summary: Obtener carrera por ID
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrera encontrada
 *       404:
 *         description: No encontrado
 */
router.get('/:id', carrerasController.getCarreraById);

/**
 * @swagger
 * /carreras:
 *   post:
 *     summary: Crear una nueva carrera
 *     tags: [Carreras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               facultadId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Carrera creada
 */
router.post('/', carrerasController.createCarrera);

/**
 * @swagger
 * /carreras/{id}:
 *   put:
 *     summary: Actualizar carrera
 *     tags: [Carreras]
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
 *               facultadId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Carrera actualizada
 *       404:
 *         description: No encontrado
 */
router.put('/:id', carrerasController.updateCarrera);

/**
 * @swagger
 * /carreras/{id}:
 *   delete:
 *     summary: Eliminar carrera
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrera eliminada
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', carrerasController.deleteCarrera);

module.exports = router;
