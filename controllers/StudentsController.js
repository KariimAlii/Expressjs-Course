const Student = require("../models/student");
const findSequence = require("../utilities/sequence");


module.exports.getAllStudents = async (request, response, next) => {
    try {
        const data = await Student.find({});
        response.status(200).json({ Students: data });
    } catch (error) {
        next(error);
    }
};
module.exports.addStudent = async (request, response,next) => {
    try {
        const {fullName,age,level,address} = request.body;
        let sequenceValue = await findSequence("Student Counter");
        const newStudent = new Student({
            _id:sequenceValue,
            fullName,
            age,
            level,
            address
        })
        const data = await newStudent.save();
        response.status(201).json({ data });
    } catch (error) {
        next(error);
    }
};

module.exports.updateStudent = async (req, res, next) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Student not found" });
        res.status(201).json(updated);
    } catch (err) {
        next(err);
    }
};
module.exports.deleteStudent = async (req, res, next) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted" });
    } catch (err) {
        next(err);
    }
};
