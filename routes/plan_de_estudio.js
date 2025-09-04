const express = require('express');
const router = express.Router();
const planDeEstudioController = require('../controllers/planDeEstudioController');
/**
 * @swagger
 * tags:
 *   name: PlanDeEstudio
 *   description: Endpoints para gestionar planes de estudio
 */

/**
 * @swagger
 * /plan_de_estudio:
 *   get:
 *     summary: Obtener todos los planes de estudio
 *     tags: [PlanDeEstudio]
 *     responses:
 *       200:
 *         description: Lista de planes de estudio
 */
router.get('/', planDeEstudioController.getPlanesDeEstudio);

/**
 * @swagger
 * /plan_de_estudio/{id}:
 *   get:
 *     summary: Obtener plan de estudio por ID
 *     tags: [PlanDeEstudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan de estudio encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', planDeEstudioController.getPlanDeEstudioById);

/**
 * @swagger
 * /plan_de_estudio:
 *   post:
 *     summary: Crear un nuevo plan de estudio
 *     tags: [PlanDeEstudio]
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
 *         description: Plan de estudio creado
 */
router.post('/', planDeEstudioController.createPlanDeEstudio);

/**
 * @swagger
 * /plan_de_estudio/{id}:
 *   put:
 *     summary: Actualizar plan de estudio
 *     tags: [PlanDeEstudio]
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
 *         description: Plan de estudio actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', planDeEstudioController.updatePlanDeEstudio);

/**
 * @swagger
 * /plan_de_estudio/{id}:
 *   delete:
 *     summary: Eliminar plan de estudio
 *     tags: [PlanDeEstudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan de estudio eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', planDeEstudioController.deletePlanDeEstudio);


router.post('/', planDeEstudioController.createPlanDeEstudio);
router.get('/', planDeEstudioController.getPlanesDeEstudio);
router.get('/:id', planDeEstudioController.getPlanDeEstudioById);
router.put('/:id', planDeEstudioController.updatePlanDeEstudio);
router.delete('/:id', planDeEstudioController.deletePlanDeEstudio);

module.exports = router;
