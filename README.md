# tyxt

A Monkeytype-like typing speed tester for your terminal, built with @opentui/core.

**⚠️ Bun is required to run this application** - `@opentui/core` uses Bun-specific APIs and will not work with Node.js alone.

## Features

- Real-time typing feedback with color coding
- Live WPM (Words Per Minute) calculation  
- Accuracy tracking
- Running timer
- Backspace/Delete support
- Restart test with Enter
- Multiple color themes (Rose Pine, Vesper, Catppuccin, Noir)

## Prerequisites

**Bun is required** to run this application. Install it from [bun.sh](https://bun.sh):

```bash
curl -fsSL https://bun.sh/install | bash
```

Or on Windows:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Installation & Usage

### Option 1: Run with bunx (recommended)
```bash
bunx tyxt
```

### Option 2: Install with npm/npx
Even though the package is installed via npm, **Bun is still required to run it**:

```bash
npm install -g tyxt
tyxt
```

Or run directly:
```bash
npx tyxt
```

If Bun is not installed, you'll see a helpful error message with installation instructions.

### Option 3: Install with Bun
```bash
bun install -g tyxt
tyxt
```

## Controls

- **Type** - Any alphanumeric keys
- **Backspace/Delete** - Correct mistakes
- **Enter** - Restart test (when finished)
- **ESC** - Exit anytime

## How It Works

The app displays random words from a preset list. Type them as fast as you can:

- **Grey text** = Not yet typed
- **Purple text** = Current cursor position
- **White text** = Correctly typed
- **Red text** = Incorrectly typed

When finished, see your stats:
- WPM (Words Per Minute)
- Accuracy percentage
- Total time
- Characters typed (correct/incorrect)

Press Enter to try again with a new word set.

## Technical Details

Built using:
- **TypeScript** - Type-safe development
- **@opentui/core** - Terminal UI rendering
- **Bun** - Runtime (required for @opentui/core)

## License

ISC
