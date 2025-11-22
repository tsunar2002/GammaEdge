export function formatDateForAPI(date: Date): string {
  return date.toISOString().split(".")[0] + "Z";
}

export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function isWithinMarketHours(timestamp: string): boolean {
  const date = new Date(timestamp);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hours = parseInt(
    parts.find((p) => p.type === "hour")?.value || "0",
    10
  );
  const minutes = parseInt(
    parts.find((p) => p.type === "minute")?.value || "0",
    10
  );

  const totalMinutes = hours * 60 + minutes;
  const marketOpenMinutes = 9 * 60 + 30;
  const marketCloseMinutes = 15 * 60 + 59;

  return (
    totalMinutes >= marketOpenMinutes && totalMinutes <= marketCloseMinutes
  );
}

export function filterMarketHours<T extends { t: string }>(bars: T[]): T[] {
  return bars.filter((bar) => isWithinMarketHours(bar.t));
}
