import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    times: [
      {
        type: String,
        required: true
      }
    ]
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualification: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    default: 4.8
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableSlots: {
    type: [availabilitySchema],
    default: []
  }
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);
