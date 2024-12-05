import express from 'express';
import multer from 'multer';
import Report from '../models/report.js';

const router = express.Router();
const upload = multer({ dest: 'images/' });

upload.single('image');

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    const responseWrapper = {
      error: false,
      message: "Successfully fetched reports list from the api",
      reports: reports
    }
    res.status(200).json(responseWrapper);
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
});

router.get("/:id", getReport, (req, res) => {
  res.json(res.report);
});

router.post("/", upload.single('image'), async (req, res) => {
  const report = new Report({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    //photoUrl: req.body.photoUrl,
    lon: req.body.lon,
    lat: req.body.lat,
    createdAt: Date.now()
  })
  const responseWrapper = {
    error: false,
    message: "Successfully added new report",
  }
  try {
    await report.save();
    res.status(201).json(responseWrapper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getReport, (req, res) => {
  // TODO
});

router.delete("/:id", getReport, async (req, res) => {
  try {
    await res.report.deleteOne();
    res.status(204).json(
      { 
        error: false,
        message: "Report successfully deleted" 
      }
    );
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

async function getReport(req, res, next) {
  let report;
  try {
    report = await Report.findById(req.params.id);
    if (report == "") {
      return res.status(404).json({ message: "Cannot find report" });
    }
  } catch(error) {
    return res.status(500).json({ message: error.message });
  }

  res.report = report;
  next();
}

export default router;