import express from "express";
import {
  deletePatient,
  getAdminMeta,
  getAllAppointments,
  getDashboardOverview,
  getPatients,
  updateAppointment,
  updatePatient
} from "../controllers/adminController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getDashboardOverview);
router.get("/meta", getAdminMeta);
router.get("/patients", getPatients);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);
router.get("/appointments", getAllAppointments);
router.put("/appointments/:id", updateAppointment);

export default router;
