export const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    qualification: 'MBBS, MD (Cardiology)',
    about: 'Specialist in heart diseases with over 15 years of experience in treating complex cardiac conditions.',
    consultationFee: 500,
    availableSlots: [
      { date: '2025-07-15', times: ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2025-07-16', times: ['09:00 AM', '11:00 AM', '03:00 PM'] },
      { date: '2025-07-17', times: ['10:00 AM', '02:00 PM', '04:00 PM', '05:00 PM'] }
    ]
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    experience: 12,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    qualification: 'MBBS, MD (Neurology)',
    about: 'Expert in treating neurological disorders including epilepsy, stroke, and movement disorders.',
    consultationFee: 600,
    availableSlots: [
      { date: '2025-07-15', times: ['09:30 AM', '11:00 AM', '03:00 PM'] },
      { date: '2025-07-16', times: ['10:00 AM', '02:00 PM', '04:00 PM'] }
    ]
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Orthopedic',
    experience: 10,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    qualification: 'MBBS, MS (Orthopedics)',
    about: 'Specialized in joint replacement surgery and sports injury treatment.',
    consultationFee: 450,
    availableSlots: [
      { date: '2025-07-15', times: ['10:00 AM', '01:00 PM', '03:00 PM'] },
      { date: '2025-07-17', times: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] }
    ]
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialization: 'Pediatrician',
    experience: 18,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    qualification: 'MBBS, MD (Pediatrics)',
    about: 'Caring for children\'s health with extensive experience in child development and pediatric care.',
    consultationFee: 400,
    availableSlots: [
      { date: '2025-07-15', times: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
      { date: '2025-07-16', times: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] }
    ]
  },
  {
    id: 5,
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    experience: 8,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    qualification: 'MBBS, MD (Dermatology)',
    about: 'Expert in skin care, cosmetic procedures, and treatment of skin diseases.',
    consultationFee: 350,
    availableSlots: [
      { date: '2025-07-16', times: ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'] },
      { date: '2025-07-17', times: ['09:00 AM', '11:00 AM', '03:00 PM'] }
    ]
  },
  {
    id: 6,
    name: 'Dr. Robert Taylor',
    specialization: 'General Physician',
    experience: 20,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    qualification: 'MBBS, MD (General Medicine)',
    about: 'Experienced general physician providing comprehensive healthcare for all age groups.',
    consultationFee: 300,
    availableSlots: [
      { date: '2025-07-15', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { date: '2025-07-16', times: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { date: '2025-07-17', times: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] }
    ]
  }
];

export const services = [
  {
    id: 1,
    name: 'Cardiology',
    description: 'Expert heart care and treatment',
    icon: 'heart-pulse'
  },
  {
    id: 2,
    name: 'Neurology',
    description: 'Brain and nervous system care',
    icon: 'brain'
  },
  {
    id: 3,
    name: 'Orthopedics',
    description: 'Bone and joint specialists',
    icon: 'bone'
  },
  {
    id: 4,
    name: 'Pediatrics',
    description: 'Specialized child healthcare',
    icon: 'baby'
  },
  {
    id: 5,
    name: 'Dermatology',
    description: 'Skin care and treatment',
    icon: 'sparkles'
  },
  {
    id: 6,
    name: 'General Medicine',
    description: 'Comprehensive health care',
    icon: 'stethoscope'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'John Anderson',
    text: 'Excellent care and professional staff. Dr. Johnson helped me recover from my heart condition.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    text: 'Very impressed with the quick appointment booking and the quality of treatment I received.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    id: 3,
    name: 'David Lee',
    text: 'The staff is caring and the doctors are highly skilled. Highly recommend this hospital.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
  }
];

export const careers = [
  {
    id: 1,
    position: 'Senior Cardiologist',
    location: 'New York, NY',
    type: 'Full-time',
    department: 'Cardiology',
    description: 'We are looking for an experienced cardiologist to join our team.'
  },
  {
    id: 2,
    position: 'Registered Nurse',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    department: 'General',
    description: 'Seeking compassionate and skilled registered nurses.'
  },
  {
    id: 3,
    position: 'Medical Receptionist',
    location: 'Chicago, IL',
    type: 'Part-time',
    department: 'Administration',
    description: 'Front desk position for patient coordination and scheduling.'
  },
  {
    id: 4,
    position: 'Lab Technician',
    location: 'Houston, TX',
    type: 'Full-time',
    department: 'Laboratory',
    description: 'Experienced lab technician for diagnostic testing.'
  }
];

// Helper functions for local storage
export const getStoredAppointments = () => {
  const stored = localStorage.getItem('appointments');
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointment = (appointment) => {
  const appointments = getStoredAppointments();
  const newAppointment = {
    ...appointment,
    id: Date.now(),
    status: 'upcoming',
    bookingDate: new Date().toISOString()
  };
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  return newAppointment;
};

export const getStoredUser = () => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
};

export const saveUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

