"use client";

import { useState } from "react";

/* ================= הדמיה ================= */

function PergolaPreview({
  width,
  length,
  fields,
  divisions,
}: {
  width: number;
  length: number;
  fields: number;
  divisions: number;
}) {
  const svgWidth = 800;
  const svgHeight = 400;

  const scale = Math.min(600 / length, 300 / width);

  const drawLength = length * scale;
  const drawWidth = width * scale;

  const startX = (svgWidth - drawLength) / 2;
  const startY = (svgHeight - drawWidth) / 2;

  const fieldWidth = drawLength / fields;

  return (
    <div style={{ marginTop: 30 }}>
      <h2>שרטוט פרגולה</h2>

      <svg
        width="100%"
        height="400"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ background: "#f1f5f9", borderRadius: 10 }}
      >
        {/* מסגרת */}
        <rect
          x={startX}
          y={startY}
          width={drawLength}
          height={drawWidth}
          fill="white"
          stroke="black"
          strokeWidth="4"
        />

        {/* חלוקות */}
        {Array.from({ length: divisions }).map((_, i) => {
          const x = startX + fieldWidth * (i + 1);
          return (
            <line
              key={i}
              x1={x}
              y1={startY}
              x2={x}
              y2={startY + drawWidth}
              stroke="blue"
              strokeWidth="2"
            />
          );
        })}

        {/* שדות */}
        {Array.from({ length: fields }).map((_, i) => {
          const x = startX + fieldWidth * i + fieldWidth / 2;
          return (
            <text
              key={i}
              x={x}
              y={startY + 20}
              textAnchor="middle"
              fontSize="12"
            >
              שדה {i + 1}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ================= חישוב ================= */

function calculatePergola(length: number) {
  const raw = length / 1000;

  const fields =
    raw % 1 <= 0.5 ? Math.floor(raw) : Math.ceil(raw);

  const divisions = fields - 1;

  return { fields, divisions };
}

/* ================= דף ראשי ================= */

export default function Home() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!length || !width) return;

    const calc = calculatePergola(Number(length));
    setResult(calc);
  };

  return (
    <main style={{ padding: 20, direction: "rtl", fontFamily: "Arial" }}>
      <h1>ALUMAX - מחשבון פרגולות</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="אורך"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
        <input
          placeholder="רוחב"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <button onClick={handleCalculate}>חשב</button>
      </div>

      {result && (
        <>
          <p>שדות: {result.fields}</p>
          <p>חלוקות: {result.divisions}</p>

          <PergolaPreview
            width={Number(width)}
            length={Number(length)}
            fields={result.fields}
            divisions={result.divisions}
          />
        </>
      )}
    </main>
  );
}