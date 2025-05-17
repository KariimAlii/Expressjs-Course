const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["User", "Admin", "Teacher", "Student"],
        required: true,
        unique: true
    }
});

if (mongoose.models.Role) {
    delete mongoose.models.Role;
}

module.exports = mongoose.model("Role", roleSchema);