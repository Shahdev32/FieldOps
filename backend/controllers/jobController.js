import Job from "../models/Job.js";
import User from "../models/User.js";

//  Create Job
export const createJob = async (req, res) => {
  try {
    const { title, description, technician } = req.body;

    const job = await Job.create({
      title,
      description,
      technician,
      client: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get Jobs (ALL ROLES)
export const getMyJobs = async (req, res) => {
  try {
    let jobs;

    if (req.user.role === "admin") {
      jobs = await Job.find().populate("technician", "name email");
    } else if (req.user.role === "technician") {
      jobs = await Job.find({ technician: req.user._id });
    } else {
      jobs = await Job.find({ client: req.user._id });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Status
export const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.technician.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    job.status = req.body.status;
    await job.save();

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get Technicians (IMPORTANT for dropdown)
export const getTechnicians = async (req, res) => {
  const techs = await User.find({ role: "technician" });
  res.json(techs);
};