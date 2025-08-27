const express = require('express');
const router = express.Router();
const grupoMateriaController = require('../controllers/grupoMateriaController');
/**
 * @swagger
 * tags:
 *   name: GrupoMateria
 *   description: Endpoints para gestionar grupos de materia
 */

/**
 * @swagger
 * /grupo_materia:
 *   get:
 *     summary: Obtener todos los grupos de materia
 *     tags: [GrupoMateria]
 *     responses:
 *       200:
 *         description: Lista de grupos de materia
 */
router.get('/', grupoMateriaController.getGruposMateria);

/**
 * @swagger
 * /grupo_materia/{id}:
 *   get:
 *     summary: Obtener grupo de materia por ID
 *     tags: [GrupoMateria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo de materia encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', grupoMateriaController.getGrupoMateriaById);

/**
 * @swagger
 * /grupo_materia:
 *   post:
 *     summary: Crear un nuevo grupo de materia
 *     tags: [GrupoMateria]
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
 *         description: Grupo de materia creado
 */
router.post('/', grupoMateriaController.createGrupoMateria);

/**
 * @swagger
 * /grupo_materia/{id}:
 *   put:
 *     summary: Actualizar grupo de materia
 *     tags: [GrupoMateria]
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
 *         description: Grupo de materia actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', grupoMateriaController.updateGrupoMateria);

/**
 * @swagger
 * /grupo_materia/{id}:
 *   delete:
 *     summary: Eliminar grupo de materia
 *     tags: [GrupoMateria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo de materia eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', grupoMateriaController.deleteGrupoMateria);


router.post('/', grupoMateriaController.createGrupoMateria);
router.get('/', grupoMateriaController.getGruposMateria);
router.get('/:id', grupoMateriaController.getGrupoMateriaById);
router.put('/:id', grupoMateriaController.updateGrupoMateria);
router.delete('/:id', grupoMateriaController.deleteGrupoMateria);

module.exports = router;
