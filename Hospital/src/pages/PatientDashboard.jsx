import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Clock, User, Mail, Phone, FileText, MapPin, LogOut } from 'lucide-react';
import PageState from '../components/PageState';
import { api } from '../lib/api';
import { clearSession, getStoredToken, getStoredUser } from '../lib/session';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      const currentUser = getStoredUser();
      const token = getStoredToken();

      if (!currentUser || !token) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        setUser(currentUser);
        const data = await api.fetchMyAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = getStoredToken();
      await api.cancelAppointment(token, appointmentId);
      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'booked');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  if (isLoading) {
    return <PageState title="Loading your dashboard..." description="Fetching your profile and appointments." />;
  }

  if (error && !user) {
    return <PageState title="Unable to load dashboard" description={error} actionLabel="Login Again" onAction={() => navigate('/login')} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-500">Patient ID: #{user._id}</p>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-green-600" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="font-semibold text-gray-900">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-semibold text-blue-600">{upcomingAppointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{pastAppointments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Appointments</CardTitle>
                  <Button onClick={() => navigate('/doctors')} className="bg-blue-600 hover:bg-blue-700">
                    Book New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
                <Tabs defaultValue="upcoming">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <Card key={appointment._id} className="border-2 border-gray-200 hover:border-blue-500 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={appointment.doctor.image}
                                  alt={appointment.doctor.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">{appointment.doctor.name}</h3>
                                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    {appointment.doctor.specialization}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Upcoming</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2 text-green-600" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                                Healthcare Center
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                                Fee: ${appointment.doctor.consultationFee}
                              </div>
                            </div>
                            {appointment.patientDetails?.reason && (
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-1">Reason for visit:</p>
                                <p className="text-sm text-gray-700">{appointment.patientDetails.reason}</p>
                              </div>
                            )}
                            <div className="mt-4 flex gap-3">
                              <Button variant="outline" size="sm" className="flex-1">
                                Reschedule
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700" onClick={() => handleCancelAppointment(appointment._id)}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No upcoming appointments</p>
                        <Button onClick={() => navigate('/doctors')} className="bg-blue-600 hover:bg-blue-700">
                          Book an Appointment
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4 mt-6">
                    {pastAppointments.length > 0 ? (
                      pastAppointments.map((appointment) => (
                        <Card key={appointment._id} className="border-2">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={appointment.doctor.image}
                                  alt={appointment.doctor.name}
                                  className="w-16 h-16 rounded-lg object-cover grayscale"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">{appointment.doctor.name}</h3>
                                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                    {appointment.doctor.specialization}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700">{appointment.status === 'cancelled' ? 'Cancelled' : 'Completed'}</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.time}
                              </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <Button variant="outline" size="sm" className="flex-1">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                Book Again
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No past appointments</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

