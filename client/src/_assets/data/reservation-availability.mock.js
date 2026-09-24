export const mockAvailability = {
  "2026-09-24": ["12:00", "12:30", "13:00", "13:30"],
  "2026-09-25": ["12:00", "12:30", "13:00"],
  "2026-09-28": [],
  "2026-09-29": ["12:00", "12:30"],
  "2026-09-30": ["12:00", "12:30", "13:00", "13:30"],
  "2026-10-01": ["12:00", "12:30", "13:00"],
  "2026-10-02": ["12:00", "12:30", "13:00", "13:30"],
  "2026-10-05": ["12:00", "12:30"],
};

export function hasMockAvailability(dateKey) {
  return Object.prototype.hasOwnProperty.call(mockAvailability, dateKey);
}

export function getMockTimes(dateKey) {
  return mockAvailability[dateKey] || [];
}
