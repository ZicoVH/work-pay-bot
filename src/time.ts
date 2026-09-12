import type { Shift, Time } from "./types.js";

const NIGHT_START_MINUTES = 20 * 60;
const REGULAR_WORK_MINUTES = 9 * 60;
const MINUTES_PER_DAY = 24 * 60;

export function parseShift(text: string): Shift | null {
    const matches = [...text.matchAll(/(\d{1,2})[:u.](\d{2})/gi)];

    if (matches.length !== 2) {
        return null;
    }

    const start = parseTime(matches[0]!);
    const end = parseTime(matches[1]!);

    if (!start || !end) {
        return null;
    }

    return { start, end };
}

function parseTime(match: RegExpMatchArray): Time | null {
    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute) ||
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59
    ) {
        return null;
    }

    return { hour, minute };
}

function toMinutes(time: Time): number {
    return time.hour * 60 + time.minute;
}

function getNormalizedEndMinutes(start: Time, end: Time): number {
    const startMinutes = toMinutes(start);
    let endMinutes = toMinutes(end);

    if (endMinutes < startMinutes) {
        endMinutes += MINUTES_PER_DAY;
    }

    return endMinutes;
}


export function calculateWorkedMinutes(shift: Shift): number {
    const startMinutes = toMinutes(shift.start);
    const endMinutes = getNormalizedEndMinutes(shift.start, shift.end);

    return endMinutes - startMinutes
}

export function calculateNightMinutes(shift: Shift): number {
    const startMinutes = toMinutes(shift.start);
    const endMinutes = getNormalizedEndMinutes(shift.start, shift.end);

    let nightMinutes = 0;

     // 20:00 -> 24:00
     const firstNightStart = Math.max(startMinutes, NIGHT_START_MINUTES);
     const firstNightEnd = Math.min(endMinutes, MINUTES_PER_DAY);
 
     if (firstNightEnd > firstNightStart) {
         nightMinutes += firstNightEnd - firstNightStart;
     }
 
     // 00:00 -> end of shift
     if (endMinutes > MINUTES_PER_DAY) {
         nightMinutes += endMinutes - MINUTES_PER_DAY;
     }
 
     return nightMinutes;
}

export function calculateOvertimeMinutes(workedMinutes: number): number {
    return Math.max(0, workedMinutes - REGULAR_WORK_MINUTES);
}