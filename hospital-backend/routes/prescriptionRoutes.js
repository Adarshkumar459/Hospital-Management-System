import express from "express";
import {
  addPrescription,
  getMyPrescriptions
} from "../controllers/prescriptionController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Doctor only
router.post("/add", protect, authorizeRoles("doctor"), addPrescription);

// Patient only
router.get("/my", protect, authorizeRoles("patient"), getMyPrescriptions);

export default router;