const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

// Cola de tareas
const queue = new Queue('tasksQueue', { connection });

module.exports = queue;