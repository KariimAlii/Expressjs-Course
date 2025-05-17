const Role = require("../models/Role");
const User = require("../models/User");

const seedRoles = async () => {
    const roles = ["User", "Admin", "Teacher", "Student"];
    for (let role of roles) {
        const exists = await Role.findOne({ name: role });
        if (!exists) {
            await Role.create({ name: role });
        }
    }

    const adminRole = await Role.findOne({ name: "Admin" });

    const adminExists = await User.findOne({ roles: adminRole._id });

    if (!adminExists) {
        const admin = new User({
            email: "admin@gmail.com",
            password: "Admin@123", // You can hash or read this from .env
            roles: [adminRole._id]
        });

        await admin.save();
        console.log("✅ Default admin user created: admin@gmail.com / Admin@123");
    }
};

module.exports = initRoles;
