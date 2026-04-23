import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment
} from "../controllers/departmentController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", protect, authorizeRoles("admin"), createDepartment);
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

export default router;
