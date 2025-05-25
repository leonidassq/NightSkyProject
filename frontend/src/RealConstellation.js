import React from "react";

const realStars = [
    { name: "Dubhe", x: 100, y: 80 },
    { name: "Merak", x: 140, y: 120 },
    { name: "Phecda", x: 170, y: 160 },
    { name: "Megrez", x: 200, y: 120 },
    { name: "Alioth", x: 240, y: 100 },
    { name: "Mizar", x: 280, y: 120 },
    { name: "Alkaid", x: 340, y: 160 }
];

const realConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
];

export default function RealConstellation({ name = "Wielki Wóz" }) {
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
                {realConnections.map(([from, to], i) => (
                    <line
                        key={i}
                        x1={realStars[from].x}
                        y1={realStars[from].y}
                        x2={realStars[to].x}
                        y2={realStars[to].y}
                        stroke="#a259fa"
                        strokeWidth="2"
                        opacity={0.9}
                    />
                ))}
                {/* Gwiazdy */}
                {realStars.map((s, i) => (
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
                Realistyczny układ gwiazd konstelacji Wielki Wóz
            </div>
        </div>
    );
}
