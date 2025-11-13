#!/usr/bin/env bun
// @bun

// src/index.ts
import { createCliRenderer, BoxRenderable, TextRenderable, RGBA } from "@opentui/core";
var THEMES = {
  "rose-pine": {
    name: "Rose Pine",
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
    iris: RGBA.fromInts(196, 167, 231, 255)
  },
  vesper: {
    name: "Vesper",
    base: RGBA.fromInts(16, 16, 16, 255),
    surface: RGBA.fromInts(24, 24, 24, 255),
    overlay: RGBA.fromInts(32, 32, 32, 255),
    muted: RGBA.fromInts(102, 102, 102, 255),
    subtle: RGBA.fromInts(153, 153, 153, 255),
    text: RGBA.fromInts(179, 179, 179, 255),
    love: RGBA.fromInts(222, 112, 120, 255),
    gold: RGBA.fromInts(216, 166, 87, 255),
    rose: RGBA.fromInts(255, 152, 146, 255),
    pine: RGBA.fromInts(96, 174, 125, 255),
    foam: RGBA.fromInts(87, 199, 183, 255),
    iris: RGBA.fromInts(138, 125, 201, 255)
  },
  catppuccin: {
    name: "Catppuccin Mocha",
    base: RGBA.fromInts(30, 30, 46, 255),
    surface: RGBA.fromInts(49, 50, 68, 255),
    overlay: RGBA.fromInts(88, 91, 112, 255),
    muted: RGBA.fromInts(108, 112, 134, 255),
    subtle: RGBA.fromInts(147, 153, 178, 255),
    text: RGBA.fromInts(205, 214, 244, 255),
    love: RGBA.fromInts(243, 139, 168, 255),
    gold: RGBA.fromInts(249, 226, 175, 255),
    rose: RGBA.fromInts(245, 194, 231, 255),
    pine: RGBA.fromInts(166, 227, 161, 255),
    foam: RGBA.fromInts(148, 226, 213, 255),
    iris: RGBA.fromInts(203, 166, 247, 255)
  },
  noir: {
    name: "Noir (Poimandres Black)",
    base: RGBA.fromInts(0, 0, 0, 255),
    surface: RGBA.fromInts(10, 10, 10, 255),
    overlay: RGBA.fromInts(20, 20, 20, 255),
    muted: RGBA.fromInts(80, 80, 80, 255),
    subtle: RGBA.fromInts(120, 120, 120, 255),
    text: RGBA.fromInts(173, 215, 255, 255),
    love: RGBA.fromInts(208, 103, 157, 255),
    gold: RGBA.fromInts(91, 206, 250, 255),
    rose: RGBA.fromInts(129, 161, 193, 255),
    pine: RGBA.fromInts(173, 215, 255, 255),
    foam: RGBA.fromInts(245, 169, 127, 255),
    iris: RGBA.fromInts(100, 200, 255, 255)
  }
};
var THEME_ORDER = ["rose-pine", "vesper", "catppuccin", "noir"];
var WORDS = [
  "left",
  "when",
  "start",
  "would",
  "year",
  "or",
  "there",
  "found",
  "let",
  "a",
  "them",
  "over",
  "our",
  "white",
  "be",
  "still",
  "long",
  "like",
  "will",
  "shall",
  "also",
  "about",
  "think",
  "his",
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "how",
  "man",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
  "its",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use"
];
function generateText(wordCount = 50) {
  const words = [];
  for (let i = 0;i < wordCount; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return words.join(" ");
}
function renderWPMGraph(samples) {
  if (samples.length === 0)
    return "\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581";
  const maxWPM = Math.max(...samples, 1);
  const blocks = ["\u2581", "\u2582", "\u2583", "\u2584", "\u2585", "\u2586", "\u2587", "\u2588"];
  return samples.map((wpm) => {
    const normalized = wpm / maxWPM;
    const blockIndex = Math.min(Math.floor(normalized * blocks.length), blocks.length - 1);
    return blocks[blockIndex];
  }).join("");
}
function calculateConsistency(samples) {
  if (samples.length < 2)
    return 100;
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / samples.length;
  const stdDev = Math.sqrt(variance);
  const cv = avg === 0 ? 0 : stdDev / avg * 100;
  return Math.max(0, Math.round(100 - cv));
}
async function createApp() {
  const state = {
    text: generateText(50),
    input: "",
    startTime: null,
    endTime: null,
    isFinished: false,
    currentTime: Date.now(),
    cursorVisible: true,
    wpmHistory: [],
    currentThemeIndex: 0,
    lastCursorBlink: Date.now(),
    lastWPMSample: Date.now()
  };
  const getTheme = () => THEMES[THEME_ORDER[state.currentThemeIndex]];
  const renderer = await createCliRenderer({
    backgroundColor: getTheme().base,
    exitOnCtrlC: false
  });
  let mainInterval = null;
  mainInterval = setInterval(() => {
    const now = Date.now();
    if (now - state.lastCursorBlink >= 400) {
      state.cursorVisible = !state.cursorVisible;
      state.lastCursorBlink = now;
      if (!state.isFinished) {
        render();
      }
    }
    if (!state.startTime) {
      return;
    }
    state.currentTime = now;
    if (now - state.lastWPMSample >= 1000) {
      const currentWPM = calculateWPM();
      if (currentWPM > 0) {
        state.wpmHistory.push(currentWPM);
        if (state.wpmHistory.length > 15) {
          state.wpmHistory.shift();
        }
      }
      state.lastWPMSample = now;
      if (!state.isFinished) {
        render();
      }
    }
  }, 100);
  const calculateWPM = () => {
    if (!state.startTime)
      return 0;
    const end = state.endTime || state.currentTime;
    const timeInMinutes = (end - state.startTime) / 1000 / 60;
    if (timeInMinutes === 0)
      return 0;
    const correctChars = state.input.split("").filter((char, i) => char === state.text[i]).length;
    const wordsTyped = correctChars / 5;
    return Math.round(wordsTyped / timeInMinutes);
  };
  const calculateAccuracy = () => {
    if (state.input.length === 0)
      return 100;
    const correctChars = state.input.split("").filter((char, i) => char === state.text[i]).length;
    return Math.round(correctChars / state.input.length * 100);
  };
  const getElapsedTime = () => {
    if (!state.startTime)
      return "0.0s";
    const end = state.endTime || state.currentTime;
    return ((end - state.startTime) / 1000).toFixed(1) + "s";
  };
  const render = () => {
    try {
      const theme = getTheme();
      renderer.root.getChildren().forEach((child) => renderer.root.remove(child.id));
      const mainBox = new BoxRenderable(renderer, {
        width: renderer.width,
        height: renderer.height,
        backgroundColor: theme.base,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      });
      const themeIndicator = new BoxRenderable(renderer, {
        position: "absolute",
        top: 1,
        right: 2
      });
      themeIndicator.add(new TextRenderable(renderer, {
        content: `Theme: ${theme.name} (Ctrl+T)`,
        fg: theme.subtle
      }));
      mainBox.add(themeIndicator);
      if (state.isFinished) {
        const wpm = calculateWPM();
        const accuracy = calculateAccuracy();
        const time = getElapsedTime();
        const correctChars = state.input.split("").filter((char, i) => char === state.text[i]).length;
        const incorrectChars = state.input.length - correctChars;
        const resultsBox = new BoxRenderable(renderer, {
          flexDirection: "column",
          alignItems: "center",
          gap: 1
        });
        const wpmRow = new BoxRenderable(renderer, {
          flexDirection: "row",
          gap: 2
        });
        wpmRow.add(new TextRenderable(renderer, {
          content: "WPM",
          fg: theme.subtle
        }));
        wpmRow.add(new TextRenderable(renderer, {
          content: wpm.toString(),
          fg: theme.gold
        }));
        resultsBox.add(wpmRow);
        const accuracyRow = new BoxRenderable(renderer, {
          flexDirection: "row",
          gap: 2
        });
        accuracyRow.add(new TextRenderable(renderer, {
          content: "Accuracy",
          fg: theme.subtle
        }));
        accuracyRow.add(new TextRenderable(renderer, {
          content: `${accuracy}%`,
          fg: theme.foam
        }));
        resultsBox.add(accuracyRow);
        const timeRow = new BoxRenderable(renderer, {
          flexDirection: "row",
          gap: 2
        });
        timeRow.add(new TextRenderable(renderer, {
          content: "Time",
          fg: theme.subtle
        }));
        timeRow.add(new TextRenderable(renderer, {
          content: time,
          fg: theme.rose
        }));
        resultsBox.add(timeRow);
        const charsRow = new BoxRenderable(renderer, {
          flexDirection: "row",
          gap: 2
        });
        charsRow.add(new TextRenderable(renderer, {
          content: "Characters",
          fg: theme.subtle
        }));
        charsRow.add(new TextRenderable(renderer, {
          content: `${correctChars}/${incorrectChars}`,
          fg: theme.text
        }));
        resultsBox.add(charsRow);
        if (state.wpmHistory.length > 0) {
          const graph = renderWPMGraph(state.wpmHistory);
          const peak = Math.max(...state.wpmHistory);
          const avg = Math.round(state.wpmHistory.reduce((a, b) => a + b, 0) / state.wpmHistory.length);
          const consistency = calculateConsistency(state.wpmHistory);
          resultsBox.add(new TextRenderable(renderer, {
            content: "",
            marginTop: 1
          }));
          resultsBox.add(new TextRenderable(renderer, {
            content: "WPM Progress",
            fg: theme.subtle
          }));
          resultsBox.add(new TextRenderable(renderer, {
            content: graph,
            fg: theme.iris
          }));
          const statsRow = new BoxRenderable(renderer, {
            flexDirection: "row",
            gap: 2
          });
          statsRow.add(new TextRenderable(renderer, {
            content: `Peak: ${peak}`,
            fg: theme.subtle
          }));
          statsRow.add(new TextRenderable(renderer, {
            content: "\u2022",
            fg: theme.muted
          }));
          statsRow.add(new TextRenderable(renderer, {
            content: `Avg: ${avg}`,
            fg: theme.subtle
          }));
          statsRow.add(new TextRenderable(renderer, {
            content: "\u2022",
            fg: theme.muted
          }));
          statsRow.add(new TextRenderable(renderer, {
            content: `Consistency: ${consistency}%`,
            fg: theme.subtle
          }));
          resultsBox.add(statsRow);
        }
        const helpText = new TextRenderable(renderer, {
          content: "Press Enter to try again \u2022 ESC to exit",
          fg: theme.subtle,
          marginTop: 1
        });
        resultsBox.add(helpText);
        mainBox.add(resultsBox);
      } else {
        const contentBox = new BoxRenderable(renderer, {
          flexDirection: "column",
          width: 80
        });
        const textBox = new BoxRenderable(renderer, {
          flexDirection: "column",
          marginBottom: 3
        });
        let displayText = "";
        for (let i = 0;i < state.text.length; i++) {
          const char = state.text[i];
          if (i < state.input.length) {
            if (state.input[i] === char) {
              displayText += char;
            } else {
              displayText += char;
            }
          } else if (i === state.input.length) {
            displayText += state.cursorVisible ? `[${char}]` : char;
          } else {
            displayText += char;
          }
        }
        const words = state.text.split(" ");
        let charIndex = 0;
        const lines = [];
        let currentLine = "";
        for (let wordIdx = 0;wordIdx < words.length; wordIdx++) {
          const word = words[wordIdx];
          const testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
          if (testLine.length > 80 && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        charIndex = 0;
        for (const line of lines) {
          const lineBox = new BoxRenderable(renderer, {
            flexDirection: "row"
          });
          let segmentStart = charIndex;
          for (let i = 0;i < line.length; i++) {
            const globalIdx = charIndex + i;
            const char = line[i];
            let shouldBreak = false;
            let currentColor = theme.muted;
            let currentBg = undefined;
            let nextColor = theme.muted;
            let nextBg = undefined;
            if (globalIdx < state.input.length) {
              if (state.input[globalIdx] === state.text[globalIdx]) {
                currentColor = theme.text;
              } else {
                currentColor = theme.love;
              }
            } else if (globalIdx === state.input.length) {
              currentColor = theme.iris;
              if (state.cursorVisible) {
                currentBg = theme.overlay;
              }
            }
            if (i < line.length - 1) {
              const nextGlobalIdx = globalIdx + 1;
              if (nextGlobalIdx < state.input.length) {
                if (state.input[nextGlobalIdx] === state.text[nextGlobalIdx]) {
                  nextColor = theme.text;
                } else {
                  nextColor = theme.love;
                }
              } else if (nextGlobalIdx === state.input.length) {
                nextColor = theme.iris;
                if (state.cursorVisible) {
                  nextBg = theme.overlay;
                }
              }
              if (currentColor !== nextColor || currentBg !== nextBg) {
                shouldBreak = true;
              }
            } else {
              shouldBreak = true;
            }
            if (shouldBreak) {
              lineBox.add(new TextRenderable(renderer, {
                content: line.substring(segmentStart - charIndex, i + 1),
                fg: currentColor,
                bg: currentBg
              }));
              segmentStart = charIndex + i + 1;
            }
          }
          textBox.add(lineBox);
          charIndex += line.length + 1;
        }
        contentBox.add(textBox);
        const statsBox = new BoxRenderable(renderer, {
          flexDirection: "row",
          gap: 1
        });
        statsBox.add(new TextRenderable(renderer, {
          content: calculateWPM().toString(),
          fg: theme.gold
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "wpm",
          fg: theme.text
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "\u2022",
          fg: theme.muted
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: `${calculateAccuracy()}%`,
          fg: theme.foam
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "acc",
          fg: theme.text
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "\u2022",
          fg: theme.muted
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: getElapsedTime(),
          fg: theme.rose
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "\u2022",
          fg: theme.muted
        }));
        statsBox.add(new TextRenderable(renderer, {
          content: "ESC to exit",
          fg: theme.subtle
        }));
        contentBox.add(statsBox);
        mainBox.add(contentBox);
      }
      renderer.root.add(mainBox);
    } catch (error) {
      console.error("Render error:", error);
    }
  };
  renderer.keyInput.on("keypress", (event) => {
    if (event.name === "escape") {
      if (mainInterval)
        clearInterval(mainInterval);
      renderer.destroy();
      process.exit(0);
    }
    if (event.ctrl && event.name === "t") {
      state.currentThemeIndex = (state.currentThemeIndex + 1) % THEME_ORDER.length;
      render();
      return;
    }
    if (state.isFinished) {
      if (event.name === "return") {
        state.text = generateText(50);
        state.input = "";
        state.startTime = null;
        state.endTime = null;
        state.isFinished = false;
        state.currentTime = Date.now();
        state.wpmHistory = [];
        state.lastCursorBlink = Date.now();
        state.lastWPMSample = Date.now();
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
      state.lastCursorBlink = Date.now();
      state.lastWPMSample = Date.now();
    }
    state.input += event.sequence;
    if (state.input.length === state.text.length) {
      state.endTime = Date.now();
      state.isFinished = true;
      if (mainInterval) {
        clearInterval(mainInterval);
        mainInterval = null;
      }
    }
    render();
  });
  await renderer.start();
  render();
}
createApp().catch(console.error);
