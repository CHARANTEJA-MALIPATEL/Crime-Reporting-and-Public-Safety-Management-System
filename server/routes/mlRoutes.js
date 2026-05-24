const express = require('express');
const router = express.Router();
const axios = require('axios');

const ML_SERVICE_URL = 'http://localhost:5000';

// GET /api/ml/status - Check if ML service is running
router.get('/status', async (req, res) => {
    try {
        const response = await axios.get(ML_SERVICE_URL, { timeout: 3000 });
        res.json({ status: 'online', message: response.data });
    } catch (err) {
        res.status(503).json({ status: 'offline', message: 'ML service is not running. Start it with ml/start_ml_service.bat' });
    }
});

// POST /api/ml/predict - Proxy a prediction request
router.post('/predict', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'description is required' });
    }
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, { description }, { timeout: 5000 });
        res.json(response.data);
    } catch (err) {
        res.status(503).json({ error: 'ML service unavailable', category: 'Unclassified' });
    }
});

module.exports = router;
