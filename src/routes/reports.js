import express from "express";
import Report from "../models/report.js";

import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import { deleteFile, getObjectSignedUrl, uploadFile } from "../aws-s3.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const generateRandomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    if(reports) {
      for (let report of reports) {
        report.photoUrl = await getObjectSignedUrl(report.photoName);
      }
    }

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

router.post("/", upload.single("image-file"), async (req, res) => {
  const file = req.file;
  const imgName = generateRandomFileName();
  console.log(imgName);

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 480, width: 480, fit: "cover" })
    .toBuffer();

  const report = new Report({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    photoName: imgName,
    lon: req.body.lon,
    lat: req.body.lat,
    createdAt: Date.now()
  })

  try {
    console.log(req.file);
    console.log(report);

    await uploadFile(fileBuffer, imgName, file.mimetype);
    await report.save();

    const responseWrapper = {
      error: false,
      message: "Successfully added new report",
    }
    res.status(201).json(responseWrapper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", getReport, (req, res) => {
  res.json(res.report);
});

router.patch("/:id", getReport, (req, res) => {
  // TODO
});

router.delete("/:id", getReport, async (req, res) => {
  try {
    await deleteFile(res.report.photoName);
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