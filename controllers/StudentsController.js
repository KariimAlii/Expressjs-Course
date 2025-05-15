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
module.exports.updateStudent = (request, response) => {
    response.status(201).json({ message: "Update ~ Student" });
};
module.exports.deleteStudent = (request, response) => {
    response.status(201).json({ message: "Delete ~ Student" });
};
