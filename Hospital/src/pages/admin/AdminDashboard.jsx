import React from "react";
import { CalendarDays, DollarSign, Stethoscope, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import PageState from "../../components/PageState";
import {
  AdminSectionHeader,
  AdminStatCard,
  AdminTableSkeleton,
  SimpleBarChart,
  SimpleLineChart
} from "../../components/admin/AdminUi";
import { statusBadgeClass } from "../../components/admin/AdminConfig";
import { api } from "../../lib/api";
import { getStoredToken } from "../../lib/session";

const AdminDashboard = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dashboard = await api.fetchAdminDashboard(getStoredToken());
        setData(dashboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) return <AdminTableSkeleton rows={6} />;
  if (error) return <PageState title="Unable to load admin dashboard" description={error} />;

  const stats = data?.stats || {};
  const todaysAppointments = data?.todaysAppointments || [];

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Operations overview"
        title="Clinical performance at a glance"
        description="Track hospital throughput, staffing, appointments, and patient demand in real time."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Patients" value={stats.totalPatients} delta="+12% this month" icon={Users} tone="blue" />
        <AdminStatCard label="Active Doctors" value={stats.activeDoctors} delta="Roster stable" icon={Stethoscope} tone="green" />
        <AdminStatCard label="Appointments Today" value={stats.appointmentsToday} delta="Live schedule" icon={CalendarDays} tone="amber" />
        <AdminStatCard label="Revenue This Month" value={`$${stats.revenueThisMonth || 0}`} delta="+8.4% from last month" icon={DollarSign} tone="violet" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Patient Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={data?.charts?.patientGrowth || []} />
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Department Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={data?.charts?.departmentVisits || []} />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-4 font-medium">Patient</th>
                <th className="pb-4 font-medium">Doctor</th>
                <th className="pb-4 font-medium">Time</th>
                <th className="pb-4 font-medium">Reason</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-4">
                    <p className="font-medium">{appointment.patientDetails?.patientName || appointment.patient?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.patientDetails?.email || appointment.patient?.email}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{appointment.doctor?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.doctor?.specialization}</p>
                  </td>
                  <td className="py-4">{appointment.time}</td>
                  <td className="py-4">{appointment.patientDetails?.reason || "General consultation"}</td>
                  <td className="py-4">
                    <Badge className={`hover:bg-inherit ${statusBadgeClass(appointment.status)}`}>{appointment.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
