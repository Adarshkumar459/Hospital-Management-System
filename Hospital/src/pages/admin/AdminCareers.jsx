import React from "react";
import { Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  AdminSectionHeader,
  AdminTableSkeleton,
  EmptyAdminState
} from "../../components/admin/AdminUi";
import { statusBadgeClass } from "../../components/admin/AdminConfig";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { getStoredToken } from "../../lib/session";

const AdminCareers = () => {
  const token = getStoredToken();
  const { toast } = useToast();
  const [applications, setApplications] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedApplication, setSelectedApplication] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadApplications = React.useCallback(async () => {
    setIsLoading(true);
    const data = await api.fetchCareerApplications(token, statusFilter);
    setApplications(data);
    setIsLoading(false);
  }, [statusFilter, token]);

  React.useEffect(() => {
    loadApplications().catch((error) => {
      toast({ title: "Unable to load applications", description: error.message });
      setIsLoading(false);
    });
  }, [loadApplications, toast]);

  const updateApplication = async (payload) => {
    try {
      const response = await api.updateCareerApplication(token, selectedApplication._id, payload);
      setApplications((current) =>
        current.map((application) =>
          application._id === selectedApplication._id ? response.application : application
        )
      );
      setSelectedApplication(response.application);
      toast({ title: "Application updated", description: "Candidate decision saved." });
    } catch (error) {
      toast({ title: "Update failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Career applications"
        title="Applicant pipeline"
        description="Review doctor applications, inspect resumes, and move candidates through acceptance or rejection."
        action={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] rounded-2xl">
              <SelectValue placeholder="Filter applications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All applications</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <AdminTableSkeleton rows={6} />
      ) : applications.length === 0 ? (
        <EmptyAdminState title="No applications found" description="New doctor applicants will appear here after submission." />
      ) : (
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Applications list</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-4 font-medium">Applicant</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Department</th>
                  <th className="pb-4 font-medium">Resume</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-4">
                      <p className="font-medium">{application.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{application.email}</p>
                    </td>
                    <td className="py-4">{application.position}</td>
                    <td className="py-4">{application.department || "-"}</td>
                    <td className="py-4">
                      {application.resume ? (
                        <a href={application.resume} target="_blank" rel="noreferrer" className="text-sky-600 underline">
                          View resume
                        </a>
                      ) : (
                        "Not attached"
                      )}
                    </td>
                    <td className="py-4">
                      <Badge className={`hover:bg-inherit ${statusBadgeClass(application.status)}`}>{application.status}</Badge>
                    </td>
                    <td className="py-4">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedApplication(application); setIsOpen(true); }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Review
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
        <DialogContent className="max-w-3xl rounded-[28px] dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Applicant details</DialogTitle>
          </DialogHeader>
          {selectedApplication ? (
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-4 rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Applicant</p>
                  <p className="text-xl font-semibold">{selectedApplication.name}</p>
                  <p className="text-sm">{selectedApplication.email}</p>
                  <p className="text-sm">{selectedApplication.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Applied role</p>
                  <p className="font-medium">{selectedApplication.position}</p>
                  <p className="text-sm">{selectedApplication.department || "General"}</p>
                </div>
                {selectedApplication.resume ? (
                  <a href={selectedApplication.resume} target="_blank" rel="noreferrer" className="inline-flex items-center text-sky-600 underline">
                    <FileText className="mr-2 h-4 w-4" />
                    Open resume
                  </a>
                ) : null}
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Cover letter</Label>
                  <Textarea value={selectedApplication.coverLetter || ""} disabled className="mt-2 min-h-40" />
                </div>
                <div>
                  <Label>Internal notes</Label>
                  <Textarea
                    value={selectedApplication.notes || ""}
                    onChange={(event) => setSelectedApplication((current) => ({ ...current, notes: event.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" onClick={() => updateApplication({ status: "reviewing", notes: selectedApplication.notes })}>Mark reviewing</Button>
                  <Button variant="outline" className="text-rose-600" onClick={() => updateApplication({ status: "rejected", notes: selectedApplication.notes })}>Reject</Button>
                  <Button onClick={() => updateApplication({ status: "accepted", notes: selectedApplication.notes })}>Accept</Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCareers;
