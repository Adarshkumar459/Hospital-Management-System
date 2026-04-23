import { Prescription } from "../models/prescriptionModel.js";

// 👨‍⚕️ Add Prescription (Doctor)
export const addPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, notes } = req.body;

    const prescription = await Prescription.create({
      doctor: req.user._id,
      patient: patientId,
      appointment: appointmentId,
      medicines,
      notes
    });

    res.status(201).json({
      message: "Prescription added",
      prescription
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Patient View Prescriptions
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("doctor")
      .populate("appointment");

    res.status(200).json(prescriptions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};