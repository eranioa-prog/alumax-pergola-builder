"use client";

import { optimizeCutList } from "./lib/cutting-optimizer";
import { useState } from "react";
import {
  calculatePergola,
  summarizeMaterials,
  frameProfiles,
  divisionProfiles,
  shadingProfiles,
} from "./lib/pergola-calculator";

type PergolaResult = ReturnType<typeof calculatePergola>;

const cellHeaderStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "right",
  backgroundColor: "#f3f3f3",
};

const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "right",
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
    <main style={{ padding: 40, maxWidth: 1000 }}>
      <h1>Alumax Pergola Builder</h1>
      <p>ברוך הבא למערכת תכנון פרגולות</p>

      <div style={{ marginTop: 20 }}>
        <label>אורך פרגולה (מ״מ)</label>
        <br />
        <input
          type="number"
          placeholder="לדוגמה 5000"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>רוחב פרגולה (מ״מ)</label>
        <br />
        <input
          type="number"
          placeholder="לדוגמה 3000"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>סוג פרופיל מסגרת</label>
        <br />
        <select
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

      <div style={{ marginTop: 20 }}>
        <label>סוג פרופיל חלוקה</label>
        <br />
        <select
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

      <div style={{ marginTop: 20 }}>
        <label>סוג פרופיל הצללה</label>
        <br />
        <select
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

      <div style={{ marginTop: 20 }}>
        <label>מרווח בין פרופילי הצללה (מ״מ)</label>
        <br />
        <input
          type="number"
          value={shadingGap}
          onChange={(e) => setShadingGap(e.target.value)}
        />
      </div>

      <button style={{ marginTop: 20 }} onClick={handleCalculate}>
        חשב
      </button>

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <strong>{error}</strong>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>תוצאות:</h3>

          <p>רוחב אפקטיבי של המסגרת: {result.frameWidth} מ״מ</p>
          <p>רוחב אפקטיבי של פרופיל החלוקה: {result.divisionWidth} מ״מ</p>
          <p>רוחב אפקטיבי של פרופיל ההצללה: {result.shadingWidth} מ״מ</p>

          <hr style={{ margin: "20px 0" }} />

          <p>מספר שדות: {result.fields}</p>
          <p>מספר חלוקות: {result.divisions}</p>
          <p>מרווח חלוקה סימטרי: {result.divisionSpacing} מ״מ</p>

          <hr style={{ margin: "20px 0" }} />

          <p>אורך נטו להצללה: {result.netLengthForShading} מ״מ</p>
          <p>אורך שדה להצללה לפני הפחתת 15: {result.shadingFieldLength} מ״מ</p>
          <p>אורך חיתוך פרופיל הצללה: {result.shadingCutLength} מ״מ</p>

          <hr style={{ margin: "20px 0" }} />

          <p>רוחב נטו לחישוב כמות הצללות: {result.netWidthForShadingCount} מ״מ</p>
          <p>כמות הצללות בכל שדה: {result.shadingPiecesPerField}</p>
          <p>סה״כ כמות פרופילי הצללה: {result.totalShadingPieces}</p>
          <p>רוחב מנוצל בכל שדה: {result.usedWidthPerField} מ״מ</p>
          <p>שארית בכל שדה לפני השלמה: {result.shadingRemainderPerField} מ״מ</p>
          <p>
            פרופיל השלמה:{" "}
            {result.hasCompletionProfile
              ? `${result.completionProfileName} (${result.completionPiecesTotal} יח')`
              : "לא נדרש"}
          </p>
          <p>שארית סופית בכל שדה: {result.finalRemainderPerField} מ״מ</p>

          <hr style={{ margin: "20px 0" }} />

          <p>אורך פרופיל חלוקה: {result.divisionCutLength} מ״מ</p>
          <p>אורך זווית / פרופיל משלים לשדה: {result.accessoryLengthPerField} מ״מ</p>
          <p>סה״כ כמות זוויות / פרופיל משלים: {result.accessoryPiecesTotal}</p>

          <hr style={{ margin: "20px 0" }} />

          <h3>רשימת חיתוכים</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 10,
            }}
          >
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

          <hr style={{ margin: "30px 0" }} />

          <h3>רשימת חומר להזמנה</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 10,
            }}
          >
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
          <hr style={{ margin: "30px 0" }} />

<h3>אופטימיזציית חיתוך למוטות 6000 מ״מ</h3>

{optimization && (
  <>
    <p>סה״כ מוטות: {optimization.totalBars}</p>
    <p>סה״כ אורך מנוצל: {optimization.totalUsedLength} מ״מ</p>
    <p>סה״כ שארית: {optimization.totalRemainingLength} מ״מ</p>
    <p>אחוז ניצול כולל: {optimization.overallUtilizationPercent}%</p>

    {optimization.profiles.map((profile) => (
      <div key={profile.profileName} style={{ marginTop: 30 }}>
        <h4>{profile.profileName}</h4>

        <p>כמות מוטות: {profile.totalBars}</p>
        <p>אורך מנוצל: {profile.totalUsedLength} מ״מ</p>
        <p>שארית כוללת: {profile.totalRemainingLength} מ״מ</p>
        <p>אחוז ניצול: {profile.utilizationPercent}%</p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
          }}
        >
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
    ))}
  </>
)}
        </div>
      )}
    </main>
  );
}