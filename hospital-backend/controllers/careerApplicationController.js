import { CareerApplication } from "../models/careerApplicationModel.js";

export const submitCareerApplication = async (req, res) => {
  try {
    const application = await CareerApplication.create(req.body);

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCareerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== "all" ? { status } : {};
    const applications = await CareerApplication.find(query).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCareerApplication = async (req, res) => {
  try {
    const application = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application updated successfully",
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
