import request from "supertest";
import app from "./index.js"; // Upewnij się, że ścieżka jest poprawna

describe("NightSky API", () => {
    let newStarId = null;
    let newConstId = null;
    let skyId = null;

    // 1. Test dodania gwiazdy
    it("POST /api/stars – powinno dodać gwiazdę", async () => {
        const res = await request(app).post("/api/stars").send({
            name: "Polaris",
            description: "Gwiazda polarna",
            photoUrl: "https://upload.wikimedia.org/polaris.jpg"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Polaris");
        newStarId = res.body.id;
    });

    // 2. Test pobrania wszystkich gwiazd
    it("GET /api/stars – powinno pobrać listę gwiazd", async () => {
        const res = await request(app).get("/api/stars");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(s => s.id === newStarId)).toBe(true);
    });

    // 3. Test togglowania gwiazdy
    it("POST /api/stars/:id/toggle – powinno zmienić status isOn", async () => {
        const res = await request(app).post(`/api/stars/${newStarId}/toggle`);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.isOn).toBe("boolean");
    });

    // 4. Test dodania konstelacji
    it("POST /api/constellations – powinno dodać konstelację", async () => {
        const res = await request(app).post("/api/constellations").send({
            name: "Orion",
            description: "Najbardziej znana konstelacja",
            photoUrl: "https://upload.wikimedia.org/orion.jpg",
            stars: [newStarId]
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Orion");
        newConstId = res.body.id;
    });

    // 5. Test dodania warunku nieba i walidacji (zły wpis)
    it("POST /api/skyconditions – walidacja złych danych", async () => {
        const res = await request(app).post("/api/skyconditions").send({
            date: "",
            cloudiness: 12, // poza zakresem!
            moonPhase: "",
            precipitation: "deszcz",
            fog: -1
        });
        expect(res.statusCode).toBe(400);
    });

    it("POST /api/skyconditions – poprawne dane", async () => {
        const res = await request(app).post("/api/skyconditions").send({
            date: "2024-05-30",
            cloudiness: 4,
            moonPhase: "pełnia",
            precipitation: "brak",
            fog: 2
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
        skyId = res.body.id;
    });

    // 6. Test kasowania gwiazdy
    it("DELETE /api/stars/:id – powinno usunąć gwiazdę", async () => {
        const res = await request(app).delete(`/api/stars/${newStarId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    // 7. 404 – nieistniejąca ścieżka
    it("GET /nieistnieje – powinno zwrócić 404", async () => {
        const res = await request(app).get("/nieistnieje");
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not found");
    });
});
