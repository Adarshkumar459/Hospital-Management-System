import React from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  AdminSectionHeader,
  AdminTableSkeleton,
  EmptyAdminState
} from "../../components/admin/AdminUi";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { getStoredToken } from "../../lib/session";

const emptyDepartment = {
  name: "",
  description: "",
  icon: "Stethoscope",
  head: "",
  location: ""
};

const AdminDepartments = () => {
  const token = getStoredToken();
  const { toast } = useToast();
  const [departments, setDepartments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(emptyDepartment);

  React.useEffect(() => {
    api
      .fetchDepartments()
      .then((data) => setDepartments(data))
      .catch((error) => toast({ title: "Unable to load departments", description: error.message }))
      .finally(() => setIsLoading(false));
  }, [toast]);

  const saveDepartment = async () => {
    try {
      if (formData._id) {
        const response = await api.updateDepartment(token, formData._id, formData);
        setDepartments((current) =>
          current.map((department) => (department._id === formData._id ? response.department : department))
        );
      } else {
        const response = await api.createDepartment(token, formData);
        setDepartments((current) => [...current, response.department]);
      }
      setIsOpen(false);
      setFormData(emptyDepartment);
      toast({ title: "Department saved", description: "Department changes were saved successfully." });
    } catch (error) {
      toast({ title: "Save failed", description: error.message });
    }
  };

  const removeDepartment = async (departmentId) => {
    try {
      await api.deleteDepartment(token, departmentId);
      setDepartments((current) => current.filter((department) => department._id !== departmentId));
      toast({ title: "Department deleted", description: "Department removed from the admin panel." });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Departments"
        title="Department management"
        description="Organize specialties, department leads, and locations from a clean grid-based operations view."
        action={
          <Button onClick={() => { setFormData(emptyDepartment); setIsOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add department
          </Button>
        }
      />

      {isLoading ? (
        <AdminTableSkeleton rows={4} />
      ) : departments.length === 0 ? (
        <EmptyAdminState title="No departments yet" description="Create your first department to structure the hospital network." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <Card key={department._id} className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 p-4 text-white shadow-lg shadow-sky-500/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setFormData(department); setIsOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-rose-600" onClick={() => removeDepartment(department._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{department.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{department.description}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                  <p><span className="font-medium">Head:</span> {department.head || "Not assigned"}</p>
                  <p className="mt-1"><span className="font-medium">Location:</span> {department.location || "TBD"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-[28px] dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{formData._id ? "Edit department" : "Add department"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 p-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Department head</Label>
                <Input value={formData.head} onChange={(event) => setFormData((current) => ({ ...current, head: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={saveDepartment}>Save department</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDepartments;
