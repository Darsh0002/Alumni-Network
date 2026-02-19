const express = require("express");
const XLSX = require("xlsx");
const upload = require("../middleware/upload");
const Student = require("../models/Student");

const router = express.Router();

router.post("/upload-excel", upload.single("file"), async (req, res) => {

    try {

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet);

        const users = rows.map(row => {

            const passout = Number(row.passoutYear);

            return {
                full_name: row.full_name,
                email: row.email,
                phone: row.phone,
                enrollment_no: row.enrollment_no,
                course: row.course,
                branch: row.branch,
                passoutYear: passout,
                company: row.company,
                job: row.job,
                linkedinuri: row.linkedinuri,
            };
        });

        const result = await Student.insertMany(users, { ordered:false });

        res.json({
            message: "Upload completed",
            inserted: result.length,
            total: users.length
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Upload failed",
            error: err.message
        });
    }
});

module.exports = router;
