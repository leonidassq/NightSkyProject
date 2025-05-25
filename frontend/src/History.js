import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
    const [history, setHistory] = useState([]);
    const [entry, setEntry] = useState({
        date: "",
        cloudiness: "",
        moonPhase: "",
        precipitation: "",
        fog: ""
    });
    const [editId, setEditId] = useState(null);
    const [editEntry, setEditEntry] = useState({
        date: "",
        cloudiness: "",
        moonPhase: "",
        precipitation: "",
        fog: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    function loadHistory() {
        axios.get("http://localhost:3001/api/skyconditions")
            .then((res) => setHistory(res.data));
    }

    function handleInput(e) {
        setEntry({ ...entry, [e.target.name]: e.target.value });
    }

    function handleEditInput(e) {
        setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
    }

    function addEntry(e) {
        e.preventDefault();
        // Walidacja
        const c = parseInt(entry.cloudiness, 10);
        const f = parseInt(entry.fog, 10);

        if (
            isNaN(c) || c < 0 || c > 10 ||
            isNaN(f) || f < 0 || f > 10
        ) {
            setError("Zachmurzenie i mgła muszą być liczbami z zakresu 0–10.");
            return;
        }
        if (c === 0 && entry.precipitation && entry.precipitation !== "brak") {
            setError("Nie może być opadów przy bezchmurnym niebie!");
            return;
        }
        setError("");

        axios.post("http://localhost:3001/api/skyconditions", entry).then(() => {
            setEntry({ date: "", cloudiness: "", moonPhase: "", precipitation: "", fog: "" });
            loadHistory();
        });
    }

    function deleteEntry(id) {
        axios.delete(`http://localhost:3001/api/skyconditions/${id}`).then(loadHistory);
    }

    function startEdit(h) {
        setEditId(h.id);
        setEditEntry({
            date: h.date.slice(0, 10),
            cloudiness: h.cloudiness,
            moonPhase: h.moonPhase,
            precipitation: h.precipitation,
            fog: h.fog
        });
        setError("");
    }

    function cancelEdit() {
        setEditId(null);
        setEditEntry({
            date: "",
            cloudiness: "",
            moonPhase: "",
            precipitation: "",
            fog: ""
        });
        setError("");
    }

    function saveEdit(e) {
        e.preventDefault();
        // Walidacja edycji
        const c = parseInt(editEntry.cloudiness, 10);
        const f = parseInt(editEntry.fog, 10);

        if (
            isNaN(c) || c < 0 || c > 10 ||
            isNaN(f) || f < 0 || f > 10
        ) {
            setError("Zachmurzenie i mgła muszą być liczbami z zakresu 0–10.");
            return;
        }
        if (c === 0 && editEntry.precipitation && editEntry.precipitation !== "brak") {
            setError("Nie może być opadów przy bezchmurnym niebie!");
            return;
        }
        setError("");

        axios.put(`http://localhost:3001/api/skyconditions/${editId}`, editEntry)
            .then(() => {
                setEditId(null);
                setEditEntry({ date: "", cloudiness: "", moonPhase: "", precipitation: "", fog: "" });
                loadHistory();
            });
    }

    return (
        <div className="history-container">
            <h2>Historia warunków nieba</h2>
            <form onSubmit={addEntry} className="history-form">
                <input
                    name="date"
                    type="date"
                    value={entry.date}
                    onChange={handleInput}
                    required
                />
                <input
                    name="cloudiness"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Zachmurzenie 0-10"
                    value={entry.cloudiness}
                    onChange={handleInput}
                    required
                />
                <select
                    name="moonPhase"
                    value={entry.moonPhase}
                    onChange={handleInput}
                    required
                >
                    <option value="">Faza Księżyca</option>
                    <option value="nów">Nów</option>
                    <option value="pierwsza kwadra">Pierwsza kwadra</option>
                    <option value="pełnia">Pełnia</option>
                    <option value="ostatnia kwadra">Ostatnia kwadra</option>
                </select>
                <select
                    name="precipitation"
                    value={entry.precipitation}
                    onChange={handleInput}
                >
                    <option value="">Brak</option>
                    <option value="deszcz">Deszcz</option>
                    <option value="śnieg">Śnieg</option>
                    <option value="grad">Grad</option>
                </select>
                <input
                    name="fog"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Mgła 0-10"
                    value={entry.fog}
                    onChange={handleInput}
                />
                <button type="submit">Dodaj</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <ul className="history-list">
                {history.map((h) =>
                    editId === h.id ? (
                        <li key={h.id} className="history-item">
                            <form onSubmit={saveEdit} className="history-form" style={{ gap: 8 }}>
                                <input
                                    name="date"
                                    type="date"
                                    value={editEntry.date}
                                    onChange={handleEditInput}
                                    required
                                />
                                <input
                                    name="cloudiness"
                                    type="number"
                                    min="0"
                                    max="10"
                                    placeholder="Zachmurzenie 0-10"
                                    value={editEntry.cloudiness}
                                    onChange={handleEditInput}
                                    required
                                />
                                <select
                                    name="moonPhase"
                                    value={editEntry.moonPhase}
                                    onChange={handleEditInput}
                                    required
                                >
                                    <option value="">Faza Księżyca</option>
                                    <option value="nów">Nów</option>
                                    <option value="pierwsza kwadra">Pierwsza kwadra</option>
                                    <option value="pełnia">Pełnia</option>
                                    <option value="ostatnia kwadra">Ostatnia kwadra</option>
                                </select>
                                <select
                                    name="precipitation"
                                    value={editEntry.precipitation}
                                    onChange={handleEditInput}
                                >
                                    <option value="">Brak</option>
                                    <option value="deszcz">Deszcz</option>
                                    <option value="śnieg">Śnieg</option>
                                    <option value="grad">Grad</option>
                                </select>
                                <input
                                    name="fog"
                                    type="number"
                                    min="0"
                                    max="10"
                                    placeholder="Mgła 0-10"
                                    value={editEntry.fog}
                                    onChange={handleEditInput}
                                />
                                <button type="submit">Zapisz</button>
                                <button type="button" onClick={cancelEdit}>Anuluj</button>
                            </form>
                        </li>
                    ) : (
                        <li key={h.id} className="history-item">
                            <b>{h.date}</b> | Zachmurzenie: {h.cloudiness} | Faza: {h.moonPhase} | Opad: {h.precipitation || "Brak"} | Mgła: {h.fog}
                            <button style={{ marginLeft: 10 }} onClick={() => startEdit(h)}>Edytuj</button>
                            <button style={{ marginLeft: 5 }} onClick={() => deleteEntry(h.id)}>Usuń</button>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
