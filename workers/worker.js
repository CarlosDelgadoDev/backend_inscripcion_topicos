const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const CommandInvoker = require('../commands/commandInvoker');

const worker = new Worker('tasksQueue', async job => {
  console.log(`WORKER: Procesando job ${job.id} con datos:`, job.data);
  const { task, data } = job.data.data;
  
  try {
    // Usar el invocador para crear el comando apropiado
    const command = CommandInvoker.createCommand(task, data);

    // Esto ejecuta el comando
    const result = await command.execute();
    
    return result;
  } catch (error) {
    // Manejar errores de manera consistente
    console.error(`Error processing task ${task}:`, error);
    throw error;
  }
}, { connection: redisConnection, concurrency: 5 });

// Manejadores de eventos (opcionalmente podrían moverse a una clase separada)
worker.on('completed', job => {
  console.log(`Job ${job.id} completado`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} falló:`, err.message);
});

console.log('Worker iniciado con patrón Command...');

module.exports = worker;