import React from "react";
import { CalendarClock, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  AdminSearchBar,
  AdminSectionHeader,
  AdminTableSkeleton,
  EmptyAdminState
} from "../../components/admin/AdminUi";
import { statusBadgeClass } from "../../components/admin/AdminConfig";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { getStoredToken } from "../../lib/session";

const AdminAppointments = () => {
  const token = getStoredToken();
  const { toast } = useToast();
  const [appointments, setAppointments] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    api
      .fetchAdminAppointments(token)
      .then((data) => setAppointments(data))
      .catch((error) => toast({ title: "Unable to load appointments", description: error.message }))
      .finally(() => setIsLoading(false));
  }, [token, toast]);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesQuery = [appointment.doctor?.name, appointment.patientDetails?.patientName, appointment.patient?.name]
      .some((field) => `${field || ""}`.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.date?.slice(0, 10) === dateFilter;
    return matchesQuery && matchesStatus && matchesDate;
  });

  const saveAppointment = async () => {
    try {
      const response = await api.updateAdminAppointment(token, selectedAppointment._id, {
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        status: selectedAppointment.status
      });
      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === selectedAppointment._id ? response.appointment : appointment
        )
      );
      setIsOpen(false);
      toast({ title: "Appointment updated", description: "Schedule changes saved successfully." });
    } catch (error) {
      toast({ title: "Update failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Appointments"
        title="Appointment management"
        description="Filter schedules by date or status, then reschedule, complete, or cancel appointments from a single table."
        action={
          <div className="flex flex-wrap gap-3">
            <AdminSearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by doctor or patient" />
            <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-auto rounded-2xl" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-2xl">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {isLoading ? (
        <AdminTableSkeleton rows={8} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyAdminState title="No appointments found" description="Adjust your filters or wait for new bookings to appear." />
      ) : (
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Schedule board</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-4 font-medium">Patient</th>
                  <th className="pb-4 font-medium">Doctor</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Time</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-4">
                      <p className="font-medium">{appointment.patientDetails?.patientName || appointment.patient?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.patientDetails?.email}</p>
                    </td>
                    <td className="py-4">
                      <p className="font-medium">{appointment.doctor?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.doctor?.specialization}</p>
                    </td>
                    <td className="py-4">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="py-4">{appointment.time}</td>
                    <td className="py-4">
                      <Badge className={`hover:bg-inherit ${statusBadgeClass(appointment.status)}`}>{appointment.status}</Badge>
                    </td>
                    <td className="py-4">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedAppointment({ ...appointment, date: appointment.date.slice(0, 10) }); setIsOpen(true); }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl rounded-[28px] dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Manage appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment ? (
            <div className="grid gap-4 p-6">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                <p><span className="font-medium">Patient:</span> {selectedAppointment.patientDetails?.patientName}</p>
                <p className="mt-1"><span className="font-medium">Doctor:</span> {selectedAppointment.doctor?.name}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={selectedAppointment.date} onChange={(event) => setSelectedAppointment((current) => ({ ...current, date: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input value={selectedAppointment.time} onChange={(event) => setSelectedAppointment((current) => ({ ...current, time: event.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedAppointment.status} onValueChange={(value) => setSelectedAppointment((current) => ({ ...current, status: value }))}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                <Button onClick={saveAppointment}>
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
