const CORRECT = "correct";
const MISPLACED = "misplaced";
const INCORRECT = "incorrect";
const UNKNOWN = "unknown";

function extractColumnCount(gridElement) {
  // The column count can be extracted from the grid's style
  const columnRegex = /repeat\((\d+), minmax\(0px, 1fr\)\)/;
  return parseInt(
    gridElement.style.gridTemplateColumns.match(columnRegex)[1],
    10
  );
}

function extractInfoFromCell(cellElement) {
  const content = cellElement.textContent;
  const classes = cellElement.classList;
  if (classes.contains("r")) {
    return { content, position: CORRECT };
  } else if (classes.contains("y")) {
    return { content, position: MISPLACED };
  } else if (classes.contains("-")) {
    return { content, position: INCORRECT };
  }
  return { content, position: UNKNOWN };
}

function buildTableArray(items, columns) {
  const table = [];
  for (let i = 0; i < items.length; i += columns) {
    table.push(items.slice(i, i + columns));
  }
  return table;
}

function mapRowToCondition(row) {
  if (row.every((cell) => cell.position !== UNKNOWN)) {
    return {
      word: row.map((cell) => cell.content).join(""),
      condition: row.map((cell) => cell.position),
    };
  } else if (
    row[0].content !== "" &&
    row.slice(1).every((cell) => cell.content === ".")
  ) {
    return {
      letter: row[0].content,
    };
  }
}

function readBoard() {
  const grid = document.querySelector(".game-center .motus-grid");
  if (!grid) {
    return { conditions: [] };
  }
  const cells = grid.querySelectorAll(".cell-content");
  const columns = extractColumnCount(grid);
  const attempts = cells.length / columns;

  const cellInfos = Array.from(cells).map(extractInfoFromCell);
  const cellTable = buildTableArray(cellInfos, columns);
  const conditions = cellTable.map(mapRowToCondition).filter(Boolean);
  return { conditions, columns, attempts };
}

function getColoring(word, solution) {
  word = word.split("");
  solution = solution.split("");
  if (word.length !== solution.length) {
    throw new Error("Word and solution must have the same length");
  }
  const coloring = Array(word.length).fill(INCORRECT);
  for (let i = 0; i < word.length; i++) {
    if (word[i] === solution[i]) {
      coloring[i] = CORRECT;
      word[i] = null;
      solution[i] = null;
    }
  }
  for (const letter of solution) {
    if (letter !== null && word.includes(letter)) {
      const firstIndex = word.indexOf(letter);
      coloring[firstIndex] = MISPLACED;
      word[firstIndex] = null;
    }
  }
  return coloring;
}

function matchesCondition(word, solution, condition) {
  if (condition.length !== solution.length) {
    throw new Error("Condition and solution must have the same length");
  }
  return condition.join(";") === getColoring(word, solution).join(";");
}

function matchesConditions(solution, conditions) {
  return conditions.every((condition) =>
    condition.letter
      ? solution[0] === condition.letter
      : matchesCondition(condition.word, solution, condition.condition)
  );
}

function typeWord(word) {
  const letters = [...document.querySelectorAll(".key span")];
  const lettersMap = {};
  for (const letter of letters) {
    lettersMap[letter.textContent] = letter;
  }
  for (const letter of word) {
    lettersMap[letter].click();
  }
  const enterButton = document.querySelector(".fas.fa-sign-in-alt");
  enterButton.click();
}

function typeCandidate() {
  const { conditions, columns, attempts } = readBoard();
  if (conditions.length === 0) {
    return;
  }
  const candidates = KNOWN_WORDS.filter(
    (word) =>
      word.length === columns &&
      !invalidWords.includes(word) &&
      matchesConditions(word, conditions)
  );
  if (conditions.length + 1 >= attempts && candidates.length > 1) {
    alert("Only one attempt left!");
    console.log(candidates);
  } else {
    const randomIndex = Math.floor(Math.random() * candidates.length);
    typeWord(candidates[randomIndex]);
    invalidateWord(candidates[randomIndex]);
  }
}

function invalidateWord(word) {
  invalidWords.push(word);
}

const invalidWords = [];

exportFunction(typeCandidate, window, { defineAs: "typeCandidate" });

setInterval(typeCandidate, 1400);
