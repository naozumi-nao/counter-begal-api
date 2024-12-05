const express = require('express');
const router = express.Router();
const Report = require('../src/models/reports.js');

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
});

router.get('/:id', getReport, (req, res) => {
  res.json(res.report);
});

router.post('/', async (req, res) => {
  const report = new Report({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    photoUrl: req.body.photoUrl,
    lon: req.body.lon,
    lat: req.body.lat,
    createdAt: Date.now()
  })
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getReport, (req, res) => {
  // N/A
});

router.delete('/:id', getReport, async (req, res) => {
  try {
    await res.report.remove();
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

async function getReport(req, res, next) {
  let report;
  try {
    report = await Report.findById(req.params.id);
    if (report == '') {
      return res.status(404).json({ message: 'Cannot find report' });
    }
  } catch(error) {
    return res.status(500).json({ message: error.message });
  }

  res.report = report;
  next();
}

module.exports = router;