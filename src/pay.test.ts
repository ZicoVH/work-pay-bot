import test from "node:test";
import assert from "node:assert/strict";

import { calculatePay } from "./pay.js";

test("calculates pay for 17:30 to 01:30 correctly", () => {
    const workedMinutes = 480;
    const nightMinutes = 330;
    const overtimeMinutes = 0;

    const pay = calculatePay(
        workedMinutes,
        nightMinutes,
        overtimeMinutes
    );

    assert.equal(pay.regularPay.toFixed(2), "126.80");
    assert.equal(pay.nightBonus.toFixed(2), "26.15");
    assert.equal(pay.overtimePay.toFixed(2), "0.00");
    assert.equal(pay.coldBonus.toFixed(2), "2.38");
    assert.equal(pay.holidayPay.toFixed(2), "11.91");
    assert.equal(pay.clothingAllowance.toFixed(2), "1.44");
    assert.equal(pay.travelAllowance.toFixed(2), "2.63");
    assert.equal(pay.estimatedNet.toFixed(2), "171.31");
});

test("calculates pay with overtime correctly", () => {
    const workedMinutes = 555;   
    const nightMinutes = 405;    
    const overtimeMinutes = 15; 

    const pay = calculatePay(
        workedMinutes,
        nightMinutes,
        overtimeMinutes
    );

    assert.equal(pay.regularPay.toFixed(2), "142.65");
    assert.equal(pay.overtimePay.toFixed(2), "5.94");
    assert.equal(pay.nightBonus.toFixed(2), "32.10");
});