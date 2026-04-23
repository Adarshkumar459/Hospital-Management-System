const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildHeaders = (token, hasBody = false) => {
  const headers = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  registerUser: async (payload) =>
    request("/auth/register", {
      method: "POST",
      headers: buildHeaders(null, true),
      body: JSON.stringify(payload)
    }),

  loginUser: async (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: buildHeaders(null, true),
      body: JSON.stringify(payload)
    }),

  fetchProfile: async (token) =>
    request("/auth/profile", {
      headers: buildHeaders(token)
    }),

  fetchDoctors: async () => request("/doctors"),

  fetchDoctorById: async (doctorId) => request(`/doctors/${doctorId}`),

  bookAppointment: async (token, payload) =>
    request("/appointments/book", {
      method: "POST",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  fetchMyAppointments: async (token) =>
    request("/appointments/my", {
      headers: buildHeaders(token)
    }),

  cancelAppointment: async (token, appointmentId) =>
    request(`/appointments/cancel/${appointmentId}`, {
      method: "PUT",
      headers: buildHeaders(token)
    }),

  fetchDepartments: async () => request("/departments"),

  createDepartment: async (token, payload) =>
    request("/departments", {
      method: "POST",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  updateDepartment: async (token, departmentId, payload) =>
    request(`/departments/${departmentId}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  deleteDepartment: async (token, departmentId) =>
    request(`/departments/${departmentId}`, {
      method: "DELETE",
      headers: buildHeaders(token)
    }),

  createDoctor: async (token, payload) =>
    request("/doctors/add", {
      method: "POST",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  updateDoctor: async (token, doctorId, payload) =>
    request(`/doctors/${doctorId}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  deleteDoctor: async (token, doctorId) =>
    request(`/doctors/${doctorId}`, {
      method: "DELETE",
      headers: buildHeaders(token)
    }),

  submitCareerApplication: async (payload) =>
    request("/career-applications", {
      method: "POST",
      headers: buildHeaders(null, true),
      body: JSON.stringify(payload)
    }),

  fetchCareerApplications: async (token, status = "all") =>
    request(`/career-applications?status=${encodeURIComponent(status)}`, {
      headers: buildHeaders(token)
    }),

  updateCareerApplication: async (token, applicationId, payload) =>
    request(`/career-applications/${applicationId}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  fetchAdminDashboard: async (token) =>
    request("/admin/dashboard", {
      headers: buildHeaders(token)
    }),

  fetchAdminMeta: async (token) =>
    request("/admin/meta", {
      headers: buildHeaders(token)
    }),

  fetchPatients: async (token) =>
    request("/admin/patients", {
      headers: buildHeaders(token)
    }),

  updatePatient: async (token, patientId, payload) =>
    request(`/admin/patients/${patientId}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    }),

  deletePatient: async (token, patientId) =>
    request(`/admin/patients/${patientId}`, {
      method: "DELETE",
      headers: buildHeaders(token)
    }),

  fetchAdminAppointments: async (token) =>
    request("/admin/appointments", {
      headers: buildHeaders(token)
    }),

  updateAdminAppointment: async (token, appointmentId, payload) =>
    request(`/admin/appointments/${appointmentId}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: JSON.stringify(payload)
    })
};
