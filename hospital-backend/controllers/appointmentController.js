import { Appointment } from "../models/appointmentModel.js";
import { Doctor } from "../models/doctorModel.js";

// 📅 Book Appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, patientName, email, phone, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      patientDetails: {
        patientName,
        email,
        phone,
        reason
      }
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: await appointment.populate("doctor")
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get My Appointments (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor")
      .sort({ date: 1, createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Appointment is already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👨‍⚕️ Doctor Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate("patient");

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
