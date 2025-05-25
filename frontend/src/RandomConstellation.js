import React, { useMemo } from "react";

// Funkcja do generowania losowych gwiazd i połączeń
function generateRandomConstellation(starCount = 7) {
    const stars = Array.from({ length: starCount }, (_, i) => ({
        name: `Star ${i + 1}`,
        x: Math.round(70 + Math.random() * 300),  // 70–370 (przestrzeń 440px)
        y: Math.round(50 + Math.random() * 200),  // 50–250 (przestrzeń 300px)
    }));
    const connections = [];
    for (let i = 0; i < starCount - 1; i++) {
        connections.push([i, i + 1]);
    }
    for (let c = 0; c < Math.min(3, starCount); c++) {
        let a = Math.floor(Math.random() * starCount);
        let b = Math.floor(Math.random() * starCount);
        if (a !== b && !connections.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
            connections.push([a, b]);
        }
    }
    return { stars, connections };
}

export default function RandomConstellation({ name = "Losowa Konstelacja", starCount = 7 }) {
    const { stars, connections } = useMemo(() => generateRandomConstellation(starCount), [starCount]);

    return (
        <div style={{
            background: "linear-gradient(135deg, #21123b 0%, #392467 100%)",
            padding: 0,
            borderRadius: 18,
            boxShadow: "0 2px 24px #15002488",
            width: 500,
            minWidth: 400,
            maxWidth: 500,
            minHeight: 370,
            margin: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
        }}>
            <h3 style={{ color: "#a259fa", marginBottom: 18, marginTop: 28, textAlign: "center", fontSize: 28 }}>
                {name}
            </h3>
            <svg width={440} height={300} style={{ background: "#191033", borderRadius: 14, display: "block" }}>
                {/* Połączenia */}
                {connections.map(([from, to], i) => (
                    <line
                        key={i}
                        x1={stars[from].x}
                        y1={stars[from].y}
                        x2={stars[to].x}
                        y2={stars[to].y}
                        stroke="#a259fa"
                        strokeWidth="2"
                        opacity={0.9}
                    />
                ))}
                {/* Gwiazdy */}
                {stars.map((s, i) => (
                    <g key={s.name}>
                        <circle
                            cx={s.x}
                            cy={s.y}
                            r={14}
                            fill="#ffd700"
                            stroke="#fff"
                            strokeWidth="2.5"
                            filter="drop-shadow(0px 0px 16px #fff8)"
                        />
                        <text
                            x={s.x + 18}
                            y={s.y + 7}
                            fill="#fff"
                            fontSize="16"
                            fontWeight="bold"
                            style={{ textShadow: "0 0 8px #21123b" }}
                        >
                            {s.name}
                        </text>
                    </g>
                ))}
            </svg>
            <div style={{ color: "#aaa", fontSize: 16, textAlign: "center", marginTop: 15 }}>
                Schematyczna, losowa konstelacja
            </div>
        </div>
    );
}
