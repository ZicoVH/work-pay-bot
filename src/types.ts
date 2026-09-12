export type Time = {
    hour: number;
    minute: number;
}

export type Shift = {
    start: Time;
    end: Time;
}

export type ShiftCalculation = {
    workedMinutes: number;
    nightMinutes: number,
    overtimeMinutes: number,
    pay: PayCalculation
}

export type PayCalculation = {
    regularPay: number;
    nightBonus: number;
    overtimePay: number;
    coldBonus: number;
    holidayPay: number;
    clothingAllowance: number;
    travelAllowance: number;
    estimatedNet: number;
};