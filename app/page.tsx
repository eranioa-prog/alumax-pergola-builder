"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Page() {
  const [width, setWidth] = useState(5000);
  const [depth, setDepth] = useState(3000);

  const techRef = useRef<HTMLDivElement>(null);
  const marketingRef = useRef<HTMLDivElement>(null);

  // חישוב חלוקות
  const frameWidth = 40;
  const divisionWidth = 40;

  const netWidth = width - frameWidth * 2;
  const fields = Math.round(netWidth / 1000);
  const divisions = fields - 1;

  const fieldWidth = netWidth / fields;

  // חישוב הצללות
  const shadingWidth = 100;
  const gap = 10;

  const netDepth = depth - frameWidth * 2;
  const shadingCount = Math.floor(netDepth / (shadingWidth + gap));

  // ================= PDF =================

  const generatePDF = async (type: "tech" | "marketing") => {
    const element = type === "tech" ? techRef.current : marketingRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(img, "PNG", 10, 10, 280, 150);

    pdf.save(type === "tech" ? "pergola-tech.pdf" : "pergola-marketing.pdf");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>ALUMAX - מחשבון פרגולות</h1>

      {/* קלטים */}
      <div style={{ display: "flex", gap: 20 }}>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
        <input
          type="number"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
        />
      </div>

      <button onClick={() => generatePDF("tech")}>PDF טכני</button>
      <button onClick={() => generatePDF("marketing")}>
        PDF שיווקי
      </button>

      {/* ================= שרטוט עליון ================= */}
      <div
        ref={techRef}
        style={{
          marginTop: 30,
          border: "2px solid black",
          width: 600,
          height: 300,
          position: "relative",
        }}
      >
        {/* חלוקות */}
        {Array.from({ length: divisions }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ((i + 1) * 600) / fields,
              top: 0,
              bottom: 0,
              width: 2,
              background: "blue",
            }}
          />
        ))}

        {/* הצללות */}
        {Array.from({ length: shadingCount }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: (i * 300) / shadingCount,
              left: 0,
              right: 0,
              height: 2,
              background: "#555",
            }}
          />
        ))}
      </div>

      {/* ================= שרטוט חזית ================= */}
      <div
        ref={marketingRef}
        style={{
          marginTop: 40,
          border: "2px solid black",
          width: 600,
          height: 200,
          position: "relative",
          background: "#f5f5f5",
        }}
      >
        {/* קורות */}
        {Array.from({ length: shadingCount }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i * 600) / shadingCount,
              top: 0,
              bottom: 0,
              width: 4,
              background: "#222",
            }}
          />
        ))}
      </div>
    </div>
  );
}
