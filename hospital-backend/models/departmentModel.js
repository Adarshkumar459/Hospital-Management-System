import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "Stethoscope"
    },
    head: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
