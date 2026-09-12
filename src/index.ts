import "dotenv/config";

import { Bot } from "grammy";

import { parseShift } from "./time.js";
import { calculateShift } from "./calculator.js";
import { formatResult } from "./formatter.js";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error(
        "TELEGRAM_BOT_TOKEN is missing"
    );
}

const bot = new Bot(token);

bot.on("message:text", async (ctx) => {
    const shift = parseShift(ctx.message.text);

    if (!shift) {
        await ctx.reply(
            "Ik verwacht 2 geldige tijdstippen. Bijvoorbeeld: 17:30 tot 23:15."
        );

        return;
    }

    const calculation = calculateShift(shift);

    await ctx.reply(
        formatResult(calculation)
    );
});

bot.start();

console.log("Bot is running...");