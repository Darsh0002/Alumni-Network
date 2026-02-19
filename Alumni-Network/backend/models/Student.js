const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    full_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: String,

    enrollment_no: {
        type: String,
        unique: true
    },

    course: String,

    branch: String,

    passoutYear: Number,

    company: String,

    job: String,

    linkedinuri: String,

    status: {
        type: String,
        enum: ["current", "alumni"]
    }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
