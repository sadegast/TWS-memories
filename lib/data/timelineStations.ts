import type { TimelineStation } from "@/lib/types/pageTypes";

export function generateTimelineStations(): TimelineStation[] {
  const stations: TimelineStation[] = [];
  const now = new Date();
  let year = 2024;
  let month = 1;

  while (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month <= now.getMonth() + 1)
  ) {
    const date = new Date(year, month - 1);
    stations.push({
      month: `${year}.${month}`,
      label: date.toLocaleString("en", { month: "short", year: "numeric" }),
      photos: [],
    });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return stations;
}
