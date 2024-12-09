import { assertEquals } from "@std/assert";

const text = await Deno.readTextFile("./inputs/day05.txt");

type Rules = {
  [key: string]: string[];
};

let actualRules: Rules = {};

let initialIllegalUpdates: string[][] = [];

const createRules = (rules: string) => {
  const splitRules = rules.split("\n");
  for (const rule of splitRules) {
    const [firstNum, secondNum] = rule.split("|");

    if (actualRules[firstNum] !== undefined) {
      actualRules[firstNum].push(secondNum);
    } else {
      actualRules[firstNum] = [secondNum];
    }
  }
};

const checkIfLegal = (string1: string, string2: string) => {
  const rules = actualRules[string1];
  if (!rules) {
    return false;
  }
  return rules.some((e) => e === string2);
};

const getValueOfUpdate = (update: string[]) => {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      if (!checkIfLegal(update[i], update[j])) {
        return 0;
      }
    }
  }
  const midIndex = (update.length - 1) / 2;
  return Number(update[midIndex]);
};

const populateIllegalUpdates = (update: string[]) => {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      if (!checkIfLegal(update[i], update[j])) {
        initialIllegalUpdates.push(update);
        return;
      }
    }
  }
};

const moveElementInArray = (
  arr: string[],
  old_index: number,
  new_index: number,
) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push("");
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

const bruteForceCombinations = (update: string[]) => {
  while (getValueOfUpdate(update) === 0) {
    for (let i = 0; i < update.length - 1; i++) {
      for (let j = i + 1; j < update.length; j++) {
        if (!checkIfLegal(update[i], update[j])) {
          moveElementInArray(update, i, j);
        }
      }
    }
  }
  return getValueOfUpdate(update);
};

const task1 = (input: string) => {
  const splitSequence = input.split("\n");

  return splitSequence.reduce(
    (acc, curr) => getValueOfUpdate(curr.split(",")) + acc,
    0,
  );
};

const task2 = (input: string) => {
  const splitSequence = input.split("\n");
  for (const update of splitSequence) {
    const sequence = update.split(",");
    populateIllegalUpdates(sequence);
  }

  return initialIllegalUpdates.reduce(
    (acc, curr) => bruteForceCombinations(curr) + acc,
    0,
  );
};

const helpText =
  "47|53\n97|13\n97|61\n97|47\n75|29\n61|13\n75|53\n29|13\n97|29\n53|29\n61|53\n97|53\n61|29\n47|13\n75|47\n97|75\n47|61\n75|61\n47|29\n75|13\n53|13\n\n75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47\n";

const rulesText = text.split("\n\n")[0];
const updatesText = text.split("\n\n")[1];

const helpRules = helpText.split("\n\n")[0];
const helpUpdates = helpText.split("\n\n")[1];

createRules(rulesText);

console.log("Task 1:", task1(updatesText));
console.log("Task 2:", task2(updatesText));

actualRules = {};
createRules(helpRules);

Deno.test("helptext should return 143", () => {
  assertEquals(task1(helpUpdates), 143);
});
Deno.test("illegal helptext should return 123", () => {
  initialIllegalUpdates = [];
  assertEquals(task2(helpUpdates), 123);
});
