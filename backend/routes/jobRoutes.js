import express from "express";
import {
  createJob,
  getMyJobs,
  updateJobStatus
} from "../controllers/jobController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createJob);
router.get("/my", protect, getMyJobs);
router.put("/:id", protect, updateJobStatus);

export default router;