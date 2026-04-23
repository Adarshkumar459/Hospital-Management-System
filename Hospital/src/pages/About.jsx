import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { HeartPulse, Award, Users, Clock } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: HeartPulse,
      title: 'Patient-Centered Care',
      description: 'We put our patients first, ensuring compassionate and personalized healthcare for everyone.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards of medical care with continuous improvement and innovation.'
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Our collaborative approach brings together the best medical professionals for optimal outcomes.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock emergency services and support whenever you need us.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">About Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Leading Healthcare Excellence</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            HealthCare+ has been serving our community for over 25 years, providing world-class medical care with compassion and excellence. Our team of dedicated healthcare professionals is committed to improving the health and well-being of every patient we serve.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
              <p className="text-gray-600">Expert Doctors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">50k+</p>
              <p className="text-gray-600">Happy Patients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">25+</p>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600 mb-2">98%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Values</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do, ensuring the best possible care for our patients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-br from-blue-100 to-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 bg-white lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200 hover:border-blue-500 transition-colors">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To provide comprehensive, patient-centered healthcare services that improve the quality of life for individuals and families in our community. We are committed to:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Delivering the highest quality medical care using advanced technology and evidence-based practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Treating every patient with dignity, respect, and compassion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Fostering a culture of continuous learning and innovation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Building lasting relationships with our patients and community</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;

