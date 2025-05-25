// src/NotFound.js
import React from "react";

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textAlign: "center",
            }}
        >
            <h1 style={{ fontSize: "5rem", color: "#a259fa", marginBottom: 0 }}>404</h1>
            <h2 style={{ fontSize: "2rem", color: "#fff" }}>Nie znaleziono strony</h2>
            <p style={{ margin: "1rem 0 2rem" }}>
                Ojej! Wygląda na to, że taka strona nie istnieje. <br /> Sprawdź adres lub wróć na stronę główną.
            </p>
            <a
                href="/"
                style={{
                    background: "#a259fa",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "0.7em 2em",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                }}
            >
                Strona główna
            </a>
        </div>
    );
}
