import React from "react";
import { LayoutGrid, List, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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

const emptyDoctor = {
  name: "",
  specialization: "",
  experience: 0,
  qualification: "",
  about: "",
  image: "",
  rating: 4.8,
  consultationFee: 0,
  availableSlots: []
};

const AdminDoctors = () => {
  const token = getStoredToken();
  const { toast } = useToast();
  const [doctors, setDoctors] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState("cards");
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(emptyDoctor);
  const [slotDraft, setSlotDraft] = React.useState({ date: "", times: "" });
  const [isLoading, setIsLoading] = React.useState(true);

  const loadDoctors = React.useCallback(async () => {
    setIsLoading(true);
    const data = await api.fetchDoctors();
    setDoctors(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadDoctors().catch((error) => {
      toast({ title: "Unable to load doctors", description: error.message });
      setIsLoading(false);
    });
  }, [loadDoctors, toast]);

  const filteredDoctors = doctors.filter((doctor) =>
    [doctor.name, doctor.specialization, doctor.qualification].some((field) =>
      `${field || ""}`.toLowerCase().includes(query.toLowerCase())
    )
  );

  const openCreate = () => {
    setFormData(emptyDoctor);
    setSlotDraft({ date: "", times: "" });
    setEditorOpen(true);
  };

  const openEdit = (doctor) => {
    setFormData({
      ...doctor,
      availableSlots: doctor.availableSlots || []
    });
    setSlotDraft({ date: "", times: "" });
    setEditorOpen(true);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addSlot = () => {
    if (!slotDraft.date || !slotDraft.times.trim()) return;
    setFormData((current) => ({
      ...current,
      availableSlots: [
        ...(current.availableSlots || []),
        {
          date: slotDraft.date,
          times: slotDraft.times.split(",").map((item) => item.trim()).filter(Boolean)
        }
      ]
    }));
    setSlotDraft({ date: "", times: "" });
  };

  const saveDoctor = async () => {
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
        rating: Number(formData.rating)
      };
      let response;
      if (formData._id) {
        response = await api.updateDoctor(token, formData._id, payload);
        setDoctors((current) => current.map((doctor) => (doctor._id === formData._id ? response.doctor : doctor)));
      } else {
        response = await api.createDoctor(token, payload);
        setDoctors((current) => [response.doctor, ...current]);
      }
      setEditorOpen(false);
      toast({ title: "Doctor saved", description: "Doctor profile updated successfully." });
    } catch (error) {
      toast({ title: "Save failed", description: error.message });
    }
  };

  const removeDoctor = async (doctorId) => {
    try {
      await api.deleteDoctor(token, doctorId);
      setDoctors((current) => current.filter((doctor) => doctor._id !== doctorId));
      toast({ title: "Doctor deleted", description: "Doctor profile removed from the roster." });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Doctors"
        title="Doctor management"
        description="Manage doctor profiles, images, specialization data, fees, and available appointment slots."
        action={
          <div className="flex flex-wrap gap-3">
            <AdminSearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctor or specialization" />
            <Button variant="outline" onClick={() => setViewMode((current) => (current === "cards" ? "table" : "cards"))}>
              {viewMode === "cards" ? <List className="mr-2 h-4 w-4" /> : <LayoutGrid className="mr-2 h-4 w-4" />}
              {viewMode === "cards" ? "Table view" : "Card view"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add doctor
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <AdminTableSkeleton rows={6} />
      ) : filteredDoctors.length === 0 ? (
        <EmptyAdminState title="No doctors available" description="Add the first doctor profile to begin managing the roster." />
      ) : viewMode === "cards" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor._id} className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="space-y-4 p-6">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-48 w-full rounded-3xl object-cover"
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
                  </div>
                  <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300">
                    ${doctor.consultationFee}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.qualification}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(doctor)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 text-rose-600" onClick={() => removeDoctor(doctor._id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="overflow-x-auto p-6">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-4 font-medium">Doctor</th>
                  <th className="pb-4 font-medium">Specialization</th>
                  <th className="pb-4 font-medium">Experience</th>
                  <th className="pb-4 font-medium">Fee</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-4 font-medium">{doctor.name}</td>
                    <td className="py-4">{doctor.specialization}</td>
                    <td className="py-4">{doctor.experience} years</td>
                    <td className="py-4">${doctor.consultationFee}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(doctor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-rose-600" onClick={() => removeDoctor(doctor._id)}>
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

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl rounded-[28px] dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{formData._id ? "Edit doctor" : "Add doctor"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-dashed border-slate-300 dark:border-slate-700">
                {formData.image ? (
                  <img src={formData.image} alt="Doctor preview" className="h-72 w-full object-cover" />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Upload doctor image
                  </div>
                )}
              </div>
              <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input value={formData.specialization} onChange={(event) => setFormData((current) => ({ ...current, specialization: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input type="number" value={formData.experience} onChange={(event) => setFormData((current) => ({ ...current, experience: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Consultation Fee</Label>
                  <Input type="number" value={formData.consultationFee} onChange={(event) => setFormData((current) => ({ ...current, consultationFee: event.target.value }))} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Qualification</Label>
                  <Input value={formData.qualification} onChange={(event) => setFormData((current) => ({ ...current, qualification: event.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>About</Label>
                <Textarea value={formData.about} onChange={(event) => setFormData((current) => ({ ...current, about: event.target.value }))} />
              </div>

              <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-medium">Availability</p>
                <div className="mt-3 grid gap-3 md:grid-cols-[180px_1fr_auto]">
                  <Input type="date" value={slotDraft.date} onChange={(event) => setSlotDraft((current) => ({ ...current, date: event.target.value }))} />
                  <Input value={slotDraft.times} onChange={(event) => setSlotDraft((current) => ({ ...current, times: event.target.value }))} placeholder="09:00 AM, 11:30 AM, 02:00 PM" />
                  <Button type="button" onClick={addSlot}>Add slot</Button>
                </div>
                <div className="mt-4 space-y-3">
                  {(formData.availableSlots || []).map((slot, index) => (
                    <div key={`${slot.date}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{slot.date}</p>
                          <p className="text-slate-500 dark:text-slate-400">{slot.times.join(", ")}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFormData((current) => ({
                              ...current,
                              availableSlots: current.availableSlots.filter((_, itemIndex) => itemIndex !== index)
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
                <Button onClick={saveDoctor}>Save doctor</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;
