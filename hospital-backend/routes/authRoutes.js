import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

// Public routes
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Auth routes
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.send("Welcome Admin");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;