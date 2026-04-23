import mongoose from "mongoose";

const patientDetailsSchema = new mongoose.Schema(
  {
    patientName: {
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
    reason: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  patientDetails: {
    type: patientDetailsSchema,
    required: true
  },
  status: {
    type: String,
    enum: ["booked", "completed", "cancelled"],
    default: "booked"
  }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
