import type { ShiftCalculation } from "./types.js";

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}u${remainingMinutes
        .toString()
        .padStart(2, "0")}`;
}

function formatEuro(amount: number): string {
    return new Intl.NumberFormat("nl-BE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatResult(
    result: ShiftCalculation
): string {
    let message =
        `💰 Geschat verdiend: ${formatEuro(result.pay.estimatedNet)}\n\n` +
        `🕒 ${formatDuration(result.workedMinutes)} gewerkt\n` +
        `🌙 ${formatDuration(result.nightMinutes)} nachtwerk`;

    if (result.overtimeMinutes > 0) {
        message +=
            `\n⏱️ ${formatDuration(result.overtimeMinutes)} overuren`;
    }

    return message;
}

export function formatDetailedResult(
    result: ShiftCalculation
): string {
    const { pay } = result;

    return (
        `💰 Geschat verdiend: ${formatEuro(pay.estimatedNet)}\n\n` +
        `🕒 Gewerkt: ${formatDuration(result.workedMinutes)}\n` +
        `🌙 Nachtwerk: ${formatDuration(result.nightMinutes)}\n` +
        `⏱️ Overuren: ${formatDuration(result.overtimeMinutes)}\n\n` +
        `Basisloon: ${formatEuro(pay.regularPay)}\n` +
        `Nachtpremie: ${formatEuro(pay.nightBonus)}\n` +
        `Overuren: ${formatEuro(pay.overtimePay)}\n` +
        `Koudepremie: ${formatEuro(pay.coldBonus)}\n` +
        `Vakantiegeld: ${formatEuro(pay.holidayPay)}\n` +
        `Kledijvergoeding: ${formatEuro(pay.clothingAllowance)}\n` +
        `Woon-werkvergoeding: ${formatEuro(pay.travelAllowance)}`
    );
}