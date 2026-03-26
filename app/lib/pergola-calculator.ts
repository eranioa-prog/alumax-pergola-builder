export type ProfileOption = {
  name: string;
  width: number;
  height: number;
};

export type CutItem = {
  group: "מסגרת" | "חלוקות" | "הצללות";
  profileName: string;
  quantity: number;
  length: number;
  cutType: "45°" | "90°";
  note?: string;
};

export type MaterialSummaryItem = {
  profileName: string;
  totalPieces: number;
  totalLengthMm: number;
  totalLengthM: number;
};

export const frameProfiles: ProfileOption[] = [
  { name: "הייטק", width: 150, height: 50 },
  { name: "דאבל T 142", width: 142, height: 50 },
  { name: "דאבל T 122", width: 122, height: 50 },
  { name: "חלק 122", width: 122, height: 50 },
  { name: "מלבן 200/50", width: 200, height: 50 },
  { name: "מלבן 150/50", width: 150, height: 50 },
  { name: "מלבן 120/40", width: 120, height: 40 },
  { name: "מלבן 100/40", width: 100, height: 40 },
  { name: "מלבן 80/40", width: 80, height: 40 },
];

export const divisionProfiles: ProfileOption[] = [
  { name: "T 120/40", width: 120, height: 40 },
  { name: "T 100/40", width: 100, height: 40 },
];

export const shadingProfiles: ProfileOption[] = [
  { name: "מלבן 120/20", width: 120, height: 20 },
  { name: "מלבן 100/20", width: 100, height: 20 },
  { name: "מלבן 90/20", width: 90, height: 20 },
  { name: "מלבן 70/20", width: 70, height: 20 },
  { name: "מלבן 40/20", width: 40, height: 20 },
  { name: "מלבן 20/20", width: 20, height: 20 },
  { name: "רפפה Z", width: 90, height: 20 },
];

type CalculatePergolaParams = {
  width: number;
  length: number;
  frameProfileName: string;
  divisionProfileName: string;
  shadingProfileName: string;
  shadingGap?: number;
};

function getFrameEffectiveWidth(profile: ProfileOption) {
  return Math.min(profile.width, profile.height);
}

function getDivisionEffectiveWidth(profile: ProfileOption) {
  return Math.min(profile.width, profile.height);
}

function getShadingEffectiveWidth(profile: ProfileOption) {
  if (profile.name === "רפפה Z") return 90;
  return Math.max(profile.width, profile.height);
}

function roundFieldsByRule(length: number) {
  const raw = length / 1000;
  const whole = Math.floor(raw);
  const remainder = raw - whole;

  if (remainder <= 0.5) {
    return Math.max(1, whole);
  }

  return Math.max(1, whole + 1);
}

export function calculatePergola({
  width,
  length,
  frameProfileName,
  divisionProfileName,
  shadingProfileName,
  shadingGap = 10,
}: CalculatePergolaParams) {
  const frameProfile = frameProfiles.find((p) => p.name === frameProfileName);
  const divisionProfile = divisionProfiles.find(
    (p) => p.name === divisionProfileName
  );
  const shadingProfile = shadingProfiles.find(
    (p) => p.name === shadingProfileName
  );

  if (!frameProfile || !divisionProfile || !shadingProfile) {
    throw new Error("אחד הפרופילים שנבחרו לא נמצא");
  }

  const frameWidth = getFrameEffectiveWidth(frameProfile);
  const divisionWidth = getDivisionEffectiveWidth(divisionProfile);
  const shadingWidth = getShadingEffectiveWidth(shadingProfile);

  // מספר שדות לפי כלל העיגול
  const fields = roundFieldsByRule(length);

  // מספר חלוקות = מספר שדות - 1
  const divisions = Math.max(0, fields - 1);

  // מרווח חלוקה סימטרי
  const divisionSpacing = (length - 2 * frameWidth) / fields;

  // אורך נטו לשדות הצללה
  const netLengthForShading =
    length - 2 * frameWidth - divisions * divisionWidth;

  // אורך שדה לפני הפחתה
  const shadingFieldLength = netLengthForShading / fields;

  // אורך חיתוך הצללה
  const shadingCutLength = shadingFieldLength - 15;

  // רוחב נטו לכמות הצללות בכל שדה
  const netWidthForShadingCount = width - 2 * frameWidth;

  // כמות הצללות בכל שדה
  const shadingPiecesPerField = Math.floor(
    netWidthForShadingCount / (shadingWidth + shadingGap)
  );

  // רוחב מנוצל בכל שדה
  const usedWidthPerField =
    shadingPiecesPerField * (shadingWidth + shadingGap);

  // שארית לכל שדה
  const shadingRemainderPerField =
    netWidthForShadingCount - usedWidthPerField;

  // סה"כ הצללות
  const totalShadingPieces = shadingPiecesPerField * fields;

  // אורך פרופיל חלוקה
  const divisionCutLength = width - 2 * frameWidth;

  // אביזר לכל שדה:
  // רגיל -> זווית 30/30
  // רפפה Z -> פרופיל 20/40
  const isZLouver = shadingProfile.name === "רפפה Z";
  const accessoryProfileName = isZLouver ? "פרופיל 20/40" : "זווית 30/30";
  const accessoryLengthPerField = divisionCutLength - 20;
  const accessoryPiecesTotal = fields * 2;

  // השלמת שארית:
  // אם השארית מספיקה ל-40/20 + רווח 10 -> 40/20
  // אחרת אם השארית מספיקה ל-20/20 + רווח 10 -> 20/20
  let completionProfileName = "";
  let completionPiecesTotal = 0;
  let completionProfileWidth = 0;

  if (shadingRemainderPerField >= 50) {
    completionProfileName = "מלבן 40/20";
    completionPiecesTotal = fields;
    completionProfileWidth = 40;
  } else if (shadingRemainderPerField >= 30) {
    completionProfileName = "מלבן 20/20";
    completionPiecesTotal = fields;
    completionProfileWidth = 20;
  }

  const hasCompletionProfile = completionPiecesTotal > 0;

  const finalRemainderPerField = hasCompletionProfile
    ? shadingRemainderPerField - (completionProfileWidth + shadingGap)
    : shadingRemainderPerField;

  const cutList: CutItem[] = [
    {
      group: "מסגרת",
      profileName: frameProfile.name,
      quantity: 2,
      length: Number(length.toFixed(1)),
      cutType: "45°",
      note: "קורות מסגרת לפי אורך הפרגולה",
    },
    {
      group: "מסגרת",
      profileName: frameProfile.name,
      quantity: 2,
      length: Number(width.toFixed(1)),
      cutType: "45°",
      note: "קורות מסגרת לפי רוחב הפרגולה",
    },
    {
      group: "חלוקות",
      profileName: divisionProfile.name,
      quantity: divisions,
      length: Number(divisionCutLength.toFixed(1)),
      cutType: "90°",
      note: "פרופילי חלוקה ישרים",
    },
    {
      group: "הצללות",
      profileName: shadingProfile.name,
      quantity: totalShadingPieces,
      length: Number(shadingCutLength.toFixed(1)),
      cutType: "90°",
      note: `סה"כ ${shadingPiecesPerField} בכל שדה × ${fields} שדות`,
    },
    {
      group: "הצללות",
      profileName: accessoryProfileName,
      quantity: accessoryPiecesTotal,
      length: Number(accessoryLengthPerField.toFixed(1)),
      cutType: "90°",
      note: isZLouver
        ? `2 יח' לכל שדה × ${fields} שדות עבור רפפה Z`
        : `2 יח' לכל שדה × ${fields} שדות עבור הצללה רגילה`,
    },
    {
      group: "הצללות",
      profileName: completionProfileName,
      quantity: completionPiecesTotal,
      length: Number(shadingCutLength.toFixed(1)),
      cutType: "90°",
      note: hasCompletionProfile
        ? `פרופיל השלמה אחד לכל שדה לפי שארית ${Number(
            shadingRemainderPerField.toFixed(1)
          )} מ״מ`
        : "",
    },
  ].filter((item) => item.quantity > 0);

  return {
    frameWidth,
    divisionWidth,
    shadingWidth,
    fields,
    divisions,
    divisionSpacing: Number(divisionSpacing.toFixed(1)),
    netLengthForShading: Number(netLengthForShading.toFixed(1)),
    shadingFieldLength: Number(shadingFieldLength.toFixed(1)),
    shadingCutLength: Number(shadingCutLength.toFixed(1)),
    netWidthForShadingCount: Number(netWidthForShadingCount.toFixed(1)),
    shadingPiecesPerField,
    usedWidthPerField: Number(usedWidthPerField.toFixed(1)),
    shadingRemainderPerField: Number(shadingRemainderPerField.toFixed(1)),
    finalRemainderPerField: Number(finalRemainderPerField.toFixed(1)),
    hasCompletionProfile,
    completionProfileName,
    completionPiecesTotal,
    totalShadingPieces,
    shadingGap,
    divisionCutLength: Number(divisionCutLength.toFixed(1)),
    accessoryLengthPerField: Number(accessoryLengthPerField.toFixed(1)),
    accessoryPiecesTotal,
    isZLouver,
    cutList,
  };
}

export function summarizeMaterials(cutList: CutItem[]): MaterialSummaryItem[] {
  const summaryMap = new Map<string, MaterialSummaryItem>();

  for (const item of cutList) {
    const existing = summaryMap.get(item.profileName);
    const itemTotalLength = item.quantity * item.length;

    if (existing) {
      existing.totalPieces += item.quantity;
      existing.totalLengthMm += itemTotalLength;
      existing.totalLengthM = Number((existing.totalLengthMm / 1000).toFixed(2));
    } else {
      summaryMap.set(item.profileName, {
        profileName: item.profileName,
        totalPieces: item.quantity,
        totalLengthMm: Number(itemTotalLength.toFixed(1)),
        totalLengthM: Number((itemTotalLength / 1000).toFixed(2)),
      });
    }
  }

  return Array.from(summaryMap.values()).sort((a, b) =>
    a.profileName.localeCompare(b.profileName, "he")
  );
}