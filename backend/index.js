import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile('db.json');
const db = new Low(adapter, { stars: [], constellations: [], skyConditions: [] });

// Inicjalizacja bazy, jeśli pusta
await db.read();
db.data ||= { stars: [], constellations: [], skyConditions: [] };
await db.write();

/* === GWIAZDY === */

// Pobierz wszystkie gwiazdy
app.get('/api/stars', async (req, res) => {
    await db.read();
    res.json(db.data.stars);
});

// Dodaj gwiazdę
app.post('/api/stars', async (req, res) => {
    await db.read();
    const newStar = { ...req.body, id: Date.now().toString() };
    db.data.stars.push(newStar);
    await db.write();
    res.status(201).json(newStar);
});

// Zaświeć/wyłącz gwiazdę
app.post('/api/stars/:id/toggle', async (req, res) => {
    await db.read();
    const star = db.data.stars.find(s => s.id === req.params.id);
    if (!star) return res.status(404).json({ error: "Not found" });
    star.isOn = !star.isOn;
    await db.write();
    res.json({ ok: true, isOn: star.isOn });
});

// Edytuj gwiazdę
app.put('/api/stars/:id', async (req, res) => {
    await db.read();
    const idx = db.data.stars.findIndex(star => star.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Star not found" });
    db.data.stars[idx] = { ...db.data.stars[idx], ...req.body };
    await db.write();
    res.json(db.data.stars[idx]);
});

// Usuń gwiazdę
app.delete('/api/stars/:id', async (req, res) => {
    await db.read();
    db.data.stars = db.data.stars.filter(star => star.id !== req.params.id);
    // Usuwamy gwiazdę z konstelacji
    db.data.constellations.forEach(c => {
        c.stars = (c.stars || []).filter(sid => sid !== req.params.id);
    });
    await db.write();
    res.json({ ok: true });
});

/* === KONSTELACJE === */

// Pobierz wszystkie konstelacje
app.get('/api/constellations', async (req, res) => {
    await db.read();
    res.json(db.data.constellations);
});

// Dodaj konstelację
app.post('/api/constellations', async (req, res) => {
    await db.read();
    const newConst = { ...req.body, id: Date.now().toString(), stars: [] };
    db.data.constellations.push(newConst);
    await db.write();
    res.status(201).json(newConst);
});

// Zaświeć/wyłącz konstelację
app.post('/api/constellations/:id/toggle', async (req, res) => {
    await db.read();
    const c = db.data.constellations.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    c.isOn = !c.isOn;
    await db.write();
    res.json({ ok: true, isOn: c.isOn });
});

// Edytuj konstelację
app.put('/api/constellations/:id', async (req, res) => {
    await db.read();
    const idx = db.data.constellations.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Constellation not found" });
    db.data.constellations[idx] = { ...db.data.constellations[idx], ...req.body };
    await db.write();
    res.json(db.data.constellations[idx]);
});

// Usuń konstelację
app.delete('/api/constellations/:id', async (req, res) => {
    await db.read();
    db.data.constellations = db.data.constellations.filter(c => c.id !== req.params.id);
    // Usuwamy powiązania w gwiazdach
    db.data.stars.forEach(s => {
        s.constellations = (s.constellations || []).filter(cid => cid !== req.params.id);
    });
    await db.write();
    res.json({ ok: true });
});

/* === POWIĄZANIA GWIAZDY <-> KONSTELACJE === */

// Przypisz gwiazdę do konstelacji
app.post('/api/constellations/:cid/add-star/:sid', async (req, res) => {
    await db.read();
    const constellation = db.data.constellations.find(c => c.id === req.params.cid);
    const star = db.data.stars.find(s => s.id === req.params.sid);
    if (!constellation || !star) return res.status(404).json({ error: "Not found" });

    if (!constellation.stars.includes(star.id)) constellation.stars.push(star.id);
    star.constellations = star.constellations || [];
    if (!star.constellations.includes(constellation.id)) star.constellations.push(constellation.id);

    await db.write();
    res.json({ ok: true });
});

// Usuń gwiazdę z konstelacji
app.post('/api/constellations/:cid/remove-star/:sid', async (req, res) => {
    await db.read();
    const constellation = db.data.constellations.find(c => c.id === req.params.cid);
    const star = db.data.stars.find(s => s.id === req.params.sid);
    if (!constellation || !star) return res.status(404).json({ error: "Not found" });

    constellation.stars = (constellation.stars || []).filter(sid => sid !== star.id);
    star.constellations = (star.constellations || []).filter(cid => cid !== constellation.id);

    await db.write();
    res.json({ ok: true });
});

/* === WARUNKI NIEBA === */

// Pobierz historię warunków nieba
app.get('/api/skyconditions', async (req, res) => {
    await db.read();
    res.json(db.data.skyConditions);
});

// Dodaj wpis do historii nieba
app.post('/api/skyconditions', async (req, res) => {
    await db.read();
    const entry = { ...req.body, id: Date.now().toString(), date: new Date().toISOString() };
    db.data.skyConditions.push(entry);
    await db.write();
    res.status(201).json(entry);
});

// Nadpisz całą historię nieba
app.post('/api/skyconditions/overwrite', async (req, res) => {
    await db.read();
    db.data.skyConditions = req.body.skyConditions || [];
    await db.write();
    res.json({ ok: true });
});

// Usuń wpis
app.delete('/api/skyconditions/:id', async (req, res) => {
    await db.read();
    db.data.skyConditions = db.data.skyConditions.filter(e => e.id !== req.params.id);
    await db.write();
    res.json({ ok: true });
});

// Edytuj wpis
app.put('/api/skyconditions/:id', async (req, res) => {
    await db.read();
    const idx = db.data.skyConditions.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    db.data.skyConditions[idx] = { ...db.data.skyConditions[idx], ...req.body };
    await db.write();
    res.json(db.data.skyConditions[idx]);
});

/* === 404 fallback === */
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

/* === Start serwera === */
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API działa na http://localhost:${PORT}`);
});
