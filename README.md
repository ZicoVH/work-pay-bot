# 💰 Work Pay Bot

A Telegram bot that calculates my estimated flexi-job earnings based on the start and end time of a shift.

The bot takes into account:

- Regular working hours
- Night work
- Overtime
- Cold allowance
- Holiday pay
- Clothing allowance
- Travel allowance

The project is written in **TypeScript** using **Node.js** and [grammY](https://grammy.dev/) for the Telegram Bot API.

## Example

Send the bot:

```text
17:30 01:30
```

The bot responds with a breakdown similar to:

```text
Je werkte 8u00.
Daarvan 5u30 nachtwerk.
Overuren: 0u00.

Basisloon: €126.80
Nachtpremie: €26.15
Overuren: €0.00
Koudepremie: €2.38
Vakantiegeld: €11.91
Kledijvergoeding: €1.44
Woon-werkvergoeding: €2.63

Geschat netto: €171.31
```

Shifts that continue past midnight are supported automatically.

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

These values are currently specific to my flexi-job and can be changed in `src/pay.ts`.

## Project structure

```text
src/
├── index.ts        # Telegram bot entry point
├── types.ts        # TypeScript domain types
├── time.ts         # Time parsing and calculations
├── pay.ts          # Pay calculation
├── calculator.ts   # Combines shift and pay calculations
└── formatter.ts    # Formats Telegram responses
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

Create a `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

The `.env` file is ignored by Git and should never be committed.

## Development

Start the bot directly from the TypeScript source:

```bash
npm run dev
```

This uses `tsx`, so a separate compilation step is not required during development.

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

The bot is currently deployed on a Raspberry Pi and runs as a `systemd` service.

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

View logs:

```bash
journalctl -u work-pay-bot -f
```

## Deploying a new version

After pushing changes to GitHub, update the Raspberry Pi with:

```bash
cd ~/apps/work-pay-bot

git pull
npm ci
npm run build

sudo systemctl restart work-pay-bot
```

Then verify:

```bash
sudo systemctl status work-pay-bot
```

## Tech stack

- TypeScript
- Node.js
- grammY
- Telegram Bot API
- dotenv
- systemd
- Raspberry Pi

## Planned features

Some possible future improvements:

- Store worked shifts
- Show earnings per month
- Show recent shifts
- Persist data using SQLite
- Commands such as `/month` and `/history`
- Better input validation
- Automated tests for pay calculations

## Disclaimer

The calculated amount is an estimate based on the configured pay rules. It should not be considered an official payroll calculation.