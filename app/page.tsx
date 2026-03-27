"use client";

import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type DimLineProps = {
  left: number;
  top: number;
  width: number;
  label: string;
};

type VerticalDimLineProps = {
  left: number;
  top: number;
  height: number;
  label: string;
};

function HorizontalDimensionLine({
  left,
  top,
  width,
  label,
}: DimLineProps) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height: 2,
          background: "black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left,
          top: top - 4,
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderRight: "8px solid black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: left + width - 8,
          top: top - 4,
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "8px solid black",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: top - 28,
          left: left + width / 2 - 90,
          width: 180,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
          background: "white",
        }}
      >
        {label}
      </div>
    </>
  );
}

function VerticalDimensionLine({
  left,
  top,
  height,
  label,
}: VerticalDimLineProps) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: 2,
          height,
          background: "black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: left - 4,
          top,
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: "8px solid black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: left - 4,
          top: top + height - 8,
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "8px solid black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: left - 52,
          top: top + height / 2 - 50,
          width: 100,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
          background: "white",
          transform: "rotate(-90deg)",
        }}
      >
        {label}
      </div>
    </>
  );
}

function TopView({
  overallLength,
  overallWidth,
  fields,
  divisions,
  fieldDisplayMm,
  shadingCount,
}: {
  overallLength: number;
  overallWidth: number;
  fields: number;
  divisions: number;
  fieldDisplayMm: number;
  shadingCount: number;
}) {
  const drawLeft = 80;
  const drawTop = 90;
  const drawWidth = 620;
  const drawHeight = 300;

  const fieldPixelWidth = drawWidth / fields;

  return (
    <div
      style={{
        marginTop: 20,
        width: 780,
        height: 510,
        position: "relative",
        background: "white",
      }}
    >
      <HorizontalDimensionLine
        left={drawLeft}
        top={50}
        width={drawWidth}
        label={`${overallLength} מ״מ`}
      />

      <VerticalDimensionLine
        left={40}
        top={drawTop}
        height={drawHeight}
        label={`${overallWidth} מ״מ`}
      />

      <div
        style={{
          position: "absolute",
          left: 42,
          top: drawTop,
          width: 36,
          height: 2,
          background: "black",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 42,
          top: drawTop + drawHeight - 2,
          width: 36,
          height: 2,
          background: "black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: drawLeft,
          top: 52,
          width: 2,
          height: 38,
          background: "black",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: drawLeft + drawWidth - 2,
          top: 52,
          width: 2,
          height: 38,
          background: "black",
        }}
      />

      {Array.from({ length: fields }).map((_, i) => {
        const colors = ["#fafafa", "#eef4ff"];
        return (
          <div
            key={`field-bg-${i}`}
            style={{
              position: "absolute",
              left: drawLeft + i * fieldPixelWidth,
              top: drawTop,
              width: fieldPixelWidth,
              height: drawHeight,
              background: colors[i % 2],
            }}
          />
        );
      })}

      {Array.from({ length: shadingCount }).map((_, i) => (
        <div
          key={`shade-${i}`}
          style={{
            position: "absolute",
            left: drawLeft,
            top: drawTop + (i * drawHeight) / shadingCount,
            width: drawWidth,
            height: 1,
            background: "#b9b9b9",
          }}
        />
      ))}

      {Array.from({ length: divisions }).map((_, i) => (
        <div
          key={`division-${i}`}
          style={{
            position: "absolute",
            left: drawLeft + (i + 1) * fieldPixelWidth,
            top: drawTop,
            width: 4,
            height: drawHeight,
            background: "#4b5563",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: drawLeft,
          top: drawTop,
          width: drawWidth,
          height: drawHeight,
          border: "4px solid black",
          boxSizing: "border-box",
        }}
      />

      {Array.from({ length: fields }).map((_, i) => (
        <div
          key={`field-name-${i}`}
          style={{
            position: "absolute",
            left: drawLeft + i * fieldPixelWidth,
            top: drawTop + 8,
            width: fieldPixelWidth,
            textAlign: "center",
            fontSize: 11,
            color: "#444",
            fontWeight: 700,
          }}
        >
          שדה {i + 1}
        </div>
      ))}

      {Array.from({ length: fields }).map((_, i) => {
        const left = drawLeft + i * fieldPixelWidth;
        const width = fieldPixelWidth;

        return (
          <div key={`field-dim-${i}`}>
            <div
              style={{
                position: "absolute",
                left,
                top: 430,
                width,
                height: 2,
                background: "black",
              }}
            />

            <div
              style={{
                position: "absolute",
                left,
                top: 426,
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderRight: "8px solid black",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: left + width - 8,
                top: 426,
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "8px solid black",
              }}
            />

            <div
              style={{
                position: "absolute",
                left,
                top: drawTop + drawHeight,
                width: 2,
                height: 30,
                background: "black",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: left + width - 2,
                top: drawTop + drawHeight,
                width: 2,
                height: 30,
                background: "black",
              }}
            />

            <div
              style={{
                position: "absolute",
                left,
                top: 438,
                width,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                background: "white",
              }}
            >
              {Math.round(fieldDisplayMm)} מ״מ
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: drawLeft,
          top: 475,
          fontSize: 11,
          color: "#444",
          fontWeight: 700,
        }}
      >
        מידות שדות
      </div>
    </div>
  );
}

function FrontView({
  overallLength,
  overallWidth,
  shadingCount,
}: {
  overallLength: number;
  overallWidth: number;
  shadingCount: number;
}) {
  const drawLeft = 80;
  const drawTop = 70;
  const drawWidth = 620;
  const drawHeight = 180;
  const slatPixelWidth = drawWidth / Math.max(shadingCount, 1);

  return (
    <div
      style={{
        marginTop: 24,
        width: 780,
        height: 320,
        position: "relative",
        background: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        שרטוט חזית
      </div>

      <HorizontalDimensionLine
        left={drawLeft}
        top={35}
        width={drawWidth}
        label={`${overallLength} מ״מ`}
      />

      <VerticalDimensionLine
        left={40}
        top={drawTop}
        height={drawHeight}
        label={`${overallWidth} מ״מ`}
      />

      <div
        style={{
          position: "absolute",
          left: 42,
          top: drawTop,
          width: 36,
          height: 2,
          background: "black",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 42,
          top: drawTop + drawHeight - 2,
          width: 36,
          height: 2,
          background: "black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: drawLeft,
          top: 37,
          width: 2,
          height: 33,
          background: "black",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: drawLeft + drawWidth - 2,
          top: 37,
          width: 2,
          height: 33,
          background: "black",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: drawLeft,
          top: drawTop,
          width: drawWidth,
          height: drawHeight,
          border: "4px solid black",
          boxSizing: "border-box",
          background: "#fafafa",
        }}
      />

      {Array.from({ length: shadingCount }).map((_, i) => (
        <div
          key={`front-slat-${i}`}
          style={{
            position: "absolute",
            left: drawLeft + i * slatPixelWidth,
            top: drawTop,
            width: 4,
            height: drawHeight,
            background: "#4b5563",
          }}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const [overallLength, setOverallLength] = useState(5000);
  const [overallWidth, setOverallWidth] = useState(3000);

  const techRef = useRef<HTMLDivElement>(null);
  const marketingRef = useRef<HTMLDivElement>(null);

  const frameWidth = 40;
  const divisionWidth = 40;
  const shadingWidth = 70;
  const shadingGap = 10;

  const calculations = useMemo(() => {
    const raw = overallLength / 1000;
    const whole = Math.floor(raw);
    const remainder = raw - whole;
    const fields = remainder <= 0.5 ? Math.max(1, whole) : Math.max(1, whole + 1);
    const divisions = Math.max(0, fields - 1);

    const fieldDisplayMm = (overallLength - 2 * frameWidth) / fields;

    const netWidthForShading = overallWidth - 2 * frameWidth;
    const shadingCount = Math.max(
      1,
      Math.floor(netWidthForShading / (shadingWidth + shadingGap))
    );

    return {
      fields,
      divisions,
      fieldDisplayMm,
      shadingCount,
    };
  }, [overallLength, overallWidth]);

  const exportPdf = async (
    type: "technical" | "marketing",
    filename: string
  ) => {
    const element = type === "technical" ? techRef.current : marketingRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight);
    pdf.save(filename);
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginTop: 0 }}>ALUMAX - מחשבון פרגולות</h1>

      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>אורך</label>
          <input
            type="number"
            value={overallLength}
            onChange={(e) => setOverallLength(Number(e.target.value))}
            style={{ padding: 8, width: 140 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>רוחב</label>
          <input
            type="number"
            value={overallWidth}
            onChange={(e) => setOverallWidth(Number(e.target.value))}
            style={{ padding: 8, width: 140 }}
          />
        </div>

        <button
          onClick={() => exportPdf("technical", "pergola-tech.pdf")}
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          PDF טכני
        </button>

        <button
          onClick={() => exportPdf("marketing", "pergola-marketing.pdf")}
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          PDF שיווקי
        </button>
      </div>

      <div ref={techRef}>
        <TopView
          overallLength={overallLength}
          overallWidth={overallWidth}
          fields={calculations.fields}
          divisions={calculations.divisions}
          fieldDisplayMm={calculations.fieldDisplayMm}
          shadingCount={calculations.shadingCount}
        />
      </div>

      <div ref={marketingRef}>
        <FrontView
          overallLength={overallLength}
          overallWidth={overallWidth}
          shadingCount={calculations.shadingCount}
        />
      </div>
    </div>
  );
}