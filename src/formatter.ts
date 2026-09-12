import type { ShiftCalculation } from "./types.js";

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}u${remainingMinutes
        .toString()
        .padStart(2, "0")}`;
}

function formatEuro(amount: number): string {
    return `€${amount.toFixed(2)}`;
}

export function formatResult(result: ShiftCalculation): string {
    const { pay } = result;

    return (
        `Je werkte ${formatDuration(result.workedMinutes)}.\n` +
        `Daarvan ${formatDuration(result.nightMinutes)} nachtwerk.\n` +
        `Overuren: ${formatDuration(result.overtimeMinutes)}.\n\n` +
        `Basisloon: ${formatEuro(pay.regularPay)}\n` +
        `Nachtpremie: ${formatEuro(pay.nightBonus)}\n` +
        `Overuren: ${formatEuro(pay.overtimePay)}\n` +
        `Koudepremie: ${formatEuro(pay.coldBonus)}\n` +
        `Vakantiegeld: ${formatEuro(pay.holidayPay)}\n` +
        `Kledijvergoeding: ${formatEuro(pay.clothingAllowance)}\n` +
        `Woon-werkvergoeding: ${formatEuro(pay.travelAllowance)}\n\n` +
        `Geschat netto: ${formatEuro(pay.estimatedNet)}`
    );
}