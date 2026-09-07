const express = require('express');
const router = express.Router();
const store = require('../data/events');

// GET /api/stats - dashboard overview metrics
router.get('/', (req, res) => {
  const events = store.getAll();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today);
  const totalRegistrations = events.reduce((sum, e) => sum + e.registered, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const revenue = events.reduce((sum, e) => sum + e.registered * (e.price || 0), 0);

  const byCategory = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const soldOut = events.filter((e) => e.registered >= e.capacity).length;
  const almostFull = events.filter(
    (e) => e.registered / e.capacity >= 0.85 && e.registered < e.capacity
  ).length;

  res.json({
    totalEvents: events.length,
    upcomingEvents: upcoming.length,
    totalRegistrations,
    totalCapacity,
    avgFillRate: totalCapacity ? Math.round((totalRegistrations / totalCapacity) * 100) : 0,
    revenue,
    byCategory,
    soldOut,
    almostFull,
  });
});

module.exports = router;
