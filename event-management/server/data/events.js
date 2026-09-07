// In-memory event data store. Resets on server restart — fine for a demo/competition build.

let events = [
  {
    id: 'evt-001',
    title: 'TechForward Summit 2026',
    description:
      'A full-day summit bringing together engineers, founders, and researchers to explore the future of AI, cloud infrastructure, and developer tooling. Includes keynotes, live demos, and a networking mixer.',
    category: 'Technology',
    date: '2026-10-14',
    endDate: '2026-10-14',
    startTime: '09:00',
    endTime: '18:00',
    venue: 'Grand Hyatt Convention Center',
    address: 'DLF Cyber City, Gurugram, Haryana',
    city: 'Gurugram',
    capacity: 400,
    registered: 356,
    price: 1499,
    isFree: false,
    organizer: 'TechForward Collective',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'Cloud', 'Networking'],
    featured: true,
  },
  {
    id: 'evt-002',
    title: 'Riverside Jazz & Soul Festival',
    description:
      'An open-air evening of live jazz, soul, and blues from acclaimed regional artists, with food trucks and craft beverages along the riverside promenade.',
    category: 'Music',
    date: '2026-09-27',
    endDate: '2026-09-27',
    startTime: '17:00',
    endTime: '23:00',
    venue: 'Riverside Amphitheatre',
    address: 'Yamuna Riverfront, New Delhi',
    city: 'New Delhi',
    capacity: 800,
    registered: 612,
    price: 699,
    isFree: false,
    organizer: 'Soundwave Live',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Live Music', 'Outdoor', 'Festival'],
    featured: true,
  },
  {
    id: 'evt-003',
    title: 'Startup Founders Roundtable',
    description:
      'An intimate, invite-style roundtable for early-stage founders to discuss fundraising, GTM strategy, and team building with experienced operators and VCs.',
    category: 'Business',
    date: '2026-09-19',
    endDate: '2026-09-19',
    startTime: '10:30',
    endTime: '13:00',
    venue: 'WeWork Galaxy',
    address: 'MG Road, Bengaluru, Karnataka',
    city: 'Bengaluru',
    capacity: 60,
    registered: 58,
    price: 0,
    isFree: true,
    organizer: 'Founders Circle',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Startups', 'Networking', 'VC'],
    featured: false,
  },
  {
    id: 'evt-004',
    title: 'Modern Art & Light Exhibition',
    description:
      'A curated exhibition showcasing contemporary installations that blend sculpture, projection mapping, and interactive light art from emerging South Asian artists.',
    category: 'Arts & Culture',
    date: '2026-10-02',
    endDate: '2026-10-10',
    startTime: '11:00',
    endTime: '20:00',
    venue: 'National Gallery of Modern Art',
    address: 'Jaipur House, New Delhi',
    city: 'New Delhi',
    capacity: 250,
    registered: 134,
    price: 250,
    isFree: false,
    organizer: 'Studio Prism',
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    tags: ['Exhibition', 'Installation', 'Indoor'],
    featured: true,
  },
  {
    id: 'evt-005',
    title: 'City Half Marathon',
    description:
      'Race through the heart of the city on a scenic 21.1km route. Categories for competitive runners and casual joggers, with medals, hydration stations, and post-run recovery zone.',
    category: 'Sports',
    date: '2026-11-08',
    endDate: '2026-11-08',
    startTime: '05:30',
    endTime: '10:00',
    venue: 'Central Park Starting Line',
    address: 'Connaught Place, New Delhi',
    city: 'New Delhi',
    capacity: 3000,
    registered: 2145,
    price: 899,
    isFree: false,
    organizer: 'RunIndia Events',
    image:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
    tags: ['Running', 'Outdoor', 'Fitness'],
    featured: false,
  },
  {
    id: 'evt-006',
    title: 'Artisan Food & Craft Bazaar',
    description:
      'A weekend market featuring 80+ local vendors: small-batch chocolatiers, cold-brew roasters, handmade ceramics, and live cooking demos from guest chefs.',
    category: 'Food & Drink',
    date: '2026-09-20',
    endDate: '2026-09-21',
    startTime: '10:00',
    endTime: '21:00',
    venue: 'Phoenix Marketcity Grounds',
    address: 'Kurla West, Mumbai, Maharashtra',
    city: 'Mumbai',
    capacity: 1200,
    registered: 890,
    price: 0,
    isFree: true,
    organizer: 'Local Roots Collective',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Market', 'Food', 'Family-friendly'],
    featured: false,
  },
  {
    id: 'evt-007',
    title: 'Product Design Masterclass',
    description:
      'A hands-on workshop covering design systems, rapid prototyping, and usability testing, led by senior product designers from top consumer tech companies.',
    category: 'Education',
    date: '2026-09-25',
    endDate: '2026-09-25',
    startTime: '14:00',
    endTime: '18:00',
    venue: 'IIT Delhi Innovation Hub',
    address: 'Hauz Khas, New Delhi',
    city: 'New Delhi',
    capacity: 120,
    registered: 120,
    price: 499,
    isFree: false,
    organizer: 'DesignLab Academy',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    tags: ['Workshop', 'Design', 'UX'],
    featured: false,
  },
  {
    id: 'evt-008',
    title: 'Mindful Living Wellness Retreat',
    description:
      'A one-day retreat combining guided meditation, breathwork, and yoga sessions with nutrition workshops, set in a quiet countryside venue.',
    category: 'Health & Wellness',
    date: '2026-10-18',
    endDate: '2026-10-18',
    startTime: '07:00',
    endTime: '17:00',
    venue: 'Serenity Wellness Grounds',
    address: 'Manesar, Haryana',
    city: 'Gurugram',
    capacity: 150,
    registered: 61,
    price: 1200,
    isFree: false,
    organizer: 'Mindful Collective',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Yoga', 'Wellness', 'Outdoor'],
    featured: false,
  },
  {
    id: 'evt-009',
    title: 'Indie Game Dev Showcase',
    description:
      'Local indie studios demo their upcoming titles, followed by a panel on funding and publishing in the Indian gaming industry, plus a retro arcade night.',
    category: 'Technology',
    date: '2026-11-01',
    endDate: '2026-11-01',
    startTime: '16:00',
    endTime: '22:00',
    venue: 'The Loft Co-working Space',
    address: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    capacity: 200,
    registered: 77,
    price: 0,
    isFree: true,
    organizer: 'IndieDev Guild',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gaming', 'Showcase', 'Community'],
    featured: false,
  },
  {
    id: 'evt-010',
    title: 'Classical Symphony Under the Stars',
    description:
      'The City Philharmonic performs a curated program of romantic-era symphonies in an open-air amphitheatre setting, complete with a pre-show picnic lawn.',
    category: 'Music',
    date: '2026-09-13',
    endDate: '2026-09-13',
    startTime: '19:00',
    endTime: '21:30',
    venue: 'Amphitheatre Gardens',
    address: 'Lodhi Road, New Delhi',
    city: 'New Delhi',
    capacity: 500,
    registered: 500,
    price: 999,
    isFree: false,
    organizer: 'City Philharmonic Society',
    image:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    tags: ['Classical', 'Outdoor', 'Orchestra'],
    featured: false,
  },
  {
    id: 'evt-011',
    title: 'Women in Tech Leadership Conference',
    description:
      'A day of keynotes, mentorship circles, and career workshops celebrating and empowering women leaders across engineering, product, and design.',
    category: 'Business',
    date: '2026-10-24',
    endDate: '2026-10-24',
    startTime: '09:30',
    endTime: '17:30',
    venue: 'Taj Convention Centre',
    address: 'Banjara Hills, Hyderabad, Telangana',
    city: 'Hyderabad',
    capacity: 350,
    registered: 298,
    price: 799,
    isFree: false,
    organizer: 'WomenInTech India',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    tags: ['Leadership', 'Conference', 'Networking'],
    featured: true,
  },
  {
    id: 'evt-012',
    title: 'Street Photography Walk & Workshop',
    description:
      'A guided photo walk through the old city quarter followed by a critique session and editing workshop with an award-winning street photographer.',
    category: 'Arts & Culture',
    date: '2026-09-14',
    endDate: '2026-09-14',
    startTime: '06:30',
    endTime: '11:00',
    venue: 'Old City Heritage Trail',
    address: 'Chandni Chowk, New Delhi',
    city: 'New Delhi',
    capacity: 40,
    registered: 22,
    price: 350,
    isFree: false,
    organizer: 'Frame & Focus Studio',
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Photography', 'Workshop', 'Walking Tour'],
    featured: false,
  },
];

let registrations = [];
let nextEventSeq = events.length + 1;
let nextRegSeq = 1;

function getAll() {
  return events;
}

function getById(id) {
  return events.find((e) => e.id === id);
}

function create(eventData) {
  const newEvent = {
    id: `evt-${String(nextEventSeq++).padStart(3, '0')}`,
    registered: 0,
    isFree: Number(eventData.price) === 0,
    ...eventData,
    image:
      eventData.image ||
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  };
  events.unshift(newEvent);
  return newEvent;
}

function update(id, updates) {
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...updates, id };
  return events[idx];
}

function remove(id) {
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  events.splice(idx, 1);
  registrations = registrations.filter((r) => r.eventId !== id);
  return true;
}

function registerAttendee(eventId, attendee) {
  const event = getById(eventId);
  if (!event) return { error: 'not_found' };
  if (event.registered >= event.capacity) return { error: 'full' };

  const registration = {
    id: `reg-${String(nextRegSeq++).padStart(4, '0')}`,
    eventId,
    name: attendee.name,
    email: attendee.email,
    phone: attendee.phone || '',
    ticketCount: attendee.ticketCount || 1,
    registeredAt: new Date().toISOString(),
  };
  registrations.push(registration);
  event.registered += registration.ticketCount;
  return { registration, event };
}

function getRegistrationsForEvent(eventId) {
  return registrations.filter((r) => r.eventId === eventId);
}

function getAllRegistrations() {
  return registrations;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  registerAttendee,
  getRegistrationsForEvent,
  getAllRegistrations,
};
