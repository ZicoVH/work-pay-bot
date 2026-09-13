# 💰 Work Pay Bot

A Telegram bot that calculates estimated flexi-job earnings based on the start and end time of a shift.

The bot takes into account:

- Regular working hours
- Night work
- Overtime
- Cold allowance
- Holiday pay
- Clothing allowance
- Travel allowance

The project is written in **TypeScript**, runs on **Node.js** and uses [grammY](https://grammy.dev/) for the Telegram Bot API.

## Features

- Calculate estimated earnings from a start and end time
- Automatically handle shifts that continue past midnight
- Calculate night work and overtime
- Show a compact earnings summary
- Show a detailed pay breakdown on request
- Display the configured pay rates
- Telegram command menu
- Automated tests for time and pay calculations
- Separate development and production bots
- 24/7 deployment on a Raspberry Pi using systemd

## Usage

Send the bot two timestamps:

```text
17:30 01:30
```

The bot responds with a compact summary:

```text
💰 Geschat verdiend: € 171,31

🕒 8u00 gewerkt
🌙 5u30 nachtwerk
```

Overtime is shown automatically when applicable:

```text
💰 Geschat verdiend: € 216,54

🕒 9u45 gewerkt
🌙 7u15 nachtwerk
⏱️ 0u45 overuren
```

Shifts that continue past midnight are supported automatically.

## Commands

### `/start`

Shows a short introduction to the bot.

### `/help`

Shows instructions and the available commands.

### `/rates`

Shows the pay rates currently used by the calculator.

### `/details`

Shows the full calculation for a shift.

Example:

```text
/details 17:30 01:30
```

This returns the worked hours, night work, overtime and a complete breakdown of the estimated earnings.

The commands are registered with Telegram and are available through the built-in command menu.

## Pay calculation

The current calculation uses the following rules:

| Component | Value |
|---|---:|
| Hourly rate | €15.85/hour |
| Night bonus | €4.755/hour |
| Night work starts | 20:00 |
| Overtime | After 9 hours |
| Overtime rate | €23.775/hour |
| Cold allowance | €2.3775/shift |
| Holiday pay | 7.67% |
| Clothing allowance | €1.44/shift |
| Travel allowance | €2.63/shift |

These values are currently specific to my flexi-job.

All pay-related values are stored centrally in:

```text
src/config.ts
```

This acts as the single source of truth for both the calculations and the `/rates` command.

## Project structure

```text
src/
├── index.ts          # Telegram bot entry point and commands
├── config.ts         # Pay rates and configuration
├── types.ts          # TypeScript domain types
├── time.ts           # Time parsing and calculations
├── pay.ts            # Pay calculation
├── calculator.ts     # Combines shift and pay calculations
├── formatter.ts      # Formats Telegram responses
├── time.test.ts      # Time calculation tests
└── pay.test.ts       # Pay calculation tests
```

The application follows a simple flow:

```text
Telegram message
      ↓
parseShift()
      ↓
calculateShift()
      ↓
calculatePay()
      ↓
formatResult()
      ↓
Telegram response
```

For detailed calculations, `formatDetailedResult()` is used instead.

## Requirements

- Node.js
- npm
- A Telegram bot token created through BotFather

## Installation

Clone the repository:

```bash
git clone git@github.com:ZicoVH/work-pay-bot.git
cd work-pay-bot
```

Install dependencies:

```bash
npm ci
```

Create a `.env` file in the project root:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

The `.env` file is ignored by Git and should never be committed.

## Development

Development uses a separate Telegram bot from production.

The local `.env` contains the development bot token:

```env
TELEGRAM_BOT_TOKEN=your_development_bot_token
```

Start the bot directly from the TypeScript source:

```bash
npm run dev
```

This uses `tsx`, so a separate compilation step is not required during development.

The production bot can continue running independently on the Raspberry Pi while the development bot runs locally.

## Testing

Run the automated tests with:

```bash
npm test
```

The tests cover:

- Worked time calculations
- Shifts crossing midnight
- Night work
- Overtime
- Pay calculations

Before deploying a new version, both the tests and build should succeed:

```bash
npm test
npm run build
```

## Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

Compiled files are written to:

```text
dist/
```

## Production

After building the project:

```bash
npm start
```

This executes:

```bash
node dist/index.js
```

## Raspberry Pi deployment

The production bot is deployed on a Raspberry Pi and runs 24/7 as a `systemd` service.

Project location:

```text
/home/zico/apps/work-pay-bot
```

The Raspberry Pi has its own `.env` containing the production Telegram bot token.

Example service configuration:

```ini
[Unit]
Description=Work Pay Telegram Bot
After=network.target

[Service]
Type=simple
User=zico
WorkingDirectory=/home/zico/apps/work-pay-bot
ExecStart=/home/zico/.nvm/versions/node/v24.21.0/bin/node /home/zico/apps/work-pay-bot/dist/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Service commands

Check status:

```bash
sudo systemctl status work-pay-bot
```

Restart:

```bash
sudo systemctl restart work-pay-bot
```

Stop:

```bash
sudo systemctl stop work-pay-bot
```

Start:

```bash
sudo systemctl start work-pay-bot
```

View live logs:

```bash
journalctl -u work-pay-bot -f
```

View the last 100 log entries:

```bash
journalctl -u work-pay-bot -n 100
```

The service is enabled in systemd, so the bot starts automatically after the Raspberry Pi reboots.

## Deploying a new version

Development and testing happen locally using the development bot.

Before pushing:

```bash
npm test
npm run build
```

Commit and push the changes:

```bash
git add .
git commit -m "Describe the change"
git push
```

Then update the Raspberry Pi:

```bash
cd ~/apps/work-pay-bot

git pull
npm ci
npm run build

sudo systemctl restart work-pay-bot
```

Verify the deployment:

```bash
sudo systemctl status work-pay-bot
```

The deployment flow is:

```text
Local development
       ↓
Development bot
       ↓
Tests + build
       ↓
GitHub
       ↓
Raspberry Pi
       ↓
Build
       ↓
systemd restart
       ↓
Production bot
```

## Development vs production

Development and production use the same source code but different environment configuration.

```text
Windows
└── .env
    └── Development bot token

Raspberry Pi
└── .env
    └── Production bot token
```

Because `.env` is excluded from Git, the two Telegram tokens remain separate.

## Tech stack

- TypeScript
- Node.js
- grammY
- Telegram Bot API
- dotenv
- Node.js Test Runner
- Git / GitHub
- Raspberry Pi
- Linux
- systemd

## Disclaimer

The calculated amount is an estimate based on the configured pay rules. It should not be considered an official payroll calculation.