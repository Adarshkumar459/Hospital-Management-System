import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments
} from "../controllers/appointmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient only
router.post("/book", protect, authorizeRoles("patient"), bookAppointment);
router.get("/my", protect, authorizeRoles("patient"), getMyAppointments);

// Cancel (patient)
router.put("/cancel/:id", protect, authorizeRoles("patient"), cancelAppointment);

// Doctor only
router.get("/doctor/:doctorId", protect, authorizeRoles("doctor", "admin"), getDoctorAppointments);

export default router;
