import type { CutItem } from "./pergola-calculator";

export type ExpandedCutPiece = {
  profileName: string;
  length: number;
  cutType: "45°" | "90°";
  sourceGroup: "מסגרת" | "חלוקות" | "הצללות" | "השלמות";
  note?: string;
};

export type OptimizedBar = {
  barNumber: number;
  stockLength: number;
  profileName: string;
  pieces: ExpandedCutPiece[];
  usedLength: number;
  remainingLength: number;
  utilizationPercent: number;
};

export type ProfileOptimizationResult = {
  profileName: string;
  stockLength: number;
  bars: OptimizedBar[];
  totalBars: number;
  totalUsedLength: number;
  totalRemainingLength: number;
  utilizationPercent: number;
};

export type CuttingOptimizationSummary = {
  stockLength: number;
  profiles: ProfileOptimizationResult[];
  totalBars: number;
  totalUsedLength: number;
  totalRemainingLength: number;
  overallUtilizationPercent: number;
};

function expandCutList(cutList: CutItem[]): ExpandedCutPiece[] {
  const expanded: ExpandedCutPiece[] = [];

  for (const item of cutList) {
    for (let i = 0; i < item.quantity; i++) {
      expanded.push({
        profileName: item.profileName,
        length: item.length,
        cutType: item.cutType,
        sourceGroup: item.group,
        note: item.note,
      });
    }
  }

  return expanded;
}

function groupPiecesByProfile(
  pieces: ExpandedCutPiece[]
): Record<string, ExpandedCutPiece[]> {
  const grouped: Record<string, ExpandedCutPiece[]> = {};

  for (const piece of pieces) {
    if (!grouped[piece.profileName]) {
      grouped[piece.profileName] = [];
    }

    grouped[piece.profileName].push(piece);
  }

  return grouped;
}

function optimizeSingleProfile(
  profileName: string,
  pieces: ExpandedCutPiece[],
  stockLength: number
): ProfileOptimizationResult {
  const sortedPieces = [...pieces].sort((a, b) => b.length - a.length);
  const bars: OptimizedBar[] = [];

  for (const piece of sortedPieces) {
    let placed = false;

    for (const bar of bars) {
      if (bar.remainingLength >= piece.length) {
        bar.pieces.push(piece);
        bar.usedLength += piece.length;
        bar.remainingLength -= piece.length;
        bar.utilizationPercent = Number(
          ((bar.usedLength / bar.stockLength) * 100).toFixed(2)
        );
        placed = true;
        break;
      }
    }

    if (!placed) {
      const usedLength = piece.length;
      const remainingLength = stockLength - piece.length;

      bars.push({
        barNumber: bars.length + 1,
        stockLength,
        profileName,
        pieces: [piece],
        usedLength,
        remainingLength,
        utilizationPercent: Number(
          ((usedLength / stockLength) * 100).toFixed(2)
        ),
      });
    }
  }

  const totalUsedLength = bars.reduce((sum, bar) => sum + bar.usedLength, 0);
  const totalRemainingLength = bars.reduce(
    (sum, bar) => sum + bar.remainingLength,
    0
  );
  const totalBars = bars.length;
  const totalStockLength = totalBars * stockLength;

  return {
    profileName,
    stockLength,
    bars,
    totalBars,
    totalUsedLength: Number(totalUsedLength.toFixed(1)),
    totalRemainingLength: Number(totalRemainingLength.toFixed(1)),
    utilizationPercent:
      totalStockLength > 0
        ? Number(((totalUsedLength / totalStockLength) * 100).toFixed(2))
        : 0,
  };
}

export function optimizeCutList(
  cutList: CutItem[],
  stockLength: number = 6000
): CuttingOptimizationSummary {
  const expandedPieces = expandCutList(cutList);
  const groupedPieces = groupPiecesByProfile(expandedPieces);

  const profiles = Object.entries(groupedPieces)
    .map(([profileName, pieces]) =>
      optimizeSingleProfile(profileName, pieces, stockLength)
    )
    .sort((a, b) => a.profileName.localeCompare(b.profileName, "he"));

  const totalBars = profiles.reduce((sum, profile) => sum + profile.totalBars, 0);
  const totalUsedLength = profiles.reduce(
    (sum, profile) => sum + profile.totalUsedLength,
    0
  );
  const totalRemainingLength = profiles.reduce(
    (sum, profile) => sum + profile.totalRemainingLength,
    0
  );
  const totalStockLength = totalBars * stockLength;

  return {
    stockLength,
    profiles,
    totalBars,
    totalUsedLength: Number(totalUsedLength.toFixed(1)),
    totalRemainingLength: Number(totalRemainingLength.toFixed(1)),
    overallUtilizationPercent:
      totalStockLength > 0
        ? Number(((totalUsedLength / totalStockLength) * 100).toFixed(2))
        : 0,
  };
}