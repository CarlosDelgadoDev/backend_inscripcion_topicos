const express = require('express');
const router = express.Router();
const taskWorker = require('../workers/worker');
const { getJobDetails } = require('../workers/queue'); // <-- Importa getJobDetails

router.get('/start', (req, res) => {
    try {
        taskWorker.start();
        res.status(200).json({ status: 'Worker iniciado' });
    } catch (error) {
        console.error("Error al iniciar el worker:", error);
        res.status(500).json({ status: 'Error al iniciar el worker', error: error.message });
    }
});

router.get('/stop', async (req, res) => {
    try {
        await taskWorker.stop();
        res.status(200).json({ status: 'Worker detenido' });
    } catch (error) {
        console.error("Error al detener el worker:", error);
        res.status(500).json({ status: 'Error al detener el worker', error: error.message });
    }
});

router.get('/status', (req, res) => {
    res.status(200).json({ status_running: taskWorker.getStatus() });
});

router.get('/jobs', async (req, res) => {
    try {
        const jobs = await getJobDetails();
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error al obtener los jobs:", error);
        res.status(500).json({ status: 'Error al obtener los jobs', error: error.message });
    }
});

/* GET home page. */
router.get('/manager', function (req, res, next) {
    res.render('workers_views/index.ejs', { title: 'Worker Status' });
});

module.exports = router;