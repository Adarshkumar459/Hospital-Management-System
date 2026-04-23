import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, MapPin, GraduationCap, Briefcase, Clock, ArrowLeft } from 'lucide-react';
import PageState from '../components/PageState';
import { api } from '../lib/api';
import { getStoredUser } from '../lib/session';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const user = getStoredUser();

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setIsLoading(true);
        const data = await api.fetchDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  if (isLoading) {
    return <PageState title="Loading doctor profile..." description="Getting doctor details and available slots." />;
  }

  if (error) {
    return (
      <PageState
        title="Unable to load doctor"
        description={error}
        actionLabel="Back to Doctors"
        onAction={() => navigate('/doctors')}
      />
    );
  }

  if (!doctor) {
    return <PageState title="Doctor not found" actionLabel="Back to Doctors" onAction={() => navigate('/doctors')} />;
  }

  const handleBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: `/doctor/${id}` } });
      return;
    }
    if (selectedDate && selectedTime) {
      navigate('/book-appointment', {
        state: {
          doctor: doctor,
          date: selectedDate,
          time: selectedTime
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/doctors')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctors
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{doctor.rating}</span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {doctor.specialization}
                </Badge>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="text-sm">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-3 text-green-600" />
                    <span className="text-sm">{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-red-600" />
                    <span className="text-sm">Healthcare Center</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                  <p className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
              </CardContent>
            </Card>

            {/* Available Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Available Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {doctor.availableSlots.map((slot, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <p className="font-semibold text-gray-900">
                          {new Date(slot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {slot.times.map((time, timeIndex) => (
                          <Button
                            key={timeIndex}
                            variant={selectedDate === slot.date && selectedTime === time ? 'default' : 'outline'}
                            className={`${
                              selectedDate === slot.date && selectedTime === time
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'hover:border-blue-500'
                            }`}
                            onClick={() => {
                              setSelectedDate(slot.date);
                              setSelectedTime(time);
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 mb-2">
                      <span className="font-semibold">Selected:</span> {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBooking}
                >
                  {user ? 'Proceed to Book Appointment' : 'Login to Book Appointment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
