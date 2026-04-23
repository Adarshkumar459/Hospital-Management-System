import { Appointment } from "../models/appointmentModel.js";
import { CareerApplication } from "../models/careerApplicationModel.js";
import { Department } from "../models/departmentModel.js";
import { Doctor } from "../models/doctorModel.js";
import { User } from "../models/userModel.js";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [patients, doctors, appointmentsToday, monthAppointments, allAppointments, departments] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      Doctor.countDocuments(),
      Appointment.countDocuments({ date: { $gte: startOfToday, $lt: endOfToday } }),
      Appointment.find({ createdAt: { $gte: startOfMonth }, status: { $ne: "cancelled" } }).populate("doctor"),
      Appointment.find({ status: { $ne: "cancelled" } }).populate("doctor"),
      Department.find().sort({ name: 1 })
    ]);

    const revenue = monthAppointments.reduce(
      (sum, appointment) => sum + (appointment.doctor?.consultationFee || 0),
      0
    );

    const patientGrowth = [];
    for (let index = 5; index >= 0; index -= 1) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const nextMonthDate = new Date(today.getFullYear(), today.getMonth() - index + 1, 1);
      const count = await User.countDocuments({
        role: "patient",
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });
      patientGrowth.push({
        label: monthLabels[monthDate.getMonth()],
        value: count
      });
    }

    const departmentVisitsMap = new Map();
    allAppointments.forEach((appointment) => {
      const key = appointment.doctor?.specialization || "General";
      departmentVisitsMap.set(key, (departmentVisitsMap.get(key) || 0) + 1);
    });

    const departmentVisits = (departments.length > 0 ? departments.map((department) => ({
      label: department.name,
      value: departmentVisitsMap.get(department.name) || 0
    })) : Array.from(departmentVisitsMap.entries()).map(([label, value]) => ({ label, value })));

    const todaysAppointments = await Appointment.find({
      date: { $gte: startOfToday, $lt: endOfToday }
    })
      .populate("doctor")
      .populate("patient", "name email phone")
      .sort({ time: 1 });

    res.status(200).json({
      stats: {
        totalPatients: patients,
        activeDoctors: doctors,
        appointmentsToday,
        revenueThisMonth: revenue
      },
      charts: {
        patientGrowth,
        departmentVisits
      },
      todaysAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });
    const appointments = await Appointment.find().select("patient status");

    const appointmentCountMap = appointments.reduce((map, appointment) => {
      const patientId = appointment.patient?.toString();
      if (!patientId) return map;
      map.set(patientId, (map.get(patientId) || 0) + 1);
      return map;
    }, new Map());

    res.status(200).json(
      patients.map((patient) => ({
        ...patient.toObject(),
        appointmentCount: appointmentCountMap.get(patient._id.toString()) || 0
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: "patient" },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await User.findOneAndDelete({ _id: req.params.id, role: "patient" });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await Appointment.deleteMany({ patient: req.params.id });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor")
      .populate("patient", "name email phone")
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("doctor")
      .populate("patient", "name email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminMeta = async (req, res) => {
  try {
    const [departments, applications] = await Promise.all([
      Department.find().sort({ name: 1 }),
      CareerApplication.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      departments,
      recentApplications: applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
