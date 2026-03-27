// ================= TYPES =================
export type CutItem = {
  group: "מסגרת" | "חלוקות" | "הצללות" | "השלמות";
  profileName: string;
  quantity: number;
  length: number;
  cutType: "45°" | "90°";
  note?: string;
};

type Profile = {
  name: string;
  width: number;
};

// ================= PROFILES =================
export const frameProfiles: Profile[] = [
  { name: "מלבן 200/50", width: 50 },
  { name: "מלבן 150/50", width: 50 },
  { name: "מלבן 120/40", width: 40 },
  { name: "מלבן 100/40", width: 40 },
  { name: "מלבן 80/40", width: 40 },
  { name: "דאבל T 142", width: 40 },
  { name: "דאבל T122", width: 40 },
  { name: "חלק 122", width: 40 },
  { name: "הייטק", width: 40 },
];

export const divisionProfiles: Profile[] = [
  { name: "T 120/40", width: 40 },
  { name: "T 100/40", width: 40 },
];

export const shadingProfiles: Profile[] = [
  { name: "מלבן 120/20", width: 120 },
  { name: "מלבן 100/20", width: 100 },
  { name: "מלבן 90/20", width: 90 },
  { name: "מלבן 70/20", width: 70 },
  { name: "מלבן 40/20", width: 40 },
  { name: "מלבן 20/20", width: 20 },
];

// ================= HELPERS =================
function getProfileWidth(
  profiles: Profile[],
  name: string,
  fallback: number
): number {
  const p = profiles.find((x) => x.name === name);
  return p ? p.width : fallback;
}

function chooseFields(netLength: number): number {
  let best = 1;
  let bestScore = Infinity;

  for (let i = 1; i <= 20; i++) {
    const size = netLength / i;

    if (size >= 900 && size <= 1200) {
      const score = Math.abs(size - 1000);

      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
  }

  return best;
}

// ================= MAIN =================
export function calculatePergola({
  length,
  width,
  frameProfileName,
  divisionProfileName,
  shadingProfileName,
  shadingGap,
}: any) {
  const frameWidth = getProfileWidth(frameProfiles, frameProfileName, 40);
  const divisionWidth = getProfileWidth(divisionProfiles, divisionProfileName, 40);
  const shadingWidth = getProfileWidth(shadingProfiles, shadingProfileName, 70);
  const gap = Number.isFinite(shadingGap) ? shadingGap : 10;

  // ================= שדות =================
  const netLength = length - 2 * frameWidth;

  const fields = chooseFields(netLength);
  const divisions = fields - 1;

  const fieldOpening =
    (length - 2 * frameWidth - divisions * divisionWidth) / fields;

  // ================= חלוקות =================
  const divisionCutLength = width - 2 * frameWidth;

  // ================= הצללות =================
  const netShadingLength = fieldOpening;

  const shadingCutLength = netShadingLength - 15;

  const pitch = shadingWidth + gap;

  const shadingPiecesPerField = Math.max(
    Math.floor(divisionCutLength / pitch),
    0
  );

  const totalShadingPieces = shadingPiecesPerField * fields;

  const usedWidth =
    shadingPiecesPerField > 0
      ? shadingPiecesPerField * shadingWidth +
        (shadingPiecesPerField - 1) * gap
      : 0;

  const remainder = Math.max(divisionCutLength - usedWidth, 0);

  // ================= השלמות =================
  let completionProfileName = "";
  let completionWidth = 0;

  if (remainder >= 40) {
    completionProfileName = "מלבן 40/20";
    completionWidth = 40;
  } else if (remainder >= 20) {
    completionProfileName = "מלבן 20/20";
    completionWidth = 20;
  }

  const hasCompletionProfile = completionProfileName !== "";
  const completionPiecesTotal = hasCompletionProfile ? fields : 0;

  // ================= CUT LIST =================
  const cutList: CutItem[] = [
    {
      group: "מסגרת",
      profileName: frameProfileName,
      quantity: 2,
      length,
      cutType: "45°",
    },
    {
      group: "מסגרת",
      profileName: frameProfileName,
      quantity: 2,
      length: width,
      cutType: "45°",
    },
    {
      group: "חלוקות",
      profileName: divisionProfileName,
      quantity: divisions,
      length: Math.round(divisionCutLength),
      cutType: "90°",
    },
    {
      group: "הצללות",
      profileName: shadingProfileName,
      quantity: totalShadingPieces,
      length: Math.round(shadingCutLength),
      cutType: "90°",
    },
  ];

  if (hasCompletionProfile) {
    cutList.push({
      group: "השלמות",
      profileName: completionProfileName,
      quantity: completionPiecesTotal,
      length: Math.round(shadingCutLength),
      cutType: "90°",
    });
  }

  return {
    fields,
    divisions,

    frameWidth,
    divisionWidth,
    shadingWidth,

    fieldOpeningMm: Math.round(fieldOpening),

    // 👇 כאן התיקון האמיתי
    netShadingLength: Math.round(netShadingLength),
    shadingNetLength: Math.round(netShadingLength),

    shadingCutLength: Math.round(shadingCutLength),
    shadingPiecesPerField,
    totalShadingPieces,
    shadingRemainderPerField: Math.round(remainder),

    hasCompletionProfile,
    completionProfileName,
    completionPiecesTotal,
    completionWidth: Math.round(completionWidth),

    divisionCutLength: Math.round(divisionCutLength),

    cutList,
  };
}

// ================= SUMMARY =================
export function summarizeMaterials(cutList: CutItem[]) {
  const map = new Map();

  cutList.forEach((item) => {
    if (!map.has(item.profileName)) {
      map.set(item.profileName, {
        profileName: item.profileName,
        totalPieces: 0,
        totalLengthMm: 0,
      });
    }

    const obj = map.get(item.profileName);

    obj.totalPieces += item.quantity;
    obj.totalLengthMm += item.quantity * item.length;
  });

  return Array.from(map.values()).map((x: any) => ({
    ...x,
    totalLengthM: (x.totalLengthMm / 1000).toFixed(2),
  }));
}
