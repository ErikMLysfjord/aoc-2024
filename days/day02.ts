import { assertEquals } from "@std/assert";

const text = await Deno.readTextFile("./inputs/day02.txt");

const splitText = text.split("\n");

const splitLines: number[][] = splitText.map((line: string) =>
  line.split(/\s+/).map(Number),
);
splitLines.pop();

const checkIncOrDec = (numbers: number[]): boolean => {
  const isInc = numbers.every(
    (v, i, a) => !i || (a[i - 1] < v && Math.abs(a[i - 1] - v) < 4),
  );
  const isDec = numbers.every(
    (v, i, a) => !i || (a[i - 1] > v && Math.abs(a[i - 1] - v) < 4),
  );
  return isInc || isDec;
};

const safeLinesAmount = splitLines.reduce((acc, currLine) => {
  return checkIncOrDec(currLine) ? acc + 1 : acc;
}, 0);

const checkPermutations = (line: number[]): boolean => {
  for (let i = 0; i < line.length; i++) {
    const newLine = line.filter((_, index) => !(i === index));
    if (checkIncOrDec(newLine)) {
      return true;
    }
  }
  return false;
};

const unsafeLines = splitLines.filter((line) => !checkIncOrDec(line));
const safeMutatedLines = unsafeLines.reduce((acc, currLine) => {
  return checkPermutations(currLine) ? acc + 1 : acc;
}, safeLinesAmount);

Deno.test("Increasing list should be true", () => {
  const incList = [1, 2, 5, 8, 9];
  assertEquals(checkIncOrDec(incList), true);
});
Deno.test("Decreasing list should be true", () => {
  const decList = [9, 8, 5, 3, 1];
  assertEquals(checkIncOrDec(decList), true);
});
Deno.test("Scrambled list should be false", () => {
  const scrambled = [9, 5, 1, 3, 1];
  assertEquals(checkIncOrDec(scrambled), false);
});

Deno.test("Unsafe1", () => {
  const unsafe1 = [1, 3, 2, 4, 5];
  assertEquals(checkIncOrDec(unsafe1), false);
  assertEquals(checkPermutations(unsafe1), true);
});
Deno.test("Unsafe2", () => {
  const unsafe2 = [8, 6, 4, 4, 1];
  assertEquals(checkIncOrDec(unsafe2), false);
  assertEquals(checkPermutations(unsafe2), true);
});

console.log("Amount of safe lines:", safeLinesAmount);
console.log(
  "Amount of safe lines, allowing to remove one level:",
  safeMutatedLines,
);
