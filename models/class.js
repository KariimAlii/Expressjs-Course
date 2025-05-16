//! Class Schema:
//      _id(Number),
//      name,
//      supervisor (teacher id number),
//      children which is array of children ids

const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const classSchema = new mongoose.Schema({
    _id: Number,
    name: { type: String , required: true , unique: true },
    supervisorId: {type: ObjectId, ref: "Teacher"},            //! ref ====> Model
    studentIds: [{type: Number, ref: "Student"}]
})

module.exports = mongoose.model("Class", classSchema)