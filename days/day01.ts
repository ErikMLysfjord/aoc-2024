const text = await Deno.readTextFile("./inputs/day01.txt");
const splitText = text.split("\n");

const splitLines: number[][] = splitText.map((line: string) =>
  line.split(/\s+/).map(Number),
);
splitLines.pop();

const firstRow: number[] = [];
const secondRow: number[] = [];

splitLines.forEach((element: number[]) => {
  firstRow.push(element[0]);
  secondRow.push(element[1]);
});

firstRow.sort((a, b) => a - b);
secondRow.sort((a, b) => a - b);

let totalDistance = 0;
for (let index = 0; index < 1000; index++) {
  totalDistance += Math.abs(firstRow[index] - secondRow[index]);
}

console.log("total distance:", totalDistance);

let similarityScore = 0;
for (const id of firstRow) {
  const idCount = secondRow.filter((e) => e === id).length;
  similarityScore += id * idCount;
}

console.log("similarity score:", similarityScore);
