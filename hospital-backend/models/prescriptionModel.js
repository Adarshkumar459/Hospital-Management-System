import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
  medicines: [
    {
      name: String,
      dosage: String
    }
  ],
  notes: {
    type: String
  }
}, { timestamps: true });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);