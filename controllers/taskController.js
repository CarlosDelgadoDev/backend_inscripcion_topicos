// Controlador CRUD para Aula
const {queue} = require('../workers/queue');

exports.createTask = async (req, res) => {

    const body = req.body;
    console.log(body);

    try {
        const task = await queue.add('task', {
            data: body,
            estado: 'pendiente'
        });

        // Respuesta inmediata al cliente
        res.status(202).json({
            message: 'Solicitud aceptada y en procesamiento',
            taskId: task.id
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const idTask = req.params.id;
        console.log(`Buscando tarea con ID: ${idTask}`);

        const task = await queue.getJob(idTask);
        
        if (!task) {
            return res.status(204).json({ error: 'Tarea no encontrada' });
        }

        // --- Corrección aquí ---
        // Esperamos a que la promesa de getState() se resuelva para obtener el estado actual
        const status = await task.getState();

        res.json({
            taskId: task.id,
            status: status
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


