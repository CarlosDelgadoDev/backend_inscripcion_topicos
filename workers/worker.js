const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const CommandInvoker = require('../commands/commandInvoker');
const { saveUnique } = require('../helpers/redisHelper');
const taskMap = require('../helpers/taskMap');

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
                    // 🔹 Validación de duplicados usando taskMap
                    const taskInfo = taskMap[task];
                    if (taskInfo) {
                        const { tabla, idField } = taskInfo;
                        const uniqueId = data[idField];
                        const resultUnique = await saveUnique(tabla, uniqueId, data);

                        if (!resultUnique.success) {
                            console.log(`Job ${job.id} duplicado:`, resultUnique.message);
                            return { error: resultUnique.message };
                        }
                    }

                    // 🔹 Ejecutar el comando real
                    const command = CommandInvoker.createCommand(task, data);
                    const result = await command.execute();

                    console.log(`Resultado del job ${job.id}:`, result);
                    return result;

                } catch (error) {
                    console.error(`Error processing task ${task}:`, error);
                    throw error;
                }
            }, { connection: this.connection, concurrency: this.concurrency });

            // Listeners de job completado
            this.worker.on('completed', async job => {
                console.log(`Job ${job.id} completado`);
                const callbackUrl = job.data.data.callback;
                const res = job.returnvalue;

                fetch(callbackUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ result: res })
                })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error callback:', error));
            });

            // Listeners de job fallido
            this.worker.on('failed', (job, err) => {
                console.error(`Job ${job.id} falló:`, err.message);
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
