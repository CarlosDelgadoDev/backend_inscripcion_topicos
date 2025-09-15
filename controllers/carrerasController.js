// Controlador CRUD para Carreras
const { sequelize, Carrera, Facultad, Plan_de_estudio } = require('../models');

// Crear carrera
exports.createCarrera = async (req, res) => {
	let transaction;
	try {
		const { Facultad: facultadData, Plan_de_estudios: planesData, ...carreraData } = req.body;

		// Validar que se proporcione la sigla de la facultad
		if (!facultadData || !facultadData.sigla) {
			return res.status(400).json({
				error: 'Debe proporcionar la sigla de la facultad'
			});
		}

		// Iniciar transacción
		transaction = await sequelize.transaction();

		// 1. Buscar la facultad por sigla
		const facultad = await Facultad.findOne({
			where: { sigla: facultadData.sigla },
			transaction
		});

		if (!facultad) {
			await transaction.rollback();
			return res.status(400).json({
				error: `No existe una facultad con sigla ${facultadData.sigla}`
			});
		}

		// 2. Asignar el facultadId a la carrera
		carreraData.facultadId = facultad.id;

		// 3. Crear la carrera
		const carrera = await Carrera.create(carreraData, { transaction });

		// 4. Crear los planes de estudio y asociarlos a la carrera
		if (Array.isArray(planesData) && planesData.length > 0) {
			// Agregar carreraId a cada plan
			const planesConCarreraId = planesData.map(plan => ({
				...plan,
				carreraId: carrera.id
			}));

			// Crear todos los planes de estudio
			await Plan_de_estudio.bulkCreate(planesConCarreraId, { transaction });
		}

		// 5. Recargar la carrera con sus relaciones
		const carreraCreada = await Carrera.findOne({
			where: { id: carrera.id },
			include: [
				{ model: Facultad },
				{ model: Plan_de_estudio }
			],
			transaction
		});

		// Commit de la transacción
		await transaction.commit();

		res.status(201).json({
			success: true,
			message: 'Carrera creada correctamente',
			carrera: carreraCreada
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

// Obtener todas las carreras
exports.getCarreras = async (req, res) => {
	try {

		// Extraer 'page' y 'pageSize' de los datos, con valores por defecto.
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));

		// Consulta paginada y con conteo total.
		const { count, rows: carreras } = await Carrera.findAndCountAll({
			include: [{
				model: Facultad
			},
			{
				model: Plan_de_estudio
			}],
			limit: pageSize,
			offset: (page - 1) * pageSize,
			order: [['createdAt', 'DESC']]
		});

		// Calcular el total de páginas.
		const totalPages = Math.ceil(count / pageSize);

		console.log(carreras);

		// Devolver la respuesta con los datos, el éxito y la información de paginación.
		res.json({
			success: true,
			carreras,
			pagination: {
				total: count,
				page: page,
				pageSize: pageSize,
				totalPages: totalPages
			}
		});


	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Obtener carrera por ID
exports.getCarreraBySigla = async (req, res) => {
	try {
		const sigla = req.params.sigla;
		console.log(sigla);
		const carrera = await Carrera.findOne(
			{
				where: {
					sigla: sigla
				},
				include: [{
					model: Facultad
				},
				{
					model: Plan_de_estudio
				}],
			});

		if (!carrera) return res.status(404).json({ error: 'No encontrado' });
		res.json({
			success: true,
			carrera
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Actualizar carrera
exports.updateCarrera = async (req, res) => {
	let transaction;
	try {
		const sigla = req.params.sigla;

		if (!sigla) {
			return res.status(400).json({ error: 'Sigla es requerida' });
		}

		// Iniciar transacción
		transaction = await sequelize.transaction();

		// 1. Buscar la carrera con sus relaciones
		const carrera = await Carrera.findOne({
			where: { sigla },
			include: [
				{ model: Facultad },
				{ model: Plan_de_estudio }
			],
			transaction // 👈 Agregar transacción
		});


		if (!carrera) {
			await transaction.rollback();
			return res.status(404).json({ error: 'Carrera no encontrada' });
		}
		const carreraId = carrera.id;

		// 2. Separar datos principales de relaciones
		const { Facultad: facultadData, Plan_de_estudios: planesData, ...carreraData } = req.body;

		// 3. Validar y actualizar facultad si se proporciona
		if (facultadData && facultadData.sigla) {
			const facultad = await Facultad.findOne({
				where: { sigla: facultadData.sigla },
				transaction // 👈 Agregar transacción
			});

			if (!facultad) {
				await transaction.rollback();
				return res.status(400).json({
					error: `No existe una facultad con sigla ${facultadData.sigla}`
				});
			}

			// Actualizar el facultadId en los datos de carrera
			carreraData.facultadId = facultad.id;
		}

		// 4. Actualizar datos principales de la carrera
		await carrera.update(carreraData, { transaction }); // 👈 Agregar transacción

		// 5. Cambiar relaciones de planes de estudio
		if (Array.isArray(planesData)) {
			// Primero: Desasociar todos los planes actuales (poner carreraId = NULL)
			await Plan_de_estudio.update(
				{ carreraId: null },
				{
					where: { carreraId: carrera.id },
					transaction // 👈 Agregar transacción
				}
			);

			const codigos = planesData
				.filter(plan => plan.codigo)
				.map(plan => plan.codigo);

			// Validar que todos los códigos existan
			const planesExistentes = await Plan_de_estudio.findAll({
				where: {
					codigo: codigos
				},
				transaction // 👈 Agregar transacción
			});

			// Verificar que todos los códigos enviados existan
			if (planesExistentes.length !== codigos.length) {
				const codigosExistentes = planesExistentes.map(p => p.codigo);
				const codigosFaltantes = codigos.filter(c => !codigosExistentes.includes(c));

				await transaction.rollback();
				return res.status(400).json({
					error: `No existen planes de estudio con códigos: ${codigosFaltantes.join(', ')}`
				});
			}

			// Luego: Asociar todos los planes nuevos en una sola operación
			await Plan_de_estudio.update(
				{ carreraId: carrera.id },
				{
					where: {
						codigo: codigos
					},
					transaction // 👈 Agregar transacción
				}
			);

		} else if (planesData !== undefined) {
			// Si se envió pero no es array
			await transaction.rollback();
			return res.status(400).json({
				error: 'Plan_de_estudios debe ser un array'
			});
		}

		// 6. Recargar la carrera con sus relaciones actualizadas
		const carreraActualizada = await Carrera.findOne({
			where: { id: carreraId },
			include: [
				{ model: Facultad },
				{ model: Plan_de_estudio }
			],
			transaction
		});

		// Commit de la transacción
		await transaction.commit();

		res.json({
			success: true,
			message: 'Carrera y sus relaciones actualizadas correctamente',
			carrera: carreraActualizada
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

// Eliminar carrera
exports.deleteCarrera = async (req, res) => {
	try {
		const deleted = await Carrera.destroy({ where: { id: req.params.id } });
		if (!deleted) return res.status(404).json({ error: 'No encontrado' });
		res.json({ mensaje: 'Carrera eliminada' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
