const { Queue, Job } = require('bullmq');
const redisConnection = require('../config/redis');

// Cola de tareas
const queue = new Queue('tasksQueue', { connection: redisConnection });

async function getJobDetails() {
    try {
        // Obtener todos los trabajos en la cola (esto puede ser costoso para colas grandes)
        const jobs = await queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed', 'paused']);
        const jobDetails = [];

        for (const job of jobs) {
            jobDetails.push({
                id: job.id,
                name: job.name,
                state: await job.getState(),
                data: job.data.data,
                returnvalue: job.returnvalue,
                failedReason: job.failedReason,
            });
        }

        //console.log('Detalles de los Jobs:', jobDetails);
        return jobDetails;

    } catch (error) {
        console.error('Error al obtener detalles de los jobs:', error);
        return [];
    }
}

// Exportar la cola y la función para obtener los detalles de los jobs
module.exports = { queue, getJobDetails };