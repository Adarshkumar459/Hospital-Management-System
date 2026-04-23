import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@healthcareplus.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Hospital Admin",
      email: adminEmail,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin"
    });
    console.log(`Seeded admin account: ${adminEmail}`);
  }
};
