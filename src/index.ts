import "dotenv/config";

import { Bot } from "grammy";

import { parseShift } from "./time.js";
import { calculateShift } from "./calculator.js";
import { formatResult,formatDetailedResult } from "./formatter.js";
import { PAY_CONFIG } from "./config.js";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error(
        "TELEGRAM_BOT_TOKEN is missing"
    );
}

const bot = new Bot(token);

bot.command("start", async (ctx) => {
    await ctx.reply(
        "👋 Welkom bij Work Pay Bot!\n\n" +
        "Stuur je start- en einduur en ik bereken hoeveel je ongeveer verdiend hebt.\n\n" +
        "Bijvoorbeeld:\n" +
        "17:30 01:30\n\n" +
        "Typ /help voor meer informatie."
    );
});

bot.command("help", async (ctx) => {
    await ctx.reply(
        "💰 Work Pay Bot\n\n" +
        "Stuur twee tijdstippen om je loon te berekenen.\n\n" +
        "Voorbeeld:\n" +
        "17:30 01:30\n\n" +
        "Commando's:\n" +
        "/help - Toon deze uitleg\n" +
        "/rates - Toon de gebruikte tarieven\n" +
        "/details 17:30 01:30 - Toon de volledige berekening"
    );
});

bot.command("rates", async (ctx) => {
    await ctx.reply(
        "💶 Tarieven\n\n" +
        `Basisloon: €${PAY_CONFIG.hourlyRate.toFixed(2)}/u\n` +
        `Nachtpremie: €${PAY_CONFIG.nightBonusPerHour.toFixed(3)}/u\n` +
        `Nachtwerk: vanaf ${PAY_CONFIG.nightStartHour}:00\n` +
        `Overuren: na ${PAY_CONFIG.regularWorkHours} uur\n` +
        `Overurentarief: €${PAY_CONFIG.overtimeRate.toFixed(3)}/u\n` +
        `Koudepremie: €${PAY_CONFIG.coldBonus.toFixed(4)}/shift\n` +
        `Vakantiegeld: ${(PAY_CONFIG.holidayPayPercentage * 100).toFixed(2)}%\n` +
        `Kledijvergoeding: €${PAY_CONFIG.clothingAllowance.toFixed(2)}/shift\n` +
        `Woon-werkvergoeding: €${PAY_CONFIG.travelAllowance.toFixed(2)}/shift`
    );
});

bot.command("details", async (ctx) => {
    const shift = parseShift(ctx.match);

    if (!shift) {
        await ctx.reply(
            "Gebruik bijvoorbeeld: /details 17:30 01:30"
        );
        return;
    }

    const calculation = calculateShift(shift);

    await ctx.reply(
        formatDetailedResult(calculation)
    );
});

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

await bot.api.setMyCommands([
    {
        command: "start",
        description: "Start de bot",
    },
    {
        command: "help",
        description: "Toon uitleg",
    },
    {
        command: "rates",
        description: "Toon de gebruikte tarieven",
    },
    {
        command: "details",
        description: "Toon een volledige berekening",
    },
]);

bot.start();

console.log("Bot is running...");