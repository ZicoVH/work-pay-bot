import type { PayCalculation } from "./types.js";

const HOURLY_RATE = 15.85;
const NIGHT_BONUS_PER_HOUR = 4.755;
const OVERTIME_RATE = 23.775;

const COLD_BONUS = 0.7925 + 1.585;
const CLOTHING_ALLOWANCE = 1.44;
const TRAVEL_ALLOWANCE = 2.63;

const HOLIDAY_PAY_PERCENTAGE = 0.0767;

export function calculatePay(
    workedMinutes: number,
    nightMinutes: number,
    overtimeMinutes: number
): PayCalculation {
    const regularMinutes = workedMinutes - overtimeMinutes;

    const regularPay = (regularMinutes / 60) * HOURLY_RATE;
    const nightBonus = (nightMinutes / 60) * NIGHT_BONUS_PER_HOUR;
    const overtimePay = (overtimeMinutes / 60) * OVERTIME_RATE;

    const taxableBase =
        regularPay +
        nightBonus +
        overtimePay +
        COLD_BONUS;

    const holidayPay = taxableBase * HOLIDAY_PAY_PERCENTAGE;

    const estimatedNet =
        taxableBase +
        holidayPay +
        CLOTHING_ALLOWANCE +
        TRAVEL_ALLOWANCE;

    return {
        regularPay,
        nightBonus,
        overtimePay,
        coldBonus: COLD_BONUS,
        holidayPay,
        clothingAllowance: CLOTHING_ALLOWANCE,
        travelAllowance: TRAVEL_ALLOWANCE,
        estimatedNet,
    };
}