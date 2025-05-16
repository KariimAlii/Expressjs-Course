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
module.exports.addClass = async (request, response,next) => {
    try {
        const { name, supervisorFullName, studentIds} = request.body;

        const supervisor = await Teacher.findOne({fullName: supervisorFullName});

        // ❌❌ Fetching data in sequence (N+1) issue
        // let students = [];
        //
        // for (let i = 0;i < studentIds.length;i++) {
        //     let childObject = await Student.findById(studentIds[i]);
        //     students.push(childObject);
        // }

        // ✅✅ Use Promise.all() for parallel fetching:
        // const students = await Promise.all(
        //     studentIds.map(id => Student.findById(id))
        // );

        // ✅✅ Filtering out null students (in case some IDs don't exist):
        const students = (await Promise.all(
            studentIds.map(id => Student.findById(id))
        )).filter(s => s !== null);


        let sequenceValue = await findSequence("Class Counter");

        const newClass = new Class({
            _id:sequenceValue,
            name,
            // supervisor,
            supervisor: supervisor._id,
            // studentIds : students
            studentIds: students.map(student => student._id)
        })

        const data = await newClass.save();

        response.status(201).json({ newClass: data });
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