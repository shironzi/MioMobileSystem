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

export function getDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    hour12: true,
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

export function getFormattedTimeFromDateString(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute, second);

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatToLongDateTime(dateTimeStr: string): string {
  const [datePart, timePart] = dateTimeStr.split(" ");
  const isoString = `${datePart}T${timePart}`;
  const date = new Date(isoString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${formattedDate} ${formattedTime}`;
}

export function formatToLongDate(dateTimeStr: string): string {
  const [datePart] = dateTimeStr.split(" ");
  const date = new Date(datePart);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getDateFromTime(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);

  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
  );
}

export function formatTime12Hour(timeString: string) {
  const [hour, minute, second] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  date.setSeconds(Number(second));

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTime12Hour2(timeString: string) {
  const [hour, minute, second = "00"] = timeString.split(":");

  if (hour === undefined || minute === undefined) return "";

  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  date.setSeconds(Number(second));

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
