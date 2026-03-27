"use client";

import { useMemo, useState } from "react";
import {
  calculatePergola,
  summarizeMaterials,
  frameProfiles,
  divisionProfiles,
  shadingProfiles,
} from "./lib/pergola-calculator";
import { optimizeCutList } from "./lib/cutting-optimizer";

type PergolaResult = ReturnType<typeof calculatePergola>;
type StockLengthOption = 6000 | 6500 | 7000;
type StockMode = "auto" | StockLengthOption;

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top right, #dbeafe 0%, #f8fafc 28%, #eef2f7 65%, #e2e8f0 100%)",
  padding: "28px 18px 60px",
  direction: "rtl",
  fontFamily: "Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1320,
  margin: "0 auto",
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
  color: "#fff",
  borderRadius: 28,
  padding: "30px 28px",
  boxShadow: "0 24px 50px rgba(15, 23, 42, 0.18)",
  marginBottom: 24,
  display: "grid",
  gridTemplateColumns: "1.6fr 1fr",
  gap: 18,
  alignItems: "center",
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 34,
  fontWeight: 800,
  letterSpacing: 0.3,
};

const heroSubtitleStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 16,
  opacity: 0.92,
  lineHeight: 1.7,
};

const heroStatWrapStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
  gap: 12,
};

const heroStatStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 18,
  padding: "14px 16px",
  backdropFilter: "blur(6px)",
};

const heroStatLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  opacity: 0.82,
  marginBottom: 6,
};

const heroStatValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: 22,
  fontWeight: 800,
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 24,
  padding: 22,
  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
  border: "1px solid #e5e7eb",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 16px",
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

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#334155",
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: "13px 14px",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fff",
};

const selectStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: "13px 14px",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fff",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 16,
  padding: "14px 22px",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#fff",
  boxShadow: "0 10px 20px rgba(37, 99, 235, 0.22)",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: "14px 18px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
};

const errorStyle: React.CSSProperties = {
  marginTop: 18,
  color: "#b91c1c",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 700,
};

const summaryStripStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
  marginTop: 24,
};

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 16,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
};

const summaryLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#64748b",
  marginBottom: 8,
  fontWeight: 700,
};

const summaryValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
};

const twoColumnStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: 20,
  marginTop: 24,
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  padding: 18,
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.05)",
};

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};

const metricItemStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "12px 14px",
};

const metricLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#64748b",
  marginBottom: 6,
  fontWeight: 700,
};

const metricValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
};

const tableWrapStyle: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 12,
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 800,
};

const cellHeaderStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px 10px",
  textAlign: "right",
  backgroundColor: "#f8fafc",
  color: "#334155",
  fontSize: 14,
  fontWeight: 800,
  position: "sticky",
  top: 0,
};

const cellStyle: React.CSSProperties = {
  borderBottom: "1px solid #eef2f7",
  padding: "12px 10px",
  textAlign: "right",
  verticalAlign: "top",
  fontSize: 14,
  color: "#0f172a",
};

const badgeStyle = (textColor: string, background: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  color: textColor,
  background,
});

const sectionSpacingStyle: React.CSSProperties = {
  marginTop: 24,
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
    if (a.optimization.totalRemainingLength !== b.optimization.totalRemainingLength) {
      return a.optimization.totalRemainingLength - b.optimization.totalRemainingLength;
    }

    if (a.optimization.totalBars !== b.optimization.totalBars) {
      return a.optimization.totalBars - b.optimization.totalBars;
    }

    return b.optimization.overallUtilizationPercent - a.optimization.overallUtilizationPercent;
  });

  return evaluated[0];
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

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div>
            <h1 style={heroTitleStyle}>ALUMAX Pergola Builder Pro</h1>
            <p style={heroSubtitleStyle}>
              מערכת עבודה מקצועית לחישוב פרגולות, רשימות חיתוך, הזמנת חומר
              ואופטימיזציית חיתוך. בנויה לשימוש אמיתי במשרד, בייצור ובשטח.
            </p>
          </div>

          <div style={heroStatWrapStyle}>
            <div style={heroStatStyle}>
              <span style={heroStatLabelStyle}>סטטוס מערכת</span>
              <span style={heroStatValueStyle}>פעילה</span>
            </div>
            <div style={heroStatStyle}>
              <span style={heroStatLabelStyle}>סוג חישוב</span>
              <span style={heroStatValueStyle}>פרגולות</span>
            </div>
            <div style={heroStatStyle}>
              <span style={heroStatLabelStyle}>מצב מוט נבחר</span>
              <span style={heroStatValueStyle}>
                {stockMode === "auto" ? "אוטומטי" : `${stockMode} מ״מ`}
              </span>
            </div>
            <div style={heroStatStyle}>
              <span style={heroStatLabelStyle}>מוט בשימוש</span>
              <span style={heroStatValueStyle}>
                {selectedStockLength ? `${selectedStockLength} מ״מ` : "-"}
              </span>
            </div>
          </div>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>נתוני פרויקט</h2>

          <div style={gridStyle}>
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
                style={selectStyle}
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
                style={selectStyle}
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
                style={selectStyle}
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
              <label style={labelStyle}>מרווח בין פרופילי הצללה (מ״מ)</label>
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
                style={selectStyle}
                value={String(stockMode)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "auto") {
                    setStockMode("auto");
                  } else {
                    setStockMode(Number(value) as StockLengthOption);
                  }
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
            <button style={buttonStyle} onClick={handleCalculate}>
              חשב פרגולה
            </button>
            <button style={secondaryButtonStyle} onClick={printPage}>
              הדפס / שמור PDF
            </button>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
        </section>

        {result && (
          <>
            <section style={summaryStripStyle}>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>מספר שדות</span>
                <span style={summaryValueStyle}>{result.fields}</span>
              </div>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>מספר חלוקות</span>
                <span style={summaryValueStyle}>{result.divisions}</span>
              </div>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>סה״כ הצללות</span>
                <span style={summaryValueStyle}>{result.totalShadingPieces}</span>
              </div>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>סה״כ מטר להזמנה</span>
                <span style={summaryValueStyle}>{totalOrderMeters.toFixed(2)}</span>
              </div>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>סה״כ מוטות</span>
                <span style={summaryValueStyle}>
                  {optimization ? optimization.totalBars : 0}
                </span>
              </div>
              <div style={summaryCardStyle}>
                <span style={summaryLabelStyle}>ניצול כולל</span>
                <span style={summaryValueStyle}>
                  {optimization ? `${optimization.overallUtilizationPercent}%` : "0%"}
                </span>
              </div>
            </section>

            <section style={twoColumnStyle}>
              <div style={metricCardStyle}>
                <h3 style={subTitleStyle}>נתוני פרופילים</h3>
                <div style={metricGridStyle}>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>רוחב אפקטיבי מסגרת</span>
                    <span style={metricValueStyle}>{result.frameWidth} מ״מ</span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>רוחב אפקטיבי חלוקה</span>
                    <span style={metricValueStyle}>{result.divisionWidth} מ״מ</span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>רוחב אפקטיבי הצללה</span>
                    <span style={metricValueStyle}>{result.shadingWidth} מ״מ</span>
                  </div>
                </div>
              </div>

              <div style={metricCardStyle}>
                <h3 style={subTitleStyle}>חלוקות ושדות</h3>
                <div style={metricGridStyle}>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>מרווח חלוקה סימטרי</span>
                    <span style={metricValueStyle}>{result.divisionSpacing} מ״מ</span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אורך פרופיל חלוקה</span>
                    <span style={metricValueStyle}>{result.divisionCutLength} מ״מ</span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אורך זווית / פרופיל משלים</span>
                    <span style={metricValueStyle}>
                      {result.accessoryLengthPerField} מ״מ
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section style={twoColumnStyle}>
              <div style={metricCardStyle}>
                <h3 style={subTitleStyle}>נתוני הצללה</h3>
                <div style={metricGridStyle}>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אורך נטו להצללה</span>
                    <span style={metricValueStyle}>
                      {result.netLengthForShading} מ״מ
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אורך שדה לפני הפחתה</span>
                    <span style={metricValueStyle}>
                      {result.shadingFieldLength} מ״מ
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
                    <span style={metricLabelStyle}>רוחב מנוצל בכל שדה</span>
                    <span style={metricValueStyle}>
                      {result.usedWidthPerField} מ״מ
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>שארית לפני השלמה</span>
                    <span style={metricValueStyle}>
                      {result.shadingRemainderPerField} מ״מ
                    </span>
                  </div>
                </div>
              </div>

              <div style={metricCardStyle}>
                <h3 style={subTitleStyle}>שאריות והשלמות</h3>
                <div style={metricGridStyle}>
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
                      {result.hasCompletionProfile ? result.completionPiecesTotal : 0}
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>שארית סופית</span>
                    <span style={metricValueStyle}>
                      {result.finalRemainderPerField} מ״מ
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אביזר לכל שדה</span>
                    <span style={metricValueStyle}>
                      {result.isZLouver ? "פרופיל 20/40" : "זווית 30/30"}
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>סה״כ אביזרים</span>
                    <span style={metricValueStyle}>
                      {result.accessoryPiecesTotal}
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>מצב הצללה</span>
                    <span style={metricValueStyle}>
                      {result.isZLouver ? "רפפה Z" : "הצללה רגילה"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section style={sectionSpacingStyle}>
              <div style={sectionCardStyle}>
                <h3 style={sectionTitleStyle}>רשימת חיתוכים</h3>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellHeaderStyle}>קבוצה</th>
                        <th style={cellHeaderStyle}>פרופיל</th>
                        <th style={cellHeaderStyle}>כמות</th>
                        <th style={cellHeaderStyle}>אורך</th>
                        <th style={cellHeaderStyle}>סוג חיתוך</th>
                        <th style={cellHeaderStyle}>הערה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.cutList.map((item, index) => (
                        <tr key={`${item.group}-${item.profileName}-${index}`}>
                          <td style={cellStyle}>
                            <span
                              style={
                                item.group === "מסגרת"
                                  ? badgeStyle("#92400e", "#fef3c7")
                                  : item.group === "חלוקות"
                                  ? badgeStyle("#1d4ed8", "#dbeafe")
                                  : badgeStyle("#065f46", "#d1fae5")
                              }
                            >
                              {item.group}
                            </span>
                          </td>
                          <td style={cellStyle}>{item.profileName}</td>
                          <td style={cellStyle}>{item.quantity}</td>
                          <td style={cellStyle}>{item.length} מ״מ</td>
                          <td style={cellStyle}>{item.cutType}</td>
                          <td style={cellStyle}>{item.note || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={sectionSpacingStyle}>
              <div style={sectionCardStyle}>
                <h3 style={sectionTitleStyle}>רשימת חומר להזמנה (לפי ניצול מוטות)</h3>

                {selectedStockLength && (
                  <p style={{ margin: "0 0 10px", color: "#334155", fontWeight: 700 }}>
                    אורך מוט בשימוש: {selectedStockLength} מ״מ
                    {stockMode === "auto" ? " (נבחר אוטומטית)" : ""}
                  </p>
                )}

                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellHeaderStyle}>פרופיל</th>
                        <th style={cellHeaderStyle}>סה״כ יחידות</th>
                        <th style={cellHeaderStyle}>אורך מוט</th>
                        <th style={cellHeaderStyle}>כמות מוטות להזמנה</th>
                        <th style={cellHeaderStyle}>אורך מנוצל</th>
                        <th style={cellHeaderStyle}>שארית כוללת</th>
                        <th style={cellHeaderStyle}>ניצול</th>
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
                            <td style={cellStyle}>{profile.profileName}</td>
                            <td style={cellStyle}>{totalPieces}</td>
                            <td style={cellStyle}>{selectedStockLength} מ״מ</td>
                            <td style={cellStyle}>
                              <strong>{profile.totalBars}</strong>
                            </td>
                            <td style={cellStyle}>{profile.totalUsedLength} מ״מ</td>
                            <td style={cellStyle}>{profile.totalRemainingLength} מ״מ</td>
                            <td style={cellStyle}>
                              <strong>{profile.utilizationPercent}%</strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={sectionSpacingStyle}>
              <div style={sectionCardStyle}>
                <h3 style={sectionTitleStyle}>
                  אופטימיזציית חיתוך למוטות {selectedStockLength ?? "-"} מ״מ
                </h3>

                {optimization && (
                  <>
                    <div style={summaryStripStyle}>
                      <div style={summaryCardStyle}>
                        <span style={summaryLabelStyle}>סה״כ מוטות</span>
                        <span style={summaryValueStyle}>{optimization.totalBars}</span>
                      </div>
                      <div style={summaryCardStyle}>
                        <span style={summaryLabelStyle}>אורך מנוצל</span>
                        <span style={summaryValueStyle}>
                          {optimization.totalUsedLength}
                        </span>
                      </div>
                      <div style={summaryCardStyle}>
                        <span style={summaryLabelStyle}>סה״כ שארית</span>
                        <span style={summaryValueStyle}>
                          {optimization.totalRemainingLength}
                        </span>
                      </div>
                      <div style={summaryCardStyle}>
                        <span style={summaryLabelStyle}>אחוז ניצול כולל</span>
                        <span style={summaryValueStyle}>
                          {optimization.overallUtilizationPercent}%
                        </span>
                      </div>
                    </div>

                    {optimization.profiles.map((profile) => (
                      <div key={profile.profileName} style={{ marginTop: 28 }}>
                        <h4 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800 }}>
                          {profile.profileName}
                        </h4>

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

                        <div style={tableWrapStyle}>
                          <table style={tableStyle}>
                            <thead>
                              <tr>
                                <th style={cellHeaderStyle}>מוט</th>
                                <th style={cellHeaderStyle}>חיתוכים</th>
                                <th style={cellHeaderStyle}>אורך מנוצל</th>
                                <th style={cellHeaderStyle}>שארית</th>
                                <th style={cellHeaderStyle}>ניצול</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profile.bars.map((bar) => (
                                <tr key={`${profile.profileName}-${bar.barNumber}`}>
                                  <td style={cellStyle}>{bar.barNumber}</td>
                                  <td style={cellStyle}>
                                    {bar.pieces.map((piece, index) => (
                                      <div key={index}>
                                        {piece.length} מ״מ ({piece.cutType})
                                      </div>
                                    ))}
                                  </td>
                                  <td style={cellStyle}>{bar.usedLength} מ״מ</td>
                                  <td style={cellStyle}>{bar.remainingLength} מ״מ</td>
                                  <td style={cellStyle}>{bar.utilizationPercent}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
