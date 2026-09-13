import test from "node:test";
import assert from "node:assert/strict";

import {
    calculateWorkedMinutes,
    calculateNightMinutes,
    calculateOvertimeMinutes,
} from "./time.js";

import type { Shift } from "./types.js";

type TestCase = {
    name: string;
    shift: Shift;
    expectedWorkedMinutes: number;
    expectedNightMinutes: number;
    expectedOvertimeMinutes: number;
};

const testCases: TestCase[] = [
    {
        name: "17:30 to 01:30",
        shift: {
            start: { hour: 17, minute: 30 },
            end: { hour: 1, minute: 30 },
        },
        expectedWorkedMinutes: 480,
        expectedNightMinutes: 330,
        expectedOvertimeMinutes: 0,
    },
    {
        name: "17:30 to 02:00",
        shift: {
            start: { hour: 17, minute: 30 },
            end: { hour: 2, minute: 0 },
        },
        expectedWorkedMinutes: 510,
        expectedNightMinutes: 360,
        expectedOvertimeMinutes: 0,
    },
    {
        name: "17:30 to 02:45",
        shift: {
            start: { hour: 17, minute: 30 },
            end: { hour: 2, minute: 45 },
        },
        expectedWorkedMinutes: 555,
        expectedNightMinutes: 405,
        expectedOvertimeMinutes: 15,
    },
    {
        name: "17:30 to 04:15",
        shift: {
            start: { hour: 17, minute: 30 },
            end: { hour: 4, minute: 15 },
        },
        expectedWorkedMinutes: 645,
        expectedNightMinutes: 495,
        expectedOvertimeMinutes: 105,
    },
];

for (const testCase of testCases) {
    test(testCase.name, () => {
        const workedMinutes =
            calculateWorkedMinutes(testCase.shift);

        const nightMinutes =
            calculateNightMinutes(testCase.shift);

        const overtimeMinutes =
            calculateOvertimeMinutes(workedMinutes);

        assert.equal(
            workedMinutes,
            testCase.expectedWorkedMinutes
        );

        assert.equal(
            nightMinutes,
            testCase.expectedNightMinutes
        );

        assert.equal(
            overtimeMinutes,
            testCase.expectedOvertimeMinutes
        );
    });
}