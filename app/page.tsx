"use client";

import { useState } from "react";
import {
  calculatePergola,
  summarizeMaterials,
  frameProfiles,
  divisionProfiles,
  shadingProfiles,
} from "./lib/pergola-calculator";
import { optimizeCutList } from "./lib/cutting-optimizer";

type PergolaResult = ReturnType<typeof calculatePergola>;

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #e9eef5 100%)",
  padding: "32px 20px 60px",
  direction: "rtl",
  fontFamily: "Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1250,
  margin: "0 auto",
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#fff",
  borderRadius: 24,
  padding: "28px 28px 22px",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.18)",
  marginBottom: 24,
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
};

const heroSubtitleStyle: React.CSSProperties = {
  margin: "10px 0 0",
  fontSize: 16,
  opacity: 0.9,
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  border: "1px solid #e5e7eb",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 22,
  fontWeight: 700,
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
  borderRadius: 14,
  padding: "12px 14px",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fff",
};

const selectStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "12px 14px",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fff",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 18,
  border: "none",
  borderRadius: 16,
  padding: "14px 22px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#fff",
  boxShadow: "0 10px 20px rgba(37, 99, 235, 0.22)",
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

const twoColumnStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 20,
  marginTop: 24,
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.05)",
};

const metricTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
};

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};

const metricItemStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
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
  fontWeight: 700,
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
  minWidth: 780,
};

const cellHeaderStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px 10px",
  textAlign: "right",
  backgroundColor: "#f8fafc",
  color: "#334155",
  fontSize: 14,
  fontWeight: 700,
};

const cellStyle: React.CSSProperties = {
  borderBottom: "1px solid #eef2f7",
  padding: "12px 10px",
  textAlign: "right",
  verticalAlign: "top",
  fontSize: 14,
  color: "#0f172a",
};

const sectionSpacingStyle: React.CSSProperties = {
  marginTop: 24,
};

export default function Home() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [frameProfileName, setFrameProfileName] = useState("מלבן 120/40");
  const [divisionProfileName, setDivisionProfileName] = useState("T 120/40");
  const [shadingProfileName, setShadingProfileName] = useState("מלבן 70/20");
  const [shadingGap, setShadingGap] = useState("10");
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

  const materialSummary = result ? summarizeMaterials(result.cutList) : [];
  const optimization = result ? optimizeCutList(result.cutList, 6000) : null;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <h1 style={heroTitleStyle}>ALUMAX Pergola Builder</h1>
          <p style={heroSubtitleStyle}>
            מערכת חישוב פרגולות, רשימות חיתוך, הזמנת חומר ואופטימיזציית חיתוך
            למוטות חומר גלם.
          </p>
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
          </div>

          <button style={buttonStyle} onClick={handleCalculate}>
            חשב פרגולה
          </button>

          {error && <div style={errorStyle}>{error}</div>}
        </section>

        {result && (
          <>
            <section style={twoColumnStyle}>
              <div style={metricCardStyle}>
                <h3 style={metricTitleStyle}>נתוני פרופילים</h3>
                <div style={metricGridStyle}>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>רוחב אפקטיבי מסגרת</span>
                    <span style={metricValueStyle}>{result.frameWidth} מ״מ</span>
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

              <div style={metricCardStyle}>
                <h3 style={metricTitleStyle}>חלוקות ושדות</h3>
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
                    <span style={metricLabelStyle}>מרווח חלוקה סימטרי</span>
                    <span style={metricValueStyle}>
                      {result.divisionSpacing} מ״מ
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section style={twoColumnStyle}>
              <div style={metricCardStyle}>
                <h3 style={metricTitleStyle}>נתוני הצללה</h3>
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
                    <span style={metricLabelStyle}>כמות הצללות בכל שדה</span>
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
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>רוחב מנוצל בכל שדה</span>
                    <span style={metricValueStyle}>
                      {result.usedWidthPerField} מ״מ
                    </span>
                  </div>
                </div>
              </div>

              <div style={metricCardStyle}>
                <h3 style={metricTitleStyle}>שאריות והשלמות</h3>
                <div style={metricGridStyle}>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>שארית לפני השלמה</span>
                    <span style={metricValueStyle}>
                      {result.shadingRemainderPerField} מ״מ
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
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>שארית סופית</span>
                    <span style={metricValueStyle}>
                      {result.finalRemainderPerField} מ״מ
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>אורך פרופיל חלוקה</span>
                    <span style={metricValueStyle}>
                      {result.divisionCutLength} מ״מ
                    </span>
                  </div>
                  <div style={metricItemStyle}>
                    <span style={metricLabelStyle}>
                      אורך זווית / פרופיל משלים
                    </span>
                    <span style={metricValueStyle}>
                      {result.accessoryLengthPerField} מ״מ
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
                          <td style={cellStyle}>{item.group}</td>
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
                <h3 style={sectionTitleStyle}>רשימת חומר להזמנה</h3>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellHeaderStyle}>פרופיל</th>
                        <th style={cellHeaderStyle}>סה״כ יחידות</th>
                        <th style={cellHeaderStyle}>סה״כ אורך (מ״מ)</th>
                        <th style={cellHeaderStyle}>סה״כ אורך (מ׳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialSummary.map((item) => (
                        <tr key={item.profileName}>
                          <td style={cellStyle}>{item.profileName}</td>
                          <td style={cellStyle}>{item.totalPieces}</td>
                          <td style={cellStyle}>{item.totalLengthMm}</td>
                          <td style={cellStyle}>{item.totalLengthM}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={sectionSpacingStyle}>
              <div style={sectionCardStyle}>
                <h3 style={sectionTitleStyle}>
                  אופטימיזציית חיתוך למוטות 6000 מ״מ
                </h3>

                {optimization && (
                  <>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>סה״כ מוטות</span>
                        <span style={metricValueStyle}>
                          {optimization.totalBars}
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>סה״כ אורך מנוצל</span>
                        <span style={metricValueStyle}>
                          {optimization.totalUsedLength} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>סה״כ שארית</span>
                        <span style={metricValueStyle}>
                          {optimization.totalRemainingLength} מ״מ
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>אחוז ניצול כולל</span>
                        <span style={metricValueStyle}>
                          {optimization.overallUtilizationPercent}%
                        </span>
                      </div>
                    </div>

                    {optimization.profiles.map((profile) => (
                      <div key={profile.profileName} style={{ marginTop: 28 }}>
                        <h4
                          style={{
                            margin: "0 0 12px",
                            fontSize: 18,
                            color: "#0f172a",
                          }}
                        >
                          {profile.profileName}
                        </h4>

                        <div style={metricGridStyle}>
                          <div style={metricItemStyle}>
                            <span style={metricLabelStyle}>כמות מוטות</span>
                            <span style={metricValueStyle}>
                              {profile.totalBars}
                            </span>
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
                                <tr
                                  key={`${profile.profileName}-${bar.barNumber}`}
                                >
                                  <td style={cellStyle}>{bar.barNumber}</td>
                                  <td style={cellStyle}>
                                    {bar.pieces.map((piece, index) => (
                                      <div key={index}>
                                        {piece.length} מ״מ ({piece.cutType})
                                      </div>
                                    ))}
                                  </td>
                                  <td style={cellStyle}>
                                    {bar.usedLength} מ״מ
                                  </td>
                                  <td style={cellStyle}>
                                    {bar.remainingLength} מ״מ
                                  </td>
                                  <td style={cellStyle}>
                                    {bar.utilizationPercent}%
                                  </td>
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