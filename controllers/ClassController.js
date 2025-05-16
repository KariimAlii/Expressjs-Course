const Class = require("../models/class");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const findSequence = require("../utilities/sequence");


module.exports.getAllClasses = async (request, response,next) => {
    try {
        const data = await Class
            .find({})
            .populate({ path: "supervisor", select: { _id:0, fullName:1 }})
            .populate({ path: "studentIds", select: { fullName:1, age:1 }});

        response.status(200).json({ data });
    } catch (error) {
        next (error)
    }
};
module.exports.addClass = async (req, res,next) => {
    try {
        const {name, supervisorFullName, studentNames } = req.body;

        const supervisor = await Teacher.findOne({fullName: supervisorFullName});

        //! Fetching Data in sequence (N+1) issue
        // let students = []
        // for (let index = 0; index < studentNames.length; index++) {
        //     const name = studentNames[index];
        //     const student = await Student.findOne({fullName: name});
        //     students.push(student);
        // }

        //! Calling Database in parallel using Promise.all()
        const students = await Promise.all
        (
            studentNames.map(name => Student.findOne({fullName: name}))
        )

        let sequenceValue = await findSequence("Class");

        const newClass = new Class({
            _id: sequenceValue,
            name,
            supervisorId: supervisor._id,
            studentIds: students.map(st => st._id)
        })

        const data = await newClass.save();

        res.status(201).json({data})
    } catch (error) {
        console.log(error);
        next(error)
    }

};
module.exports.updateClass = async (req, res, next) => {
    try {
        const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Class not found" });
        res.status(201).json(updated);
    } catch (err) {
        next(err);
    }
};
module.exports.deleteClass = async (req, res, next) => {
    try {
        const deleted = await Class.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Class not found" });
        res.status(204).json({ message: "Class deleted" });
    } catch (err) {
        next(err);
    }
};