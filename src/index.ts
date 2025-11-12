#!/usr/bin/env node
import { createCliRenderer, BoxRenderable, TextRenderable, RGBA } from "@opentui/core";

const ROSE_PINE = {
  base: RGBA.fromInts(25, 23, 36, 255),
  surface: RGBA.fromInts(31, 29, 46, 255),
  overlay: RGBA.fromInts(38, 35, 58, 255),
  muted: RGBA.fromInts(110, 106, 134, 255),
  subtle: RGBA.fromInts(144, 140, 170, 255),
  text: RGBA.fromInts(224, 222, 244, 255),
  love: RGBA.fromInts(235, 111, 146, 255),
  gold: RGBA.fromInts(246, 193, 119, 255),
  rose: RGBA.fromInts(235, 188, 186, 255),
  pine: RGBA.fromInts(49, 116, 143, 255),
  foam: RGBA.fromInts(156, 207, 216, 255),
  iris: RGBA.fromInts(196, 167, 231, 255),
};

const WORDS = [
  "left", "when", "start", "would", "year", "or", "there", "found", "let",
  "a", "them", "over", "our", "white", "be", "still", "long", "like",
  "will", "shall", "also", "about", "think", "his", "the", "and", "for",
  "are", "but", "not", "you", "all", "can", "her", "was", "one",
  "our", "out", "day", "get", "has", "him", "how", "man", "new",
  "now", "old", "see", "two", "way", "who", "boy", "did", "its",
  "let", "put", "say", "she", "too", "use"
];

function generateText(wordCount = 50): string {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return words.join(" ");
}

interface AppState {
  text: string;
  input: string;
  startTime: number | null;
  endTime: number | null;
  isFinished: boolean;
  currentTime: number;
}

async function createApp() {
  const state: AppState = {
    text: generateText(50),
    input: "",
    startTime: null,
    endTime: null,
    isFinished: false,
    currentTime: Date.now(),
  };

  const renderer = await createCliRenderer({
    backgroundColor: ROSE_PINE.base,
    exitOnCtrlC: false,
  });

  let intervalId: NodeJS.Timeout | null = null;

  const calculateWPM = (): number => {
    if (!state.startTime) return 0;
    const end = state.endTime || state.currentTime;
    const timeInMinutes = (end - state.startTime) / 1000 / 60;
    if (timeInMinutes === 0) return 0;
    const correctChars = state.input.split('').filter((char, i) => char === state.text[i]).length;
    const wordsTyped = correctChars / 5;
    return Math.round(wordsTyped / timeInMinutes);
  };

  const calculateAccuracy = (): number => {
    if (state.input.length === 0) return 100;
    const correctChars = state.input.split('').filter((char, i) => char === state.text[i]).length;
    return Math.round((correctChars / state.input.length) * 100);
  };

  const getElapsedTime = (): string => {
    if (!state.startTime) return "0.0s";
    const end = state.endTime || state.currentTime;
    return ((end - state.startTime) / 1000).toFixed(1) + "s";
  };

  const render = () => {
    renderer.root.getChildren().forEach(child => renderer.root.remove(child.id));

    const mainBox = new BoxRenderable(renderer, {
      width: renderer.width,
      height: renderer.height,
      backgroundColor: ROSE_PINE.base,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    });

    if (state.isFinished) {
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      const time = getElapsedTime();
      const correctChars = state.input.split('').filter((char, i) => char === state.text[i]).length;
      const incorrectChars = state.input.length - correctChars;

      const resultsBox = new BoxRenderable(renderer, {
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      });

      const wpmRow = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      });
      wpmRow.add(new TextRenderable(renderer, {
        content: "WPM",
        fg: ROSE_PINE.iris,
      }));
      wpmRow.add(new TextRenderable(renderer, {
        content: wpm.toString(),
        fg: ROSE_PINE.text,
      }));
      resultsBox.add(wpmRow);

      const accuracyRow = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      });
      accuracyRow.add(new TextRenderable(renderer, {
        content: "Accuracy",
        fg: ROSE_PINE.subtle,
      }));
      accuracyRow.add(new TextRenderable(renderer, {
        content: `${accuracy}%`,
        fg: ROSE_PINE.text,
      }));
      resultsBox.add(accuracyRow);

      const timeRow = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      });
      timeRow.add(new TextRenderable(renderer, {
        content: "Time",
        fg: ROSE_PINE.subtle,
      }));
      timeRow.add(new TextRenderable(renderer, {
        content: time,
        fg: ROSE_PINE.text,
      }));
      resultsBox.add(timeRow);

      const charsRow = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      });
      charsRow.add(new TextRenderable(renderer, {
        content: "Characters",
        fg: ROSE_PINE.subtle,
      }));
      charsRow.add(new TextRenderable(renderer, {
        content: `${correctChars}/${incorrectChars}`,
        fg: ROSE_PINE.text,
      }));
      resultsBox.add(charsRow);

      const helpText = new TextRenderable(renderer, {
        content: "Press Enter to try again • ESC to exit",
        fg: ROSE_PINE.subtle,
        marginTop: 1,
      });
      resultsBox.add(helpText);

      mainBox.add(resultsBox);
    } else {
      const contentBox = new BoxRenderable(renderer, {
        flexDirection: "column",
        width: 80,
      });

      const textBox = new BoxRenderable(renderer, {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
      });

      for (let i = 0; i < state.text.length; i++) {
        const char = state.text[i];
        let color = ROSE_PINE.muted;

        if (i < state.input.length) {
          if (state.input[i] === char) {
            color = ROSE_PINE.text;
          } else {
            color = ROSE_PINE.love;
          }
        } else if (i === state.input.length) {
          color = ROSE_PINE.iris;
        }

        textBox.add(new TextRenderable(renderer, {
          content: char,
          fg: color,
        }));
      }

      contentBox.add(textBox);

      const statsText = new TextRenderable(renderer, {
        content: `${calculateWPM()} wpm  •  ${calculateAccuracy()}% acc  •  ${getElapsedTime()}  •  ESC to exit`,
        fg: ROSE_PINE.text,
      });
      contentBox.add(statsText);

      mainBox.add(contentBox);
    }

    renderer.root.add(mainBox);
  };

  renderer.keyInput.on("keypress", (event) => {
    if (event.name === "escape") {
      if (intervalId) clearInterval(intervalId);
      renderer.destroy();
      process.exit(0);
    }

    if (state.isFinished) {
      if (event.name === "return") {
        state.text = generateText(50);
        state.input = "";
        state.startTime = null;
        state.endTime = null;
        state.isFinished = false;
        state.currentTime = Date.now();
        render();
      }
      return;
    }

    if (event.name === "backspace" || event.name === "delete") {
      if (state.input.length > 0) {
        state.input = state.input.slice(0, -1);
        render();
      }
      return;
    }

    if (event.name === "return" || event.name === "tab") {
      return;
    }

    if (!event.sequence || event.sequence.length !== 1) {
      return;
    }

    const charCode = event.sequence.charCodeAt(0);
    if (charCode < 32 || charCode === 127) {
      return;
    }

    if (!state.startTime) {
      state.startTime = Date.now();
      state.currentTime = Date.now();

      intervalId = setInterval(() => {
        state.currentTime = Date.now();
        render();
      }, 100);
    }

    state.input += event.sequence;

    if (state.input.length === state.text.length) {
      state.endTime = Date.now();
      state.isFinished = true;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    render();
  });

  await renderer.start();
  render();
}

createApp().catch(console.error);
