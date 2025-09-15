// Controlador CRUD para Plan_de_estudio
const e = require('express');
const { sequelize, Plan_de_estudio, Materia, Detalle_materia, Carrera } = require('../models');

exports.createPlanDeEstudio = async (req, res) => {
	let transaction;
	try {
		const { carrera: carreraData, Detalle_materia: detallesData, ...planData } = req.body;

		// Validar que se proporcione la sigla de la carrera
		if (!carreraData || !carreraData.sigla) {
			return res.status(400).json({
				error: 'Debe proporcionar la sigla de la carrera'
			});
		}

		// Iniciar transacción
		transaction = await sequelize.transaction();

		// 1. Buscar la carrera por su sigla
		const carrera = await Carrera.findOne({
			where: { sigla: carreraData.sigla },
			transaction
		});

		if (!carrera) {
			await transaction.rollback();
			return res.status(400).json({
				error: `No existe una carrera con sigla ${carreraData.sigla}`
			});
		}

		// 2. Asignar el carreraId al plan de estudio
		planData.carreraId = carrera.id;

		// 3. Crear el plan de estudio
		const planDeEstudio = await Plan_de_estudio.create(planData, { transaction });

		// 4. Crear o buscar las materias y los detalles de materia
		if (Array.isArray(detallesData) && detallesData.length > 0) {
			const detallesConPlanId = [];
			for (const detalle of detallesData) {
				// Si la materia tiene una sigla, la buscamos.
				// Si no existe, la creamos.
				let materia;
				if (detalle.Materium && detalle.Materium.sigla) {
					materia = await Materia.findOne({
						where: { sigla: detalle.Materium.sigla },
						transaction
					});

					if (!materia) {
						materia = await Materia.create(detalle.Materium, { transaction });
					}
				} else {
					await transaction.rollback();
					return res.status(400).json({
						error: 'Cada materia debe tener una sigla'
					});
				}

				detallesConPlanId.push({
					creditos: detalle.creditos,
					planDeEstudioId: planDeEstudio.id,
					materiaId: materia.id
				});
			}

			// Crear todos los detalles de materia
			await Detalle_materia.bulkCreate(detallesConPlanId, { transaction });
		}

		// 5. Recargar el plan de estudio con sus relaciones
		const planCreado = await Plan_de_estudio.findOne({
			where: { id: planDeEstudio.id },
			include: [
				{
					model: Carrera,
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'id', 'facultadId']
					}
				},
				{
					model: Detalle_materia,
					include: [
						{
							model: Materia,
							attributes: {
								exclude: ['createdAt', 'updatedAt', 'id']
							}
						}
					]
				}
			],
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'id', 'carreraId', 'materiaId']
			},
			transaction
		});

		// Commit de la transacción
		await transaction.commit();

		res.status(201).json({
			success: true,
			message: 'Plan de estudio creado correctamente',
			planDeEstudio: planCreado
		});

	} catch (error) {
		console.log(error);
		// Rollback en caso de error
		if (transaction) {
			await transaction.rollback();
		}
		res.status(400).json({ error: error.message });
	}

};

exports.getPlanesDeEstudio = async (req, res) => {
	try {

		// Extraer 'page' y 'pageSize' de los datos, con valores por defecto.
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));
		const planes = await Plan_de_estudio.findAll(
			{
				include: [
					{
						model: Detalle_materia,
						include: [
							{
								model: Materia,
								attributes: {
									exclude: ['createdAt', 'updatedAt', 'id']
								}
							}
						],
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'planDeEstudioId', 'id', 'materiaId']
						}
					},
					{
						model: Carrera,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'id', 'facultadId']
						}
					}
				],
				order: [['nombre', 'DESC']],
				attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'carreraId', 'materiaId'] }
			},
			{
				offset: (page - 1) * pageSize,
				limit: pageSize
			});
		res.json(planes);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getPlanDeEstudioByCodigo = async (req, res) => {
	try {
		const codigo = req.params.codigo;

		if (!codigo) {
			return res.status(400).json({ error: 'Código del plan de estudio es requerido' });
		}

		const plan = await Plan_de_estudio.findOne(
			{
				where: { codigo },
				include: [
					{
						model: Detalle_materia,
						include: [
							{
								model: Materia,
								attributes: {
									exclude: ['createdAt', 'updatedAt', 'id']
								}
							}
						],
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'planDeEstudioId', 'id', 'materiaId']
						}
					},
					{
						model: Carrera,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'id', 'facultadId']
						}
					}
				],
				order: [['nombre', 'DESC']],
				attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'carreraId', 'materiaId'] }
			});

		if (!plan) return res.status(404).json({ error: 'No encontrado' });
		res.json(plan);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Actualizar plan de estudio
exports.updatePlanDeEstudio = async (req, res) => {
    let transaction;
    try {
        const codigo = req.params.codigo;

        if (!codigo) {
            return res.status(400).json({ error: 'El código del plan de estudio es requerido' });
        }

        // Iniciar transacción
        transaction = await sequelize.transaction();

        // 1. Buscar el plan de estudio con sus relaciones
        const planDeEstudio = await Plan_de_estudio.findOne({
            where: { codigo },
            include: [{ model: Carrera }, { model: Detalle_materia }],
            transaction
        });

        if (!planDeEstudio) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Plan de estudio no encontrado' });
        }
        const planId = planDeEstudio.id;

        // 2. Separar datos del plan de estudio de las relaciones
        const { Carrera: carreraData, Detalle_materia: detallesData, ...planData } = req.body;

        // 3. Validar y actualizar la carrera si se proporciona
        if (carreraData && carreraData.sigla) {
            const carrera = await Carrera.findOne({
                where: { sigla: carreraData.sigla },
                transaction
            });

            if (!carrera) {
                await transaction.rollback();
                return res.status(400).json({
                    error: `No existe una carrera con sigla ${carreraData.sigla}`
                });
            }

            // Actualizar el carreraId en los datos del plan
            planData.carreraId = carrera.id;
        }

        // 4. Actualizar datos principales del plan de estudio
        await planDeEstudio.update(planData, { transaction });

        // 5. Reemplazar las relaciones de Detalle_materia
        if (Array.isArray(detallesData)) {
            // Eliminar todos los detalles de materia actuales asociados a este plan
            await Detalle_materia.destroy({
                where: { planDeEstudioId: planId },
                transaction
            });

            // Recopilar las siglas de las nuevas materias
            const siglasMaterias = detallesData
                .filter(detalle => detalle.Materium && detalle.Materium.sigla)
                .map(detalle => detalle.Materium.sigla);

            // Buscar las materias existentes
            const materiasExistentes = await Materia.findAll({
                where: {
                    sigla: siglasMaterias
                },
                transaction
            });

            // Verificar si todas las siglas enviadas existen
            if (materiasExistentes.length !== siglasMaterias.length) {
                const siglasEncontradas = materiasExistentes.map(m => m.sigla);
                const siglasFaltantes = siglasMaterias.filter(s => !siglasEncontradas.includes(s));
                await transaction.rollback();
                return res.status(400).json({
                    error: `No existen materias con las siglas: ${siglasFaltantes.join(', ')}`
                });
            }

            // Preparar los nuevos detalles para inserción masiva
            const nuevosDetalles = detallesData.map(detalle => {
                const materia = materiasExistentes.find(m => m.sigla === detalle.Materium.sigla);
                return {
                    creditos: detalle.creditos,
                    planDeEstudioId: planId,
                    materiaId: materia.id
                };
            });

            // Crear los nuevos detalles de materia
            await Detalle_materia.bulkCreate(nuevosDetalles, { transaction });

        } else if (detallesData !== undefined) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Detalle_materia debe ser un array'
            });
        }

        // 6. Recargar el plan de estudio con sus relaciones actualizadas
        const planActualizado = await Plan_de_estudio.findOne({
            where: { id: planId },
            include: [
                { model: Carrera },
                { model: Detalle_materia, include: [{ model: Materia }] }
            ],
            transaction
        });

        // Commit de la transacción
        await transaction.commit();

        res.json({
            success: true,
            message: 'Plan de estudio y sus relaciones actualizadas correctamente',
            planDeEstudio: planActualizado
        });

    } catch (error) {
        console.error(error);
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json({ error: error.message });
    }
};

exports.deletePlanDeEstudio = async (req, res) => {
	try {
		const codigo = req.params.codigo;

		if (!codigo) {
			return res.status(400).json({ error: 'El código del plan de estudio es requerido' });
		}

		const deleted = await Plan_de_estudio.destroy({ where: { codigo } });
		if (!deleted) return res.status(404).json({ error: 'No encontrado' });
		res.json({ mensaje: 'Plan de estudio eliminado' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
