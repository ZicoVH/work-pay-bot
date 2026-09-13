import { PAY_CONFIG } from "./config.js";
import type { PayCalculation } from "./types.js";

export function calculatePay(
    workedMinutes: number,
    nightMinutes: number,
    overtimeMinutes: number
): PayCalculation {
    const regularMinutes = workedMinutes - overtimeMinutes;

    const regularPay =
        (regularMinutes / 60) * PAY_CONFIG.hourlyRate;

    const nightBonus =
        (nightMinutes / 60) * PAY_CONFIG.nightBonusPerHour;

    const overtimePay =
        (overtimeMinutes / 60) * PAY_CONFIG.overtimeRate;

    const taxableBase =
        regularPay +
        nightBonus +
        overtimePay +
        PAY_CONFIG.coldBonus;

    const holidayPay =
        taxableBase * PAY_CONFIG.holidayPayPercentage;

    const estimatedNet =
        taxableBase +
        holidayPay +
        PAY_CONFIG.clothingAllowance +
        PAY_CONFIG.travelAllowance;

    return {
        regularPay,
        nightBonus,
        overtimePay,
        coldBonus: PAY_CONFIG.coldBonus,
        holidayPay,
        clothingAllowance: PAY_CONFIG.clothingAllowance,
        travelAllowance: PAY_CONFIG.travelAllowance,
        estimatedNet,
    };
}