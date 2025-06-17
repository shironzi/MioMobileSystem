export default function getCurrentDateTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = formatter.formatToParts(now);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
}

export function parseFormattedDateString(dateStr: string): Date {
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

export function formatDayDateTimeWithAmPm(date: string): string {
  const newDate = parseFormattedDateString(date);

  const day = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
  }).format(newDate);

  const dateStr = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(newDate);

  const time = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(newDate);

  return `${day}, ${dateStr} ${time}`;
}

export function formattedDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getSmartFormattedDate(date: string) {
  const timestamp = parseInt(date) * 1000;
  const dateObj = new Date(timestamp);
  const now = new Date();

  const isSameDay = dateObj.toDateString() === now.toDateString();

  const daysDiff = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24),
  );

  const timeFormatter = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // ✅ 12-hour format with AM/PM
  });

  const time = timeFormatter.format(dateObj);

  if (isSameDay) {
    return `Now ${time}`;
  }

  if (daysDiff < 7) {
    const dayFormatter = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      weekday: "long",
    });

    const day = dayFormatter.format(dateObj);
    return `${day}, ${time}`;
  }

  const fullFormatter = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return fullFormatter.format(dateObj);
}
