import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import PageState from '../components/PageState';
import { api } from '../lib/api';
import { getStoredToken, getStoredUser } from '../lib/session';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { doctor, date, time } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const user = getStoredUser();

  React.useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      patientName: current.patientName || user.name || '',
      email: current.email || user.email || '',
      phone: current.phone || user.phone || ''
    }));
  }, [user]);

  if (!doctor || !date || !time) {
    return <PageState title="No appointment details found" actionLabel="Find a Doctor" onAction={() => navigate('/doctors')} />;
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName) newErrors.patientName = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.reason) newErrors.reason = 'Reason for visit is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsSubmitting(true);
        const token = getStoredToken();

        if (!token) {
          navigate('/login', { state: { from: `/doctor/${doctor._id}` } });
          return;
        }

        await api.bookAppointment(token, {
          doctorId: doctor._id,
          date,
          time,
          ...formData
        });

        setIsBooked(true);
        toast({
          title: 'Appointment Booked Successfully',
          description: `Your appointment with ${doctor.name} is confirmed.`
        });
      } catch (error) {
        toast({
          title: 'Booking Failed',
          description: error.message
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Doctor:</span> {doctor.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Time:</span> {time}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/dashboard')}>
                View My Appointments
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/doctor/${doctor._id}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctor Profile
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Book Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Appointment Summary */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-blue-600">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-900">{new Date(date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700">{time}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="text-xl font-bold text-gray-900">${doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Patient Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="patientName"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      />
                    </div>
                    {errors.patientName && <p className="text-sm text-red-600">{errors.patientName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="reason"
                        placeholder="Please describe your symptoms or reason for consultation..."
                        className="pl-10 min-h-24"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      />
                    </div>
                    {errors.reason && <p className="text-sm text-red-600">{errors.reason}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Confirming Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;

