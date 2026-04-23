import { Department } from "../models/departmentModel.js";
import { Doctor } from "../models/doctorModel.js";
import { seedDepartments } from "../data/seedDepartments.js";
import { seedDoctors } from "../data/seedDoctors.js";

export const seedDatabase = async () => {
  const doctorCount = await Doctor.countDocuments();
  const departmentCount = await Department.countDocuments();

  if (doctorCount === 0) {
    await Doctor.insertMany(seedDoctors);
    console.log("Seeded default doctors");
  }

  if (departmentCount === 0) {
    await Department.insertMany(seedDepartments);
    console.log("Seeded default departments");
  }
};
