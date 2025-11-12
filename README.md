# Terminal Typing Speed Tester

A Monkeytype-like typing speed tester built with @opentui/core.

## Features

- Real-time typing feedback with color coding
- Live WPM (Words Per Minute) calculation  
- Accuracy tracking
- Running timer
- Backspace/Delete support
- Restart test with Enter
- Rose Pine color theme

## Installation

```bash
npm install
```

## Run

```bash
npm start
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
