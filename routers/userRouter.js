// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Role = require("../models/Role");
const {protect, authorizeRoles} = require("../middlewares/authMiddleware");

// PUT /api/users/:id/roles
router.put("/:id/roles", protect, authorizeRoles("Admin"), async (req, res, next) => {
    try {
        const { roles } = req.body; // e.g., ["Admin", "Teacher"]

        const roleDocs = await Role.find({ name: { $in: roles } });
        if (!roleDocs.length) return res.status(400).json({ message: "Invalid roles" });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { roles: roleDocs.map(r => r._id) },
            { new: true }
        ).populate("roles");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Roles assigned", user });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res) => {
    const users = await User.find().populate({ path: "roles", select: { _id:0, name:1 }});
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate({ path: "roles", select: { _id:0, name:1 }});
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

module.exports = router;
