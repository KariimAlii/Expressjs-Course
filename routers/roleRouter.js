const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// POST /api/roles
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Role name is required' });

    const existing = await Role.findOne({ name });
    if (existing)
        return res.status(400).json({ message: 'Role already exists' });

    const role = await Role.create({ name });

    res.status(201).json(role);
});

module.exports = router;
