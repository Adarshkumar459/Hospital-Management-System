import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import careerApplicationRoutes from "./routes/careerApplicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { seedDatabase } from "./utils/seedDatabase.js";
import { seedAdmin } from "./utils/seedAdmin.js";








dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

// test route
app.get("/", (req, res) => {
  res.send("Hospital Backend Running...");
});

// routes
app.use("/api/auth", authRoutes);

// doctor routes
app.use("/api/doctors", doctorRoutes);

// appointment routes
app.use("/api/appointments", appointmentRoutes);

// prescription routes
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/career-applications", careerApplicationRoutes);
app.use("/api/admin", adminRoutes);

// server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
