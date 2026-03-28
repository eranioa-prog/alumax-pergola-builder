"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  calculatePergola,
  summarizeMaterials,
  frameProfiles,
  divisionProfiles,
  shadingProfiles,
} from "./lib/pergola-calculator";
import { optimizeCutList } from "./lib/cutting-optimizer";

const Pergola3D = dynamic(() => import("./components/Pergola3D"), {
  ssr: false,
});

type PergolaResult = ReturnType<typeof calculatePergola>;
type StockLengthOption = 6000 | 6500 | 7000;
type StockMode = "auto" | StockLengthOption;

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
  direction: "rtl",
  fontFamily: "Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1400,
  margin: "0 auto",
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
  color: "#fff",
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.18)",
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 800,
};

const heroSubtitleStyle: React.CSSProperties = {
  margin: "10px 0 0",
  opacity: 0.92,
  lineHeight: 1.7,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
};

const subTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "12px 14px",
  fontSize: 15,
  background: "#fff",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 18,
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
};

const errorStyle: React.CSSProperties = {
  marginTop: 14,
  padding: "12px 14px",
  borderRadius: 12,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontWeight: 700,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const summaryCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 700,
  marginBottom: 8,
  display: "block",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
  display: "block",
};

const twoColumnStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: 20,
};

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};

const metricItemStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 12,
};

const metricLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#64748b",
  fontWeight: 700,
  marginBottom: 6,
};

const metricValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
};

const tableWrapStyle: React.CSSProperties = {
  overflowX: "auto",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#fff",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 860,
};

const thStyle: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f8fafc",
  textAlign: "right",
  fontSize: 14,
  fontWeight: 800,
  color: "#334155",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid #eef2f7",
  textAlign: "right",
  fontSize: 14,
  color: "#0f172a",
  verticalAlign: "top",
};

function printPage() {
  if (typeof window !== "undefined") {
    window.print();
  }
}

function chooseBestOptimization(
  result: PergolaResult | null,
  mode: StockMode
) {
  if (!result) return null;

  if (mode !== "auto") {
    return {
      selectedStockLength: mode,
      optimization: optimizeCutList(result.cutList, mode),
    };
  }

  const candidates: StockLengthOption[] = [6000, 6500, 7000];

  const evaluated = candidates.map((length) => ({
    selectedStockLength: length,
    optimization: optimizeCutList(result.cutList, length),
  }));

  evaluated.sort((a, b) => {
    if (
      a.optimization.totalRemainingLength !== b.optimization.totalRemainingLength
    ) {
      return (
        a.optimization.totalRemainingLength - b.optimization.totalRemainingLength
      );
    }

    if (a.optimization.totalBars !== b.optimization.totalBars) {
      return a.optimization.totalBars - b.optimization.totalBars;
    }

    return (
      b.optimization.overallUtilizationPercent -
      a.optimization.overallUtilizationPercent
    );
  });

  return evaluated[0];
}

function HorizontalDimensionLine({
  left,
  top,
  width,
  label,
}: {
  left: number;
  top: number;
  width: number;
  label: string;
}) {
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
}: {
  left: number;
  top: number;
  height: number;
  label: string;
}) {
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
  fieldOpeningMm,
  shadingCount,
}: {
  overallLength: number;
  overallWidth: number;
  fields: number;
  divisions: number;
  fieldOpeningMm: number;
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
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        שרטוט עליון
      </div>

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
              {Math.round(fieldOpeningMm)} מ״מ
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
        פתח שדה נטו
      </div>
    </div>
  );
}


export default function Home() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [frameProfileName, setFrameProfileName] = useState("מלבן 120/40");
  const [divisionProfileName, setDivisionProfileName] = useState("T 120/40");
  const [shadingProfileName, setShadingProfileName] = useState("מלבן 70/20");
  const [shadingGap, setShadingGap] = useState("10");
  const [stockMode, setStockMode] = useState<StockMode>(6000);
  const [result, setResult] = useState<PergolaResult | null>(null);
  const [error, setError] = useState("");

  const techPdfRef = useRef<HTMLDivElement>(null);
  const marketingPdfRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setError("");

    const parsedLength = Number(length);
    const parsedWidth = Number(width);
    const parsedGap = Number(shadingGap);

    if (!parsedLength || !parsedWidth) {
      setError("יש להזין אורך ורוחב תקינים");
      setResult(null);
      return;
    }

    try {
      const calculation = calculatePergola({
        length: parsedLength,
        width: parsedWidth,
        frameProfileName,
        divisionProfileName,
        shadingProfileName,
        shadingGap: parsedGap || 10,
      });

      setResult(calculation);
    } catch {
      setError("אירעה שגיאה בחישוב");
      setResult(null);
    }
  };

  const materialSummary = useMemo(
    () => (result ? summarizeMaterials(result.cutList) : []),
    [result]
  );

  const bestOptimizationResult = useMemo(
    () => chooseBestOptimization(result, stockMode),
    [result, stockMode]
  );

  const optimization = bestOptimizationResult?.optimization ?? null;
  const selectedStockLength = bestOptimizationResult?.selectedStockLength ?? null;

  const totalOrderMeters = useMemo(
    () =>
      materialSummary.reduce((sum, item) => sum + Number(item.totalLengthM), 0),
    [materialSummary]
  );

  const correctedFieldOpeningMm = useMemo(() => {
    if (!result || !length) return 0;

    const parsedLength = Number(length);
    if (!parsedLength) return 0;

    return (
      (parsedLength -
        2 * result.frameWidth -
        result.divisions * result.divisionWidth) /
      result.fields
    );
  }, [result, length]);

  const exportPdf = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
    orientation: "portrait" | "landscape" = "landscape"
  ) => {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const ratio = Math.min(
      availableWidth / canvas.width,
      availableHeight / canvas.height
    );

    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(filename);
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <h1 style={heroTitleStyle}>ALUMAX Pergola Builder</h1>
          <p style={heroSubtitleStyle}>
            מערכת חישוב, שרטוט, רשימות חיתוך, רשימות הזמנה, אופטימיזציית חומר והדמיה תלת־ממדית.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>נתוני פרויקט</h2>

          <div style={formGridStyle}>
            <div style={fieldWrapStyle}>
              <label style={labelStyle}>אורך פרגולה (מ״מ)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="לדוגמה 5000"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>רוחב פרגולה (מ״מ)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="לדוגמה 3000"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>סוג פרופיל מסגרת</label>
              <select
                style={inputStyle}
                value={frameProfileName}
                onChange={(e) => setFrameProfileName(e.target.value)}
              >
                {frameProfiles.map((profile) => (
                  <option key={profile.name} value={profile.name}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>סוג פרופיל חלוקה</label>
              <select
                style={inputStyle}
                value={divisionProfileName}
                onChange={(e) => setDivisionProfileName(e.target.value)}
              >
                {divisionProfiles.map((profile) => (
                  <option key={profile.name} value={profile.name}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>סוג פרופיל הצללה</label>
              <select
                style={inputStyle}
                value={shadingProfileName}
                onChange={(e) => setShadingProfileName(e.target.value)}
              >
                {shadingProfiles.map((profile) => (
                  <option key={profile.name} value={profile.name}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>מרווח בין הצללות (מ״מ)</label>
              <input
                style={inputStyle}
                type="number"
                value={shadingGap}
                onChange={(e) => setShadingGap(e.target.value)}
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>אורך מוט חומר גלם</label>
              <select
                style={inputStyle}
                value={String(stockMode)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "auto") setStockMode("auto");
                  else setStockMode(Number(value) as StockLengthOption);
                }}
              >
                <option value="6000">6000 מ״מ</option>
                <option value="6500">6500 מ״מ</option>
                <option value="7000">7000 מ״מ</option>
                <option value="auto">אוטומטי</option>
              </select>
            </div>
          </div>

          <div style={actionRowStyle}>
            <button style={primaryButtonStyle} onClick={handleCalculate}>
              חשב פרגולה
            </button>

            <button style={secondaryButtonStyle} onClick={printPage}>
              הדפס
            </button>

            <button
              style={secondaryButtonStyle}
              onClick={() => exportPdf(techPdfRef, "pergola-tech.pdf")}
            >
              PDF טכני
            </button>

            <button
              style={secondaryButtonStyle}
              onClick={() =>
                exportPdf(marketingPdfRef, "pergola-marketing.pdf")
              }
            >
              PDF שיווקי
            </button>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
        </section>

        {result && (
          <>
            <section style={{ marginTop: 24 }}>
              <div style={summaryGridStyle}>
                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>מספר שדות</span>
                  <span style={summaryValueStyle}>{result.fields}</span>
                </div>

                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>מספר חלוקות</span>
                  <span style={summaryValueStyle}>{result.divisions}</span>
                </div>

                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>פתח שדה נטו</span>
                  <span style={summaryValueStyle}>
                    {correctedFieldOpeningMm.toFixed(1)}
                  </span>
                </div>

                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>סה״כ הצללות</span>
                  <span style={summaryValueStyle}>
                    {result.totalShadingPieces}
                  </span>
                </div>

                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>סה״כ מטר להזמנה</span>
                  <span style={summaryValueStyle}>
                    {totalOrderMeters.toFixed(2)}
                  </span>
                </div>

                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>מוט נבחר</span>
                  <span style={summaryValueStyle}>
                    {selectedStockLength ? `${selectedStockLength}` : "-"}
                  </span>
                </div>
              </div>
            </section>

            <div style={{ marginTop: 24 }} ref={techPdfRef}>
              <section style={cardStyle}>
                <h2 style={sectionTitleStyle}>שרטוטים טכניים</h2>

                <TopView
                  overallLength={Number(length)}
                  overallWidth={Number(width)}
                  fields={result.fields}
                  divisions={result.divisions}
                  fieldOpeningMm={correctedFieldOpeningMm}
                  shadingCount={result.shadingPiecesPerField}
                />

              </section>

              <section style={{ ...cardStyle, marginTop: 20 }}>
                <h2 style={sectionTitleStyle}>נתונים טכניים</h2>

                <div style={twoColumnStyle}>
                  <div>
                    <h3 style={subTitleStyle}>פרופילים</h3>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>רוחב אפקטיבי מסגרת</span>
                        <span style={metricValueStyle}>
                          {result.frameWidth} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>רוחב אפקטיבי חלוקה</span>
                        <span style={metricValueStyle}>
                          {result.divisionWidth} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>רוחב אפקטיבי הצללה</span>
                        <span style={metricValueStyle}>
                          {result.shadingWidth} מ״מ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={subTitleStyle}>שדות וחלוקות</h3>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>מספר שדות</span>
                        <span style={metricValueStyle}>{result.fields}</span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>מספר חלוקות</span>
                        <span style={metricValueStyle}>{result.divisions}</span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>פתח שדה נטו</span>
                        <span style={metricValueStyle}>
                          {correctedFieldOpeningMm.toFixed(1)} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אורך פרופיל חלוקה</span>
                        <span style={metricValueStyle}>
                          {result.divisionCutLength} מ״מ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={subTitleStyle}>הצללות</h3>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אורך נטו להצללה</span>
                        <span style={metricValueStyle}>
                        {result.shadingNetLength} מ"מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אורך חיתוך הצללה</span>
                        <span style={metricValueStyle}>
                          {result.shadingCutLength} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>כמות בכל שדה</span>
                        <span style={metricValueStyle}>
                          {result.shadingPiecesPerField}
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>סה״כ הצללות</span>
                        <span style={metricValueStyle}>
                          {result.totalShadingPieces}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={subTitleStyle}>שאריות והשלמות</h3>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>שארית לפני השלמה</span>
                        <span style={metricValueStyle}>
                          {result.shadingRemainderPerField} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>שארית סופית</span>
                        <span style={metricValueStyle}>
                        {result.shadingRemainderPerField}מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>פרופיל השלמה</span>
                        <span style={metricValueStyle}>
                          {result.hasCompletionProfile
                            ? result.completionProfileName
                            : "לא נדרש"}
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>כמות השלמות</span>
                        <span style={metricValueStyle}>
                          {result.hasCompletionProfile
                            ? result.completionPiecesTotal
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ ...cardStyle, marginTop: 20 }}>
                <h2 style={sectionTitleStyle}>רשימת חיתוכים</h2>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>קבוצה</th>
                        <th style={thStyle}>פרופיל</th>
                        <th style={thStyle}>כמות</th>
                        <th style={thStyle}>אורך</th>
                        <th style={thStyle}>סוג חיתוך</th>
                        <th style={thStyle}>הערה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.cutList.map((item, index) => (
                        <tr key={`${item.group}-${item.profileName}-${index}`}>
                          <td style={tdStyle}>{item.group}</td>
                          <td style={tdStyle}>{item.profileName}</td>
                          <td style={tdStyle}>{item.quantity}</td>
                          <td style={tdStyle}>{item.length} מ״מ</td>
                          <td style={tdStyle}>{item.cutType}</td>
                          <td style={tdStyle}>{item.note || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ ...cardStyle, marginTop: 20 }}>
                <h2 style={sectionTitleStyle}>רשימת חומר להזמנה (לפי ניצול מוטות)</h2>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>פרופיל</th>
                        <th style={thStyle}>סה״כ יחידות</th>
                        <th style={thStyle}>אורך מוט</th>
                        <th style={thStyle}>כמות מוטות להזמנה</th>
                        <th style={thStyle}>אורך מנוצל</th>
                        <th style={thStyle}>שארית כוללת</th>
                        <th style={thStyle}>ניצול</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optimization?.profiles.map((profile) => {
                        const totalPieces = profile.bars.reduce(
                          (sum, bar) => sum + bar.pieces.length,
                          0
                        );

                        return (
                          <tr key={profile.profileName}>
                            <td style={tdStyle}>{profile.profileName}</td>
                            <td style={tdStyle}>{totalPieces}</td>
                            <td style={tdStyle}>{selectedStockLength} מ״מ</td>
                            <td style={tdStyle}>
                              <strong>{profile.totalBars}</strong>
                            </td>
                            <td style={tdStyle}>{profile.totalUsedLength} מ״מ</td>
                            <td style={tdStyle}>
                              {profile.totalRemainingLength} מ״מ
                            </td>
                            <td style={tdStyle}>
                              <strong>{profile.utilizationPercent}%</strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ ...cardStyle, marginTop: 20 }}>
                <h2 style={sectionTitleStyle}>סיכום חומר כללי</h2>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>פרופיל</th>
                        <th style={thStyle}>סה״כ יחידות</th>
                        <th style={thStyle}>סה״כ אורך (מ״מ)</th>
                        <th style={thStyle}>סה״כ אורך (מ׳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialSummary.map((item) => (
                        <tr key={item.profileName}>
                          <td style={tdStyle}>{item.profileName}</td>
                          <td style={tdStyle}>{item.totalPieces}</td>
                          <td style={tdStyle}>{item.totalLengthMm}</td>
                          <td style={tdStyle}>{item.totalLengthM}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ ...cardStyle, marginTop: 20 }}>
                <h2 style={sectionTitleStyle}>
                  אופטימיזציית חיתוך למוטות {selectedStockLength ?? "-"} מ״מ
                </h2>

                <div style={summaryGridStyle}>
                  <div style={summaryCardStyle}>
                    <span style={summaryLabelStyle}>סה״כ מוטות</span>
                    <span style={summaryValueStyle}>
                      {optimization ? optimization.totalBars : 0}
                    </span>
                  </div>

                  <div style={summaryCardStyle}>
                    <span style={summaryLabelStyle}>אורך מנוצל</span>
                    <span style={summaryValueStyle}>
                      {optimization ? optimization.totalUsedLength : 0}
                    </span>
                  </div>

                  <div style={summaryCardStyle}>
                    <span style={summaryLabelStyle}>סה״כ שארית</span>
                    <span style={summaryValueStyle}>
                      {optimization ? optimization.totalRemainingLength : 0}
                    </span>
                  </div>

                  <div style={summaryCardStyle}>
                    <span style={summaryLabelStyle}>אחוז ניצול כולל</span>
                    <span style={summaryValueStyle}>
                      {optimization
                        ? `${optimization.overallUtilizationPercent}%`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {optimization?.profiles.map((profile) => (
                  <div key={profile.profileName} style={{ marginTop: 24 }}>
                    <h3 style={subTitleStyle}>{profile.profileName}</h3>

                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>כמות מוטות</span>
                        <span style={metricValueStyle}>{profile.totalBars}</span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אורך מנוצל</span>
                        <span style={metricValueStyle}>
                          {profile.totalUsedLength} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>שארית כוללת</span>
                        <span style={metricValueStyle}>
                          {profile.totalRemainingLength} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אחוז ניצול</span>
                        <span style={metricValueStyle}>
                          {profile.utilizationPercent}%
                        </span>
                      </div>
                    </div>

                    <div style={{ ...tableWrapStyle, marginTop: 14 }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={thStyle}>מוט</th>
                            <th style={thStyle}>חיתוכים</th>
                            <th style={thStyle}>אורך מנוצל</th>
                            <th style={thStyle}>שארית</th>
                            <th style={thStyle}>ניצול</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profile.bars.map((bar) => (
                            <tr key={`${profile.profileName}-${bar.barNumber}`}>
                              <td style={tdStyle}>{bar.barNumber}</td>
                              <td style={tdStyle}>
                                {bar.pieces.map((piece, index) => (
                                  <div key={index}>
                                    {piece.length} מ״מ ({piece.cutType})
                                  </div>
                                ))}
                              </td>
                              <td style={tdStyle}>{bar.usedLength} מ״מ</td>
                              <td style={tdStyle}>{bar.remainingLength} מ״מ</td>
                              <td style={tdStyle}>{bar.utilizationPercent}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <section style={{ ...cardStyle, marginTop: 20 }}>
              <h2 style={sectionTitleStyle}>הדמיה תלת־ממדית</h2>
              <p style={{ marginTop: 0, color: "#64748b" }}>
                הדמיה אינטראקטיבית לתצוגה במסך. אינה נכללת ב־PDF כדי לשמור על ייצוא יציב ונקי.
              </p>

              <div
                style={{
                  width: "100%",
                  height: 480,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                <Pergola3D
                  length={Number(length)}
                  width={Number(width)}
                  fields={result.fields}
                  slatCount={result.shadingPiecesPerField}
                />
              </div>
            </section>

            <div
              ref={marketingPdfRef}
              style={{
                position: "absolute",
                left: "-10000px",
                top: 0,
                width: 1100,
                background: "white",
                padding: 24,
              }}
            >
              <h1
                style={{
                  margin: "0 0 12px",
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: 800,
                }}
              >
                ALUMAX
              </h1>

              <p
                style={{
                  margin: "0 0 20px",
                  textAlign: "center",
                  color: "#475569",
                  fontSize: 18,
                }}
              >
                הדמיית פרגולה ותמצית פרויקט
              </p>

              <div style={summaryGridStyle}>
                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>אורך</span>
                  <span style={summaryValueStyle}>{length} מ״מ</span>
                </div>
                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>רוחב</span>
                  <span style={summaryValueStyle}>{width} מ״מ</span>
                </div>
                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>מספר שדות</span>
                  <span style={summaryValueStyle}>{result.fields}</span>
                </div>
                <div style={summaryCardStyle}>
                  <span style={summaryLabelStyle}>סוג הצללה</span>
                  <span style={summaryValueStyle}>{shadingProfileName}</span>
                </div>
              </div>

              <TopView
                overallLength={Number(length)}
                overallWidth={Number(width)}
                fields={result.fields}
                divisions={result.divisions}
                fieldOpeningMm={correctedFieldOpeningMm}
                shadingCount={result.shadingPiecesPerField}
              />


            </div>
          </>
        )}
      </div>
    </main>
  );
}