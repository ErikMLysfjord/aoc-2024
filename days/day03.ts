import { assertEquals } from "@std/assert";

const text = await Deno.readTextFile("./inputs/day03.txt");

const complicatedRegex = /(?<=mul\()[0-9]{1,3}\,[0-9]{1,3}(?=\))/g;

const calculateProduct = (input: string): number => {
  const results: number[][] =
    input.match(complicatedRegex)?.map((el) => el.split(",").map(Number)) ?? [];

  return results.reduce((acc, currVals) => acc + currVals[0] * currVals[1], 0);
};

const task1 = calculateProduct(text);
console.log("Task 1:", task1);

const findValidString = (input: string, startDo: boolean): string => {
  if (startDo) {
    if (!/don\'t\(\)/s.test(input)) {
      return input;
    }
    const splitInput = input.split(/don\'t\(\)(.*)/s);
    return splitInput[0] + findValidString(splitInput[1], false);
  }

  if (!/do\(\)/s.test(input)) {
    return "";
  }
  const splitInput = input.split(/do\(\)(.*)/s);
  return findValidString(splitInput[1], true);
};

const validString = findValidString(text, true);
console.log("Task 2:", calculateProduct(validString));

Deno.test("test string should equal 161", () => {
  const testString =
    "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
  assertEquals(calculateProduct(testString), 161);
});
Deno.test("test string should equal 48", () => {
  const testString =
    "xmul(2,4)&mul[3,7]!^don't()\n_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
  const validString = findValidString(testString, true);
  assertEquals(calculateProduct(validString), 48);
});
