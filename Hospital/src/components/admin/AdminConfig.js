import {
  BriefcaseMedical,
  Building2,
  CalendarClock,
  LayoutDashboard,
  Stethoscope,
  Users
} from "lucide-react";

export const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Patients", icon: Users, path: "/admin/patients" },
  { label: "Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Departments", icon: Building2, path: "/admin/departments" },
  { label: "Appointments", icon: CalendarClock, path: "/admin/appointments" },
  { label: "Careers", icon: BriefcaseMedical, path: "/admin/careers" }
];

export function statusBadgeClass(status) {
  const key = `${status}`.toLowerCase();
  if (key === "accepted" || key === "completed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  if (key === "reviewing" || key === "booked") return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
  if (key === "cancelled" || key === "rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
}
