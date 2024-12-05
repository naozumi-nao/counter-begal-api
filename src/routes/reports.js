import express from "express";
import Report from "../models/report.js";
import dotenv from "dotenv";

import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand ,GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const imageNameRandomizer = (bytes = 32) => {
  crypto.randomBytes().toString('hex');
};

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION
});

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();

    for (const report of reports) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: report.photoName,
      }
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      report.photoUrl = url;
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

router.post("/", upload.single("report-image"), async (req, res) => {
  const responseWrapper = {
    error: false,
    message: "Successfully added new report",
  }

  const buffer = await sharp(req.file.buffer).resize({ height: 480, width: 480, fit: "contain" }).toBuffer();
  const imgName = imageNameRandomizer();
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imgName,
    Body: buffer,
    ContentType: req.file.mimetype,
  }
  const command = new PutObjectCommand(params)

  const report = new Report({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    photoName: imgName,
    //photoUrl: req.body.photoUrl,
    lon: req.body.lon,
    lat: req.body.lat,
    createdAt: Date.now()
  })

  try {
    await s3.send(command);
    await report.save();
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
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: res.report.photoName
  }
  const command = new DeleteObjectCommand(params);

  try {
    await s3.send(command);
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