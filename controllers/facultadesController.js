// Controlador CRUD para Facultad
const { sequelize, Facultad, Carrera } = require('../models');

// Crear facultad
exports.createFacultad = async (req, res) => {
    let transaction;
    try {
        const { Carreras: carrerasData, ...facultadData } = req.body;

        // Iniciar transacción
        transaction = await sequelize.transaction();

        // 1. Crear la facultad
        const facultad = await Facultad.create(facultadData, { transaction });

        // 2. Crear las carreras y asociarlas a la facultad
        if (Array.isArray(carrerasData) && carrerasData.length > 0) {
            // Agregar facultadId a cada carrera
            const carrerasConFacultadId = carrerasData.map(carrera => ({
                ...carrera,
                facultadId: facultad.id
            }));

            // Crear todas las carreras en un solo lote
            await Carrera.bulkCreate(carrerasConFacultadId, { transaction });
        }

        // 3. Recargar la facultad con sus relaciones
        const facultadCreada = await Facultad.findOne({
            where: { id: facultad.id },
            include: [{ model: Carrera }],
            transaction
        });

        // Commit de la transacción
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Facultad creada correctamente',
            facultad: facultadCreada
        });

    } catch (error) {
        // Rollback en caso de error
        if (transaction) {
            await transaction.rollback();
        }
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las facultades
exports.getFacultades = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));
        const facultades = await Facultad.findAll(
            {
                order: [['nombre', 'ASC']],
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [{
                    model: Carrera,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'facultadId']
                    }
                }],
                limit: pageSize,
                offset: (page - 1) * pageSize
            }
        );
        res.json(facultades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener facultad por ID
exports.getFacultadBySigla = async (req, res) => {
    try {
        const sigla = req.params.sigla;
        console.log(sigla);

        if (!sigla) {
            return res.status(400).json({ error: 'Sigla de la facultad es requerida' });
        }
        const facultad = await Facultad.findOne(
            {
                where: { sigla },
                include: [
                    {
                        model: Carrera,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'facultadId', 'id']
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'id']
                }
            });

        if (!facultad) return res.status(404).json({ error: `Facultad con sigla ${sigla} no encontrada` });
        res.json(facultad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar facultad
exports.updateFacultad = async (req, res) => {
    let transaction;
    try {
        const sigla = req.params.sigla;

        if (!sigla) {
            return res.status(400).json({ error: 'Sigla de la facultad es requerida' });
        }

        // Iniciar transacción
        transaction = await sequelize.transaction();

        // 1. Buscar la facultad con sus carreras asociadas
        const facultad = await Facultad.findOne({
            where: { sigla },
            include: [{ model: Carrera }],
            transaction
        });

        if (!facultad) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Facultad no encontrada' });
        }
        const facultadId = facultad.id;

        // 2. Separar datos de la facultad de los datos de las carreras
        const { Carreras: carrerasData, ...facultadData } = req.body;

        // 3. Actualizar los datos principales de la facultad
        await facultad.update(facultadData, { transaction });

        // 4. Actualizar relaciones de carreras
        if (Array.isArray(carrerasData)) {
            // Obtener las siglas de las carreras enviadas en el cuerpo
            const siglas = carrerasData
                .filter(carrera => carrera.sigla)
                .map(carrera => carrera.sigla);

            // Validar que todas las carreras con esas siglas existan
            const carrerasExistentes = await Carrera.findAll({
                where: {
                    sigla: siglas
                },
                transaction
            });

            // Verificar si la cantidad de carreras encontradas coincide con la cantidad enviada
            if (carrerasExistentes.length !== siglas.length) {
                const siglasExistentes = carrerasExistentes.map(c => c.sigla);
                const siglasFaltantes = siglas.filter(s => !siglasExistentes.includes(s));

                await transaction.rollback();
                return res.status(400).json({
                    error: `No existen carreras con las siglas: ${siglasFaltantes.join(', ')}`
                });
            }

            // Primero: Desasociar todas las carreras actuales de esta facultad
            await Carrera.update(
                { facultadId: null },
                {
                    where: { facultadId: facultad.id },
                    transaction
                }
            );

            // Luego: Asociar todas las carreras nuevas en una sola operación
            await Carrera.update(
                { facultadId: facultad.id },
                {
                    where: {
                        sigla: siglas
                    },
                    transaction
                }
            );
        } else if (carrerasData !== undefined) {
            // Si se envió pero no es un array
            await transaction.rollback();
            return res.status(400).json({
                error: 'Carreras debe ser un array de las siglas de las carreras'
            });
        }

        // 5. Recargar la facultad con sus relaciones actualizadas
        const facultadActualizada = await Facultad.findOne({
            where: { id: facultadId },
            include: [{ model: Carrera }],
            transaction
        });

        // Commit de la transacción
        await transaction.commit();

        res.json({
            success: true,
            message: 'Facultad y sus relaciones actualizadas correctamente',
            facultad: facultadActualizada
        });

    } catch (error) {
        console.error(error);
        // Rollback en caso de error
        if (transaction) {
            await transaction.rollback();
        }
        res.status(400).json({ error: error.message });
    }

};

// Eliminar facultad
exports.deleteFacultad = async (req, res) => {
    try {
        const sigla = req.params.sigla;
        if (!sigla) {
            return res.status(400).json({ error: 'Sigla de la facultad es requerida' });
        }
        const deleted = await Facultad.destroy({ where: { sigla } });
        if (!deleted) return res.status(404).json({ error: `facultad con sigla ${sigla} no encontrada` });
        res.json({ mensaje: 'Facultad eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
