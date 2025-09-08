const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const CommandInvoker = require('../commands/commandInvoker');

class TaskWorker {
    constructor(queueName, connection, concurrency = 1) {
        this.queueName = queueName;
        this.connection = connection;
        this.concurrency = concurrency;
        this.worker = null;
    }

    async start() {
        if (!this.worker) {
            this.worker = new Worker(this.queueName, async job => {
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
            }, { connection: this.connection, concurrency: this.concurrency });

            this.worker.on('completed', job => {
                console.log(`Job ${job.id} completado`);
                const callbackUrl = job.data.data.callback;
                const res = job.returnvalue;

                fetch(callbackUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ result: res })
                })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });

            this.worker.on('failed', (job, err) => {
                console.error(`Job ${job.id} falló:`, err.message);
                const callbackUrl = job.data.data.callback;
                console.log(callbackUrl);
                const res = job.returnvalue;

                fetch(callbackUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ result: res })
                })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });

            console.log('Worker iniciado');
        } else {
            console.log('Worker ya estaba iniciado');
        }
    }

    async stop() {
        if (this.worker) {
            await this.worker.close();
            this.worker = null;
            console.log('Worker detenido');
        } else {
            console.log('No hay worker para detener');
        }
    }

    getStatus() {
        return !!this.worker;
    }
}

const taskWorker = new TaskWorker('tasksQueue', redisConnection, 1);

module.exports = taskWorker;