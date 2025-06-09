// utils.ts
export function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getWorkedMinutes(start: string, end: string): number {
  return parseTime(end) - parseTime(start);
}

export function getSalaryPenaltyPerMinute(
  monthlySalary: number,
  workingDays: number,
  requiredDailyHours: number
): number {
  const totalExpectedMinutes = workingDays * requiredDailyHours * 60;
  return monthlySalary / totalExpectedMinutes;
}
