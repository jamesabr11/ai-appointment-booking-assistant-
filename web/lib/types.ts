export interface Booking {
  id: string
  customerName: string
  phone: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  source: 'AI Voice Assistant' | 'Website Form'
  notes?: string
  createdAt: string
}

export interface Barber {
  id: string
  name: string
  specialty: string
  image?: string
}

export interface Service {
  id: string
  name: string
  price: number
  description: string
  duration: string
}

export const services: Service[] = [
  { id: '1', name: 'Fresh Fade', price: 35, description: 'Sharp skin fades with seamless blending', duration: '45 min' },
  { id: '2', name: 'Classic Cut', price: 30, description: 'Traditional scissor cuts with modern precision', duration: '30 min' },
  { id: '3', name: 'Beard Trim', price: 20, description: 'Shape and groom your beard to perfection', duration: '20 min' },
  { id: '4', name: 'Line Up', price: 15, description: 'Crisp hairline edges and clean definition', duration: '15 min' },
  { id: '5', name: 'Hair + Beard Combo', price: 50, description: 'Complete grooming package for the modern man', duration: '60 min' },
  { id: '6', name: 'Student Cut', price: 25, description: 'Quality cuts at student-friendly prices', duration: '30 min' },
]

export const barbers: Barber[] = [
  { id: '1', name: 'James', specialty: 'Beard & Lineup Expert' },
  { id: '2', name: 'Nick', specialty: 'Fade Specialist' },
  { id: '3', name: 'Ahmad', specialty: 'Classic Cuts' },
]

export const sampleBookings: Booking[] = [
  {
    id: '1',
    customerName: 'Jonathan',
    phone: '250-123-1736',
    service: 'Fresh Fade',
    date: '2026-05-09',
    time: '3:00 PM',
    status: 'confirmed',
    source: 'AI Voice Assistant',
    notes: '',
    createdAt: '2026-05-07T10:00:00Z',
  },
  {
    id: '2',
    customerName: 'Mike',
    phone: '604-555-4412',
    service: 'Beard Trim',
    date: '2026-05-12',
    time: '11:30 AM',
    status: 'pending',
    source: 'Website Form',
    notes: 'First time customer',
    createdAt: '2026-05-08T14:30:00Z',
  },
  {
    id: '3',
    customerName: 'Sarah',
    phone: '778-123-9090',
    service: 'Line Up',
    date: '2026-05-14',
    time: '2:00 PM',
    status: 'confirmed',
    source: 'AI Voice Assistant',
    createdAt: '2026-05-09T09:15:00Z',
  },
  {
    id: '4',
    customerName: 'Alex',
    phone: '236-555-8821',
    service: 'Hair + Beard Combo',
    date: '2026-05-15',
    time: '4:30 PM',
    status: 'completed',
    source: 'AI Voice Assistant',
    createdAt: '2026-05-08T11:00:00Z',
  },
  {
    id: '5',
    customerName: 'David',
    phone: '604-123-7890',
    service: 'Classic Cut',
    date: '2026-05-09',
    time: '10:00 AM',
    status: 'confirmed',
    source: 'Website Form',
    createdAt: '2026-05-07T16:00:00Z',
  },
  {
    id: '6',
    customerName: 'Chris',
    phone: '778-555-1234',
    service: 'Student Cut',
    date: '2026-05-09',
    time: '1:00 PM',
    status: 'pending',
    source: 'AI Voice Assistant',
    createdAt: '2026-05-09T08:00:00Z',
  },
  {
    id: '7',
    customerName: 'James',
    phone: '250-999-4567',
    service: 'Fresh Fade',
    date: '2026-05-10',
    time: '11:00 AM',
    status: 'confirmed',
    source: 'AI Voice Assistant',
    createdAt: '2026-05-09T07:30:00Z',
  },
  {
    id: '8',
    customerName: 'Ryan',
    phone: '604-888-3210',
    service: 'Beard Trim',
    date: '2026-05-11',
    time: '3:30 PM',
    status: 'confirmed',
    source: 'Website Form',
    createdAt: '2026-05-09T12:00:00Z',
  },
]
