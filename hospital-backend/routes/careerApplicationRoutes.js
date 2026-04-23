import express from "express";
import {
  getCareerApplications,
  submitCareerApplication,
  updateCareerApplication
} from "../controllers/careerApplicationController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitCareerApplication);
router.get("/", protect, authorizeRoles("admin"), getCareerApplications);
router.put("/:id", protect, authorizeRoles("admin"), updateCareerApplication);

export default router;
