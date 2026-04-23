const express = require('express');
const ExcelJS = require('exceljs');
const Event   = require('../models/Event');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');

const router  = express.Router();
const isPast  = (d) => new Date(d) < new Date(new Date().toDateString());

// GET /api/events
router.get('/', protect, async (req, res) => {
  try {
    const q      = req.user.role === 'admin' ? {} : { published: true };
    const events = await Event.find(q)
      .populate('registrations.user', 'name email mobile')
      .sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events  (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, date, time, venue, organizer, capacity, description, published } = req.body;
    if (!title || !category || !date || !time || !venue || !organizer || !capacity || !description)
      return res.status(400).json({ success: false, message: 'All fields required.' });

    const ev = await Event.create({
      title, category, date, time, venue, organizer,
      capacity: Number(capacity),
      description,
      published: !!published,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, message: 'Event created!', data: ev });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/events/:id  (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found.' });

    const newCap = Number(req.body.capacity);
    if (req.body.capacity !== undefined && newCap < ev.registrations.length)
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be less than registrations (${ev.registrations.length}).`
      });

    ['title','category','date','time','venue','organizer','description','published'].forEach(k => {
      if (req.body[k] !== undefined) ev[k] = req.body[k];
    });
    if (req.body.capacity !== undefined) ev.capacity = newCap;

    await ev.save();
    const updated = await Event.findById(ev._id)
      .populate('registrations.user', 'name email mobile');
    res.json({ success: true, message: 'Event updated!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/events/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events/:id/register  (student)
router.post('/:id/register', protect, studentOnly, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev || !ev.published)
      return res.status(404).json({ success: false, message: 'Event not found.' });
    if (isPast(ev.date))
      return res.status(400).json({ success: false, message: 'Cannot register for past events.' });

    const uid   = req.user._id.toString();
    const index = ev.registrations.findIndex(r => r.user.toString() === uid);

    if (index > -1) {
      ev.registrations.splice(index, 1);
      await ev.save();
      return res.json({ success: true, registered: false, message: 'Unregistered.' });
    }
    if (ev.registrations.length >= ev.capacity)
      return res.status(400).json({ success: false, message: 'Event is full.' });

    ev.registrations.push({ user: req.user._id });
    await ev.save();
    res.json({ success: true, registered: true, message: 'Registered successfully! 🎉' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events/:id/feedback  (student)
router.post('/:id/feedback', protect, studentOnly, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res.status(400).json({ success: false, message: 'Rating and comment required.' });

    const r = Number(rating);
    if (r < 1 || r > 5)
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });

    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (!isPast(ev.date))
      return res.status(400).json({ success: false, message: 'Feedback only available after event ends.' });

    const uid = req.user._id.toString();
    if (!ev.registrations.some(r => r.user.toString() === uid))
      return res.status(403).json({ success: false, message: 'Only registered students can give feedback.' });
    if (ev.feedback.some(f => f.user.toString() === uid))
      return res.status(400).json({ success: false, message: 'Already submitted feedback.' });

    ev.feedback.push({ user: req.user._id, userName: req.user.name, rating: r, comment: comment.trim() });
    await ev.save();
    res.json({ success: true, message: 'Feedback submitted! Thank you 🙏' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id/feedback  (admin)
router.get('/:id/feedback', protect, adminOnly, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('feedback.user', 'name email');
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found.' });

    const avg = ev.feedback.length
      ? (ev.feedback.reduce((s, f) => s + f.rating, 0) / ev.feedback.length).toFixed(1)
      : null;

    res.json({ success: true, data: ev.feedback, eventTitle: ev.title, averageRating: avg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id/download  (admin) — Excel download with ExcelJS
router.get('/:id/download', protect, adminOnly, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id)
      .populate('registrations.user', 'name email mobile');
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (!ev.registrations.length)
      return res.status(400).json({ success: false, message: 'No registrations yet.' });

    const wb    = new ExcelJS.Workbook();
    wb.creator  = 'CampusEvents';
    wb.created  = new Date();

    // ── Sheet 1: Registrations ────────────────────────────────────────────────
    const ws = wb.addWorksheet('Registrations');
    ws.columns = [
      { header: 'Sr.',               key: 'sr',    width: 6  },
      { header: 'Student Name',      key: 'name',  width: 26 },
      { header: 'Email',             key: 'email', width: 32 },
      { header: 'Mobile',            key: 'mob',   width: 15 },
      { header: 'Registered Date',   key: 'date',  width: 20 },
      { header: 'Registered Time',   key: 'time',  width: 16 },
    ];

    const hdrFill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    const hdrFont   = { name: 'Calibri', bold: true, color: { argb: 'FFFFD700' }, size: 11 };
    const border    = { style: 'thin', color: { argb: 'FF94A3B8' } };
    const borders   = { top: border, left: border, bottom: border, right: border };
    const altFill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2040' } };

    ws.getRow(1).eachCell(c => {
      c.fill = hdrFill; c.font = hdrFont; c.border = borders;
      c.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    ws.getRow(1).height = 22;

    ev.registrations.forEach((reg, i) => {
      const d = new Date(reg.registeredAt);
      const row = ws.addRow({
        sr:    i + 1,
        name:  reg.user?.name  || '—',
        email: reg.user?.email || '—',
        mob:   reg.user?.mobile|| '—',
        date:  d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
        time:  d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      });
      row.height = 18;
      row.eachCell(c => {
        c.font   = { name: 'Calibri', size: 10 };
        c.border = borders;
        c.alignment = { vertical: 'middle' };
        if (i % 2 !== 0) c.fill = altFill;
      });
    });

    // ── Sheet 2: Summary ──────────────────────────────────────────────────────
    const ss = wb.addWorksheet('Event Summary');
    ss.columns = [{ key: 'k', width: 24 }, { key: 'v', width: 44 }];
    ss.addRow({ k: 'Field', v: 'Value' });
    ss.getRow(1).eachCell(c => {
      c.fill = hdrFill; c.font = hdrFont; c.border = borders;
      c.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    [
      ['Event Title',      ev.title],
      ['Category',         ev.category],
      ['Date',             ev.date],
      ['Time',             ev.time],
      ['Venue',            ev.venue],
      ['Organizer',        ev.organizer],
      ['Capacity',         ev.capacity],
      ['Registered',       ev.registrations.length],
      ['Available Seats',  ev.capacity - ev.registrations.length],
      ['Fill Rate',        Math.round((ev.registrations.length / ev.capacity) * 100) + '%'],
      ['Downloaded At',    new Date().toLocaleString('en-IN')],
    ].forEach(([k, v], i) => {
      const row = ss.addRow({ k, v });
      row.height = 18;
      row.getCell('k').font = { name: 'Calibri', bold: true, size: 10 };
      row.getCell('v').font = { name: 'Calibri', size: 10 };
      row.eachCell(c => { c.border = borders; if (i % 2 !== 0) c.fill = altFill; });
    });

    // ── Send ──────────────────────────────────────────────────────────────────
    const fname = ev.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fname}_Registrations.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel download error:', err.message);
    if (!res.headersSent)
      res.status(500).json({ success: false, message: 'Excel generation failed.' });
  }
});

module.exports = router;
