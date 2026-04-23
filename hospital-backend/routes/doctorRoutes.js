import express from "express";
import {
  addDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor
} from "../controllers/doctorController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only
router.post("/add", protect, authorizeRoles("admin"), addDoctor);
router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

// Public or logged-in
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

export default router;
