import { calculatePay } from "./pay.js";
import { calculateNightMinutes, calculateOvertimeMinutes, calculateWorkedMinutes } from "./time.js";
import type { Shift, ShiftCalculation } from "./types.js";

export function calculateShift(shift: Shift): ShiftCalculation {
    const workedMinutes = calculateWorkedMinutes(shift);
    const nightMinutes = calculateNightMinutes(shift);
    const overtimeMinutes = calculateOvertimeMinutes(workedMinutes);

    return {
        workedMinutes,
        nightMinutes,
        overtimeMinutes,
        pay: calculatePay(
            workedMinutes,
            nightMinutes,
            overtimeMinutes
        ),
    };
}