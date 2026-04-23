import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    coverLetter: {
      type: String,
      default: ""
    },
    resume: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "accepted", "rejected"],
      default: "new"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const CareerApplication = mongoose.model("CareerApplication", careerApplicationSchema);
