export const mockAvailability = {
  "2026-09-24": {
    2: ["12:00", "12:30", "13:00", "13:30"],
    4: ["12:00", "12:30", "13:00"],
    6: ["12:00"],
  },
  "2026-09-25": {
    2: ["12:00", "12:30", "13:00", "13:30"],
    4: ["12:00", "12:30", "13:00"],
    6: ["12:00", "12:30"],
  },
  "2026-09-28": { 2: [], 4: [], 6: [] },
  "2026-09-29": {
    2: ["12:00", "12:30", "13:00"],
    4: ["12:00", "12:30"],
    6: ["12:00"],
  },
  "2026-09-30": {
    2: ["12:00", "12:30", "13:00", "13:30"],
    4: ["12:00", "12:30", "13:00"],
    6: ["12:00", "12:30"],
  },
  "2026-10-01": {
    2: ["12:00", "12:30", "13:00"],
    4: ["12:00", "12:30"],
    6: ["12:00"],
  },
  "2026-10-02": {
    2: ["12:00", "12:30", "13:00", "13:30"],
    4: ["12:00", "12:30", "13:00"],
    6: ["12:00", "12:30"],
  },
  "2026-10-05": { 2: ["12:00", "12:30"], 4: ["12:00"], 6: [] },
};

export function getMockTimes(dateKey, guestCount, now = new Date()) {
  const times = mockAvailability[dateKey]?.[guestCount] || [];
  const todayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  if (dateKey !== todayKey) return times;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return times.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes > currentMinutes;
  });
}
