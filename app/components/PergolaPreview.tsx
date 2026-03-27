


type PergolaPreviewProps = {
    width: number;
    length: number;
    fields: number;
    divisions: number;
    shadingPiecesPerField: number;
    divisionSpacing: number;
    frameProfileName: string;
    divisionProfileName: string;
    shadingProfileName: string;
  };
  
  export default function PergolaPreview({
    width,
    length,
    fields,
    divisions,
    shadingPiecesPerField,
    divisionSpacing,
    frameProfileName,
    divisionProfileName,
    shadingProfileName,
  }: PergolaPreviewProps) {
    const svgWidth = 980;
    const svgHeight = 560;
  
    const padding = 80;
    const drawWidth = svgWidth - padding * 2;
    const drawHeight = svgHeight - padding * 2;
  
    const scale = Math.min(drawWidth / length, drawHeight / width);
  
    const pergolaDrawLength = length * scale;
    const pergolaDrawWidth = width * scale;
  
    const startX = (svgWidth - pergolaDrawLength) / 2;
    const startY = (svgHeight - pergolaDrawWidth) / 2;
  
    const fieldWidth = pergolaDrawLength / fields;
    const shadingLineCount = Math.max(1, shadingPiecesPerField);
    const shadingSpacing = pergolaDrawWidth / (shadingLineCount + 1);
  
    const frameStroke = 8;
    const divisionStroke = 4;
    const shadingStroke = 2;
  
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 20,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          שרטוט טכני – מבט עליון
        </h3>
  
        <p
          style={{
            margin: "0 0 16px",
            color: "#475569",
            fontSize: 14,
          }}
        >
          מסגרת: {frameProfileName} | חלוקה: {divisionProfileName} | הצללה:{" "}
          {shadingProfileName}
        </p>
  
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            background: "#f8fafc",
            borderRadius: 18,
          }}
        >
          <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#f8fafc" />
  
          <rect
            x={startX}
            y={startY}
            width={pergolaDrawLength}
            height={pergolaDrawWidth}
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth={frameStroke}
            rx={6}
          />
  
          {Array.from({ length: divisions }).map((_, index) => {
            const x = startX + fieldWidth * (index + 1);
  
            return (
              <line
                key={`division-${index}`}
                x1={x}
                y1={startY}
                x2={x}
                y2={startY + pergolaDrawWidth}
                stroke="#2563eb"
                strokeWidth={divisionStroke}
              />
            );
          })}
  
          {Array.from({ length: fields }).map((_, fieldIndex) => {
            const fieldStartX = startX + fieldWidth * fieldIndex;
            const fieldEndX = fieldStartX + fieldWidth;
  
            return Array.from({ length: shadingLineCount }).map((__, shadeIndex) => {
              const y = startY + shadingSpacing * (shadeIndex + 1);
  
              return (
                <line
                  key={`shade-${fieldIndex}-${shadeIndex}`}
                  x1={fieldStartX + 8}
                  y1={y}
                  x2={fieldEndX - 8}
                  y2={y}
                  stroke="#065f46"
                  strokeWidth={shadingStroke}
                />
              );
            });
          })}
  
          <line
            x1={startX}
            y1={startY - 34}
            x2={startX + pergolaDrawLength}
            y2={startY - 34}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={startX}
            y1={startY - 44}
            x2={startX}
            y2={startY - 22}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={startX + pergolaDrawLength}
            y1={startY - 44}
            x2={startX + pergolaDrawLength}
            y2={startY - 22}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text
            x={startX + pergolaDrawLength / 2}
            y={startY - 40}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#0f172a"
          >
            אורך: {length} מ״מ
          </text>
  
          <line
            x1={startX + pergolaDrawLength + 34}
            y1={startY}
            x2={startX + pergolaDrawLength + 34}
            y2={startY + pergolaDrawWidth}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={startX + pergolaDrawLength + 24}
            y1={startY}
            x2={startX + pergolaDrawLength + 46}
            y2={startY}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={startX + pergolaDrawLength + 24}
            y1={startY + pergolaDrawWidth}
            x2={startX + pergolaDrawLength + 46}
            y2={startY + pergolaDrawWidth}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text
            x={startX + pergolaDrawLength + 52}
            y={startY + pergolaDrawWidth / 2}
            fontSize="16"
            fontWeight="700"
            fill="#0f172a"
          >
            רוחב: {width} מ״מ
          </text>
  
          {Array.from({ length: fields }).map((_, index) => {
            const x = startX + fieldWidth * index + fieldWidth / 2;
            const y = startY + 22;
  
            return (
              <text
                key={`field-label-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#1e293b"
              >
                שדה {index + 1}
              </text>
            );
          })}
  
          {Array.from({ length: fields }).map((_, index) => {
            const x1 = startX + fieldWidth * index;
            const x2 = x1 + fieldWidth;
            const y = startY + pergolaDrawWidth + 28;
            const textX = (x1 + x2) / 2;
  
            return (
              <g key={`field-dim-${index}`}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <line
                  x1={x1}
                  y1={y - 8}
                  x2={x1}
                  y2={y + 8}
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <line
                  x1={x2}
                  y1={y - 8}
                  x2={x2}
                  y2={y + 8}
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <text
                  x={textX}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#334155"
                >
                  {divisionSpacing.toFixed(1)} מ״מ
                </text>
              </g>
            );
          })}
  
          <text
            x={svgWidth / 2}
            y={svgHeight - 18}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#475569"
          >
            {fields} שדות | {divisions} חלוקות | {shadingPiecesPerField} הצללות בכל שדה
          </text>
        </svg>
      </div>
    );
  }
  