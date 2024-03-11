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
  }
}

function readConditions() {
  const grid = document.querySelector(".motus-grid");
  const cells = grid.querySelectorAll(".cell-content");
  const columns = extractColumnCount(grid);
  const attempts = cells.length / columns;

  const cellInfos = Array.from(cells).map(extractInfoFromCell);
  const cellTable = buildTableArray(cellInfos, columns);
  const conditions = cellTable.map(mapRowToCondition).filter(Boolean);
  return conditions
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
    return false;
  }
  return condition.join("") === getColoring(word, solution).join("");
}

function matchesConditions(solution, conditions) {
  return conditions.every(({ word, condition }) =>
    matchesCondition(word, solution, condition)
  );
}

function getCandidates() {
  const conditions = readConditions();
  const candidates =  KNOWN_WORDS.filter((word) => matchesConditions(word, conditions));
  console.log(candidates)
}

exportFunction(getCandidates, window, { defineAs: "getCandidates" });
