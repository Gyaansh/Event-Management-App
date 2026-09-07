const express = require('express');
const router = express.Router();
const store = require('../data/events');

// GET /api/events - list all events with optional filtering
router.get('/', (req, res) => {
  const { category, search, status, sort } = req.query;
  let events = store.getAll();

  const today = new Date().toISOString().slice(0, 10);

  if (category && category !== 'All') {
    events = events.filter((e) => e.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (status === 'upcoming') {
    events = events.filter((e) => e.date >= today);
  } else if (status === 'past') {
    events = events.filter((e) => e.date < today);
  }

  if (sort === 'soonest') {
    events = [...events].sort((a, b) => a.date.localeCompare(b.date));
  } else if (sort === 'popular') {
    events = [...events].sort(
      (a, b) => b.registered / b.capacity - a.registered / a.capacity
    );
  }

  const withStatus = events.map((e) => ({
    ...e,
    eventStatus: e.date < today ? 'past' : e.registered >= e.capacity ? 'sold-out' : 'open',
  }));

  res.json(withStatus);
});

// GET /api/events/categories - distinct category list
router.get('/categories', (req, res) => {
  const categories = [...new Set(store.getAll().map((e) => e.category))];
  res.json(categories);
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = store.getById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    ...event,
    eventStatus: event.date < today ? 'past' : event.registered >= event.capacity ? 'sold-out' : 'open',
  });
});

// POST /api/events - create a new event (admin)
router.post('/', (req, res) => {
  const { title, description, category, date, venue, city, capacity, price } = req.body;
  if (!title || !description || !category || !date || !venue || !city || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const event = store.create({
    ...req.body,
    capacity: Number(capacity),
    price: Number(price) || 0,
  });
  res.status(201).json(event);
});

// PUT /api/events/:id - update an event (admin)
router.put('/:id', (req, res) => {
  const updates = { ...req.body };
  if (updates.capacity !== undefined) updates.capacity = Number(updates.capacity);
  if (updates.price !== undefined) updates.price = Number(updates.price);
  const event = store.update(req.params.id, updates);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// DELETE /api/events/:id - delete an event (admin)
router.delete('/:id', (req, res) => {
  const ok = store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Event not found' });
  res.status(204).end();
});

// POST /api/events/:id/register - register an attendee
router.post('/:id/register', (req, res) => {
  const { name, email, phone, ticketCount } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const result = store.registerAttendee(req.params.id, { name, email, phone, ticketCount });
  if (result.error === 'not_found') return res.status(404).json({ error: 'Event not found' });
  if (result.error === 'full') return res.status(409).json({ error: 'Event is at full capacity' });
  res.status(201).json(result);
});

// GET /api/events/:id/registrations - list registrations for an event (admin)
router.get('/:id/registrations', (req, res) => {
  const event = store.getById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(store.getRegistrationsForEvent(req.params.id));
});

module.exports = router;
