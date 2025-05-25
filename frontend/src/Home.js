import React from "react";
import RandomConstellation from "./RandomConstellation";
import RealConstellation from "./RealConstellation";

export default function Home() {
    return (
        <div
            style={{
                minHeight: "70vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "none"
            }}
        >
            <h2
                style={{
                    margin: "48px 0 24px 0",
                    color: "#b25cff",
                    textAlign: "center"
                }}
            >
                Witaj w aplikacji Nocne Niebo!
            </h2>

            {/* Układ: konstelacja | opis | konstelacja */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 350px 1fr",
                    gap: 48,
                    alignItems: "start",
                    width: "100%",
                    maxWidth: 1500,
                    margin: "0 auto",
                }}
            >
                {/* Lewa konstelacja */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <RandomConstellation />
                </div>

                {/* Środkowy szeroki opis */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "100%",
                        minWidth: 320,
                        maxWidth: 360,
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            background: "rgba(36,14,73,0.85)",
                            borderRadius: 18,
                            padding: 32,
                            boxShadow: "0 4px 32px #8002ff55",
                            color: "#eee",
                            maxWidth: 340,
                            lineHeight: 1.6,
                            fontSize: 19,
                            textAlign: "center",
                        }}
                    >
                        <b style={{ fontSize: 25, color: "#be5bff" }}>Nocne Niebo</b> – aplikacja do rejestrowania warunków nieba i poznawania konstelacji.<br /><br />
                        Zarządzaj własnym katalogiem gwiazd i konstelacji, sprawdzaj historię pogody oraz eksploruj układy gwiazd!
                    </div>
                </div>

                {/* Prawa konstelacja */}
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <RealConstellation />
                </div>
            </div>
        </div>
    );
}
