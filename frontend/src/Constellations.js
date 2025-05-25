import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLightbulb } from "react-icons/fa";

export default function Constellations() {
    const [constellations, setConstellations] = useState([]);
    const [stars, setStars] = useState([]);
    const [newConst, setNewConst] = useState({
        name: "",
        description: "",
        photoUrl: "",
        stars: []
    });
    const [editId, setEditId] = useState(null);
    const [editConst, setEditConst] = useState({
        name: "",
        description: "",
        photoUrl: "",
        stars: []
    });

    useEffect(() => {
        loadConstellations();
        loadStars();
    }, []);

    function loadConstellations() {
        axios.get("http://localhost:3001/api/constellations").then((res) => setConstellations(res.data));
    }
    function loadStars() {
        axios.get("http://localhost:3001/api/stars").then((res) => setStars(res.data));
    }

    function handleInput(e) {
        setNewConst({ ...newConst, [e.target.name]: e.target.value });
    }

    function handleStarsCheckbox(e) {
        const id = e.target.value;
        let updated = [...newConst.stars];
        if (e.target.checked) {
            updated.push(id);
        } else {
            updated = updated.filter(sid => sid !== id);
        }
        setNewConst({ ...newConst, stars: updated });
    }

    function addConstellation(e) {
        e.preventDefault();
        if (!newConst.name.trim()) return;
        axios.post("http://localhost:3001/api/constellations", newConst).then(() => {
            setNewConst({ name: "", description: "", photoUrl: "", stars: [] });
            loadConstellations();
        });
    }

    function startEdit(c) {
        setEditId(c.id);
        setEditConst({
            name: c.name,
            description: c.description,
            photoUrl: c.photoUrl || "",
            stars: c.stars || []
        });
    }

    function handleEditInput(e) {
        setEditConst({ ...editConst, [e.target.name]: e.target.value });
    }

    function handleEditStarsCheckbox(e) {
        const id = e.target.value;
        let updated = [...editConst.stars];
        if (e.target.checked) {
            updated.push(id);
        } else {
            updated = updated.filter(sid => sid !== id);
        }
        setEditConst({ ...editConst, stars: updated });
    }

    function saveEdit(e) {
        e.preventDefault();
        axios
            .put(`http://localhost:3001/api/constellations/${editId}`, editConst)
            .then(() => {
                setEditId(null);
                setEditConst({ name: "", description: "", photoUrl: "", stars: [] });
                loadConstellations();
            });
    }

    function cancelEdit() {
        setEditId(null);
        setEditConst({ name: "", description: "", photoUrl: "", stars: [] });
    }

    function deleteConstellation(id) {
        axios.delete(`http://localhost:3001/api/constellations/${id}`).then(loadConstellations);
    }

    function toggleConstellation(id) {
        axios.post(`http://localhost:3001/api/constellations/${id}/toggle`).then(loadConstellations);
    }

    function getStarNames(ids) {
        return ids.map(id => {
            const s = stars.find(s => s.id === id);
            return s ? s.name : "???";
        }).join(", ");
    }

    return (
        <div className="constellations-container" style={{ maxWidth: 650, margin: "auto" }}>
            <h2>Konstelacje</h2>
            <form onSubmit={addConstellation} style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                    name="name"
                    placeholder="Nazwa konstelacji"
                    value={newConst.name}
                    onChange={handleInput}
                    required
                />
                <input
                    name="description"
                    placeholder="Opis"
                    value={newConst.description}
                    onChange={handleInput}
                />
                <input
                    name="photoUrl"
                    placeholder="Link do zdjęcia"
                    value={newConst.photoUrl}
                    onChange={handleInput}
                />
                <div>
                    <b>Gwiazdy:</b>
                    <div>
                        {stars.length === 0 && <span style={{ color: "#aaa" }}>Brak gwiazd</span>}
                        {stars.map(s => (
                            <label key={s.id} style={{ marginRight: 10 }}>
                                <input
                                    type="checkbox"
                                    value={s.id}
                                    checked={newConst.stars && newConst.stars.includes(s.id)}
                                    onChange={handleStarsCheckbox}
                                />{" "}
                                {s.name}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit">Dodaj</button>
            </form>
            <ul>
                {constellations.map((c) =>
                    editId === c.id ? (
                        <li key={c.id} style={{ marginBottom: 10 }}>
                            <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <input
                                    name="name"
                                    value={editConst.name}
                                    onChange={handleEditInput}
                                    required
                                />
                                <input
                                    name="description"
                                    value={editConst.description}
                                    onChange={handleEditInput}
                                />
                                <input
                                    name="photoUrl"
                                    placeholder="Link do zdjęcia"
                                    value={editConst.photoUrl}
                                    onChange={handleEditInput}
                                />
                                {editConst.photoUrl && (
                                    <img src={editConst.photoUrl} alt="Podgląd" style={{ maxWidth: 120, maxHeight: 90, marginTop: 4 }} />
                                )}
                                <div>
                                    <b>Gwiazdy:</b>
                                    <div>
                                        {stars.length === 0 && <span style={{ color: "#aaa" }}>Brak gwiazd</span>}
                                        {stars.map(s => (
                                            <label key={s.id} style={{ marginRight: 10 }}>
                                                <input
                                                    type="checkbox"
                                                    value={s.id}
                                                    checked={editConst.stars && editConst.stars.includes(s.id)}
                                                    onChange={handleEditStarsCheckbox}
                                                />{" "}
                                                {s.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit">Zapisz</button>
                                <button type="button" onClick={cancelEdit}>
                                    Anuluj
                                </button>
                            </form>
                        </li>
                    ) : (
                        <li key={c.id} style={{ marginBottom: 10 }}>
                            <strong>{c.name}</strong>
                            <span> — {c.description}</span>
                            <span>
                                {" | "}
                                <b>Gwiazdy:</b>{" "}
                                {c.stars && c.stars.length > 0
                                    ? getStarNames(c.stars)
                                    : "Brak"}
                            </span>
                            {c.photoUrl && (
                                <div>
                                    <img src={c.photoUrl} alt={c.name} style={{ maxWidth: 120, maxHeight: 90, marginTop: 4, borderRadius: 8 }} />
                                </div>
                            )}
                            <button style={{ marginLeft: 10 }} onClick={() => toggleConstellation(c.id)}>
                                <FaLightbulb color={c.isOn ? "#ffd700" : "#555"} size={22} title={c.isOn ? "Wyłącz" : "Zaświeć"} />
                            </button>
                            <button style={{ marginLeft: 10 }} onClick={() => startEdit(c)}>
                                Edytuj
                            </button>
                            <button style={{ marginLeft: 5 }} onClick={() => deleteConstellation(c.id)}>
                                Usuń
                            </button>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
