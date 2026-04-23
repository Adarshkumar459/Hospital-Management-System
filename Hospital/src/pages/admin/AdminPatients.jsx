import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  AdminSearchBar,
  AdminSectionHeader,
  AdminTableSkeleton,
  EmptyAdminState
} from "../../components/admin/AdminUi";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { getStoredToken } from "../../lib/session";

const AdminPatients = () => {
  const token = getStoredToken();
  const { toast } = useToast();
  const [patients, setPatients] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [mode, setMode] = React.useState("view");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadPatients = React.useCallback(async () => {
    setIsLoading(true);
    const data = await api.fetchPatients(token);
    setPatients(data);
    setIsLoading(false);
  }, [token]);

  React.useEffect(() => {
    loadPatients().catch((error) => {
      toast({ title: "Unable to load patients", description: error.message });
      setIsLoading(false);
    });
  }, [loadPatients, toast]);

  const filteredPatients = patients.filter((patient) =>
    [patient.name, patient.email, patient.phone].some((field) =>
      `${field || ""}`.toLowerCase().includes(query.toLowerCase())
    )
  );

  const handleSave = async () => {
    try {
      const response = await api.updatePatient(token, selectedPatient._id, {
        name: selectedPatient.name,
        email: selectedPatient.email,
        phone: selectedPatient.phone
      });
      setPatients((current) =>
        current.map((patient) => (patient._id === selectedPatient._id ? response.patient : patient))
      );
      setIsOpen(false);
      toast({ title: "Patient updated", description: "Patient profile saved successfully." });
    } catch (error) {
      toast({ title: "Update failed", description: error.message });
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await api.deletePatient(token, patientId);
      setPatients((current) => current.filter((patient) => patient._id !== patientId));
      toast({ title: "Patient deleted", description: "Patient and linked appointments were removed." });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Patients"
        title="Patient management"
        description="Search, review, edit, and remove patient records while keeping appointment context visible."
        action={<AdminSearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient name, email, phone" />}
      />

      {isLoading ? (
        <AdminTableSkeleton rows={8} />
      ) : filteredPatients.length === 0 ? (
        <EmptyAdminState title="No patients found" description="Try another search term or add patients through signup." />
      ) : (
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-4 font-medium">Patient</th>
                  <th className="pb-4 font-medium">Phone</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 font-medium">Appointments</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-4">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{patient.email}</p>
                    </td>
                    <td className="py-4">{patient.phone || "-"}</td>
                    <td className="py-4">{new Date(patient.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300">
                        {patient.appointmentCount}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedPatient({ ...patient }); setMode("view"); setIsOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedPatient({ ...patient }); setMode("edit"); setIsOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-rose-600" onClick={() => handleDelete(patient._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-[28px] dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Edit patient" : "Patient details"}</DialogTitle>
          </DialogHeader>
          {selectedPatient ? (
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={selectedPatient.name}
                  disabled={mode !== "edit"}
                  onChange={(event) => setSelectedPatient((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedPatient.email}
                  disabled={mode !== "edit"}
                  onChange={(event) => setSelectedPatient((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={selectedPatient.phone || ""}
                  disabled={mode !== "edit"}
                  onChange={(event) => setSelectedPatient((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Joined</Label>
                <Input value={new Date(selectedPatient.createdAt).toLocaleString()} disabled />
              </div>
              {mode === "edit" ? (
                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save changes</Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPatients;
