import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { HeartPulse, Brain, Bone, Baby, Sparkles, Stethoscope, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { doctors, services, testimonials } from '../mock/data';
import { api } from '../lib/api';

const iconMap = {
  'heart-pulse': HeartPulse,
  'brain': Brain,
  'bone': Bone,
  'baby': Baby,
  'sparkles': Sparkles,
  'stethoscope': Stethoscope
};

const Home = () => {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState(doctors.slice(0, 3));

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.fetchDoctors();
        setTopDoctors(data.slice(0, 3));
      } catch {
        setTopDoctors(doctors.slice(0, 3));
      }
    };

    loadDoctors();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Your Health, Our Priority
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Expert Medical Care
                <span className="text-blue-600"> When You Need It</span>
              </h1>
              <p className="text-lg text-gray-600">
                Access world-class healthcare with our team of experienced doctors. Book appointments online and get the care you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                  onClick={() => navigate('/doctors')}
                >
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/doctors')}
                >
                  Find a Doctor
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Expert Doctors</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">50k+</p>
                  <p className="text-sm text-gray-600">Happy Patients</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800"
                  alt="Healthcare"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Available</p>
                    <p className="text-sm text-gray-600">Emergency Care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comprehensive Healthcare Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a wide range of medical services to meet all your healthcare needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Card key={service.id} className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-br from-blue-100 to-green-100 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Meet Our Experts</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Top Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Highly qualified and experienced medical professionals dedicated to your health
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topDoctors.map((doctor) => (
              <Card key={doctor._id || doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(`/doctor/${doctor._id || doctor.id}`)}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-sm">{doctor.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                  <p className="text-gray-600 text-sm mb-4">{doctor.experience} years experience</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={() => navigate(`/doctor/${doctor._id || doctor.id}`)}>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className=' cursor-pointer' onClick={() => navigate('/doctors')}>
              View All Doctors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className=" bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from real patients about their healthcare experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Book your appointment today and experience world-class healthcare
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer " onClick={() => navigate('/doctors')}>
            Book Appointment Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

