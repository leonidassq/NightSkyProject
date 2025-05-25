import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLightbulb } from "react-icons/fa";

export default function Stars() {
    const [stars, setStars] = useState([]);
    const [constellations, setConstellations] = useState([]);
    const [newStar, setNewStar] = useState({
        name: "",
        description: "",
        photoUrl: "",
        constellations: []
    });
    const [editId, setEditId] = useState(null);
    const [editStar, setEditStar] = useState({
        name: "",
        description: "",
        photoUrl: "",
        constellations: []
    });

    useEffect(() => {
        loadStars();
        loadConstellations();
    }, []);

    function loadStars() {
        axios.get("http://localhost:3001/api/stars").then((res) => setStars(res.data));
    }
    function loadConstellations() {
        axios.get("http://localhost:3001/api/constellations").then((res) => setConstellations(res.data));
    }

    function handleInput(e) {
        setNewStar({ ...newStar, [e.target.name]: e.target.value });
    }

    function handleConstellationsCheckbox(e) {
        const id = e.target.value;
        let updated = [...newStar.constellations];
        if (e.target.checked) {
            updated.push(id);
        } else {
            updated = updated.filter(cid => cid !== id);
        }
        setNewStar({ ...newStar, constellations: updated });
    }

    function addStar(e) {
        e.preventDefault();
        if (!newStar.name.trim()) return;
        axios.post("http://localhost:3001/api/stars", newStar).then(() => {
            setNewStar({ name: "", description: "", photoUrl: "", constellations: [] });
            loadStars();
        });
    }

    function startEdit(star) {
        setEditId(star.id);
        setEditStar({
            name: star.name,
            description: star.description,
            photoUrl: star.photoUrl || "",
            constellations: star.constellations || []
        });
    }

    function handleEditInput(e) {
        setEditStar({ ...editStar, [e.target.name]: e.target.value });
    }

    function handleEditConstellationsCheckbox(e) {
        const id = e.target.value;
        let updated = [...editStar.constellations];
        if (e.target.checked) {
            updated.push(id);
        } else {
            updated = updated.filter(cid => cid !== id);
        }
        setEditStar({ ...editStar, constellations: updated });
    }

    function saveEdit(e) {
        e.preventDefault();
        axios
            .put(`http://localhost:3001/api/stars/${editId}`, editStar)
            .then(() => {
                setEditId(null);
                setEditStar({ name: "", description: "", photoUrl: "", constellations: [] });
                loadStars();
            });
    }

    function cancelEdit() {
        setEditId(null);
        setEditStar({ name: "", description: "", photoUrl: "", constellations: [] });
    }

    function deleteStar(id) {
        axios.delete(`http://localhost:3001/api/stars/${id}`).then(loadStars);
    }

    function toggleStar(id) {
        axios.post(`http://localhost:3001/api/stars/${id}/toggle`).then(loadStars);
    }

    function getConstellationNames(ids) {
        return ids.map(id => {
            const c = constellations.find(c => c.id === id);
            return c ? c.name : "???";
        }).join(", ");
    }

    return (
        <div className="stars-container" style={{ maxWidth: 650, margin: "auto" }}>
            <h2>Gwiazdy</h2>
            <form onSubmit={addStar} style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                    name="name"
                    placeholder="Nazwa gwiazdy"
                    value={newStar.name}
                    onChange={handleInput}
                    required
                />
                <input
                    name="description"
                    placeholder="Opis"
                    value={newStar.description}
                    onChange={handleInput}
                />
                <input
                    name="photoUrl"
                    placeholder="Link do zdjęcia"
                    value={newStar.photoUrl}
                    onChange={handleInput}
                />
                <div>
                    <b>Konstelacje:</b>
                    <div>
                        {constellations.length === 0 && <span style={{ color: "#aaa" }}>Brak konstelacji</span>}
                        {constellations.map(c => (
                            <label key={c.id} style={{ marginRight: 10 }}>
                                <input
                                    type="checkbox"
                                    value={c.id}
                                    checked={newStar.constellations && newStar.constellations.includes(c.id)}
                                    onChange={handleConstellationsCheckbox}
                                />{" "}
                                {c.name}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit">Dodaj</button>
            </form>
            <ul>
                {stars.map((star) =>
                    editId === star.id ? (
                        <li key={star.id} style={{ marginBottom: 10 }}>
                            <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <input
                                    name="name"
                                    value={editStar.name}
                                    onChange={handleEditInput}
                                    required
                                />
                                <input
                                    name="description"
                                    value={editStar.description}
                                    onChange={handleEditInput}
                                />
                                <input
                                    name="photoUrl"
                                    placeholder="Link do zdjęcia"
                                    value={editStar.photoUrl}
                                    onChange={handleEditInput}
                                />
                                {editStar.photoUrl && (
                                    <img src={editStar.photoUrl} alt="Podgląd" style={{ maxWidth: 120, maxHeight: 90, marginTop: 4 }} />
                                )}
                                <div>
                                    <b>Konstelacje:</b>
                                    <div>
                                        {constellations.length === 0 && <span style={{ color: "#aaa" }}>Brak konstelacji</span>}
                                        {constellations.map(c => (
                                            <label key={c.id} style={{ marginRight: 10 }}>
                                                <input
                                                    type="checkbox"
                                                    value={c.id}
                                                    checked={editStar.constellations && editStar.constellations.includes(c.id)}
                                                    onChange={handleEditConstellationsCheckbox}
                                                />{" "}
                                                {c.name}
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
                        <li key={star.id} style={{ marginBottom: 10 }}>
                            <strong>{star.name}</strong>
                            <span> — {star.description}</span>
                            <span>
                                {" | "}
                                <b>Konstelacje:</b>{" "}
                                {star.constellations && star.constellations.length > 0
                                    ? getConstellationNames(star.constellations)
                                    : "Brak"}
                            </span>
                            {star.photoUrl && (
                                <div>
                                    <img src={star.photoUrl} alt={star.name} style={{ maxWidth: 120, maxHeight: 90, marginTop: 4, borderRadius: 8 }} />
                                </div>
                            )}
                            <button style={{ marginLeft: 10 }} onClick={() => toggleStar(star.id)}>
                                <FaLightbulb color={star.isOn ? "#ffd700" : "#555"} size={22} title={star.isOn ? "Wyłącz" : "Zaświeć"} />
                            </button>
                            <button style={{ marginLeft: 10 }} onClick={() => startEdit(star)}>
                                Edytuj
                            </button>
                            <button style={{ marginLeft: 5 }} onClick={() => deleteStar(star.id)}>
                                Usuń
                            </button>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
