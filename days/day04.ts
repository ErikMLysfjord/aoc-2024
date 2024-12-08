import { assertEquals } from "@std/assert";

const text = await Deno.readTextFile("./inputs/day04.txt");

const countColumns = (input: string): number => {
  const splitLines = input.split("\n");
  splitLines.pop();

  const cols = [];
  for (let i = 0; i < splitLines[0].length; i++) {
    let col = "";
    for (let j = 0; j < splitLines.length; j++) {
      col = col.concat(splitLines[j][i]);
    }
    cols.push(col);
  }
  return cols.reduce((acc, col) => acc + countOccurrences(col), 0);
};

const collectDiagonals = (
  lines: string[],
  startX: number,
  startY: number,
  deltaX: number,
  deltaY: number,
): string => {
  let diagonal = "";
  let x = startX;
  let y = startY;
  while (x >= 0 && x < lines.length && y >= 0 && y < lines[0].length) {
    diagonal += lines[x][y];
    x += deltaX;
    y += deltaY;
  }
  return diagonal;
};

const countDiagonally = (input: string): number => {
  const splitLines = input.split("\n");
  splitLines.pop();

  const diagonalLines = [];

  // top left to bottom right
  for (let col = 0; col < splitLines[0].length; col++) {
    diagonalLines.push(collectDiagonals(splitLines, 0, col, 1, 1)); // from top
    if (col !== 0) {
      diagonalLines.push(
        collectDiagonals(splitLines, splitLines.length - 1, col, -1, 1),
      ); // from bottom
    }
  }

  // top right to bottom left
  for (let col = 0; col < splitLines[0].length; col++) {
    diagonalLines.push(collectDiagonals(splitLines, 0, col, 1, -1)); // from top
    if (col !== splitLines[0].length - 1) {
      diagonalLines.push(
        collectDiagonals(splitLines, splitLines.length - 1, col, -1, -1),
      ); // from bottom
    }
  }

  return diagonalLines.reduce((acc, curr) => acc + countOccurrences(curr), 0);
};

const countOccurrences = (input: string): number => {
  let count = 0;
  let xmasPosition = input.indexOf("XMAS");

  while (xmasPosition !== -1) {
    count++;
    xmasPosition = input.indexOf("XMAS", xmasPosition + 1);
  }

  let samxPosition = input.indexOf("SAMX");
  while (samxPosition !== -1) {
    count++;
    samxPosition = input.indexOf("SAMX", samxPosition + 1);
  }

  return count;
};

const getTotalXMASCount = (input: string): number => {
  return countOccurrences(input) + countColumns(input) + countDiagonally(input);
};

const extractDiagonals = (lines: string[], x: number, y: number) => {
  const leftRight = lines[x - 1][y - 1] + lines[x][y] + lines[x + 1][y + 1];
  const rightLeft = lines[x - 1][y + 1] + lines[x][y] + lines[x + 1][y - 1];
  return { leftRight, rightLeft };
};

const lookThroughText = (input: string) => {
  const splitLines = input.split("\n");
  splitLines.pop();

  const reg = /MAS|SAM/;
  let res = 0;
  for (let i = 1; i < splitLines.length - 1; i++) {
    for (let j = 1; j < splitLines.length - 1; j++) {
      if (splitLines[i][j] === "A") {
        const { leftRight, rightLeft } = extractDiagonals(splitLines, i, j);

        if (reg.test(leftRight) && reg.test(rightLeft)) {
          res += 1;
        }
      }
    }
  }
  return res;
};

console.log("task 1:", getTotalXMASCount(text));
console.log("task 2:", lookThroughText(text));

const helpText =
  "MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX\n";

Deno.test("should be 18 times", () => {
  assertEquals(getTotalXMASCount(helpText), 18);
});
Deno.test("horizontal is x times", () => {
  assertEquals(countOccurrences(helpText), 5);
});
Deno.test("vertical is x times", () => {
  assertEquals(countColumns(helpText), 3);
});

Deno.test("x-mas should be 9 times", () => {
  assertEquals(lookThroughText(helpText), 9);
});
