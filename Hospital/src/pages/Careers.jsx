import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Briefcase, MapPin, Clock, Building, CheckCircle2 } from 'lucide-react';
import { careers } from '../mock/data';
import { useToast } from '../hooks/use-toast';
import { api } from '../lib/api';


const Careers = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: ''
  });

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
    setIsSubmitted(false);
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, resume: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitCareerApplication({
        jobId: `${selectedJob?.id}`,
        position: selectedJob?.position,
        department: selectedJob?.department,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        resume: formData.resume
      });
      setIsSubmitted(true);
      toast({
        title: 'Application Submitted',
        description: 'We will review your application and get back to you soon.'
      });
      setTimeout(() => {
        setIsDialogOpen(false);
        setFormData({ name: '', email: '', phone: '', coverLetter: '', resume: '' });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a healthcare team that makes a difference in people's lives
          </p>
          <div className="flex items-center justify-center space-x-8 text-white">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-blue-100">Team Members</p>
            </div>
            <div className="h-12 w-px bg-blue-400"></div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-blue-100">Specializations</p>
            </div>
            <div className="h-12 w-px bg-blue-400"></div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-blue-100">Patient Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h2>
            <p className="text-gray-600">Explore career opportunities at HealthCare+</p>
          </div>

          <div className="space-y-6">
            {careers.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.position}</h3>
                          <div className="flex flex-wrap gap-3 mb-3">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              <Building className="h-3 w-3 mr-1" />
                              {job.department}
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.location}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{job.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:ml-6">
                      <Button 
                        onClick={() => handleApply(job)}
                        className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] px-4 mt-4 pb-6 overflow-y-auto">
          {!isSubmitted ? (
            <>
              <DialogHeader className=' flex justify-between items-center'>
                <DialogTitle className="text-2xl">Apply for {selectedJob?.position}</DialogTitle>
            
                     <button
                     onClick={() => setIsDialogOpen(false)} // or your dialog state function
                      className=" top-4  text-gray-500 hover:text-red-500 text-xl font-bold">
                        ✕
                     </button>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're interested in this position..."
                    className="min-h-32"
                    required
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV *</Label>
                  <Input id="resume" type="file" accept=".pdf,.doc,.docx,image/*" required onChange={handleResumeUpload} />
                </div>
                <Button type="submit" className="w-full mb-4 bg-blue-600 hover:bg-blue-700" size="lg">
                  Submit Application
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600">Thank you for your interest. We'll be in touch soon.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Careers;


