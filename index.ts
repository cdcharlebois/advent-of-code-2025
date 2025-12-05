import day1 = require("./src/day1");
// import day2, {part2} from "./src/day2";
import { part1, part2} from "./src/day3";
import day4 from "./src/day4";

const fs = require("node:fs/promises");



(async () => {
  const input = await fs.readFile("./data/day4.txt", "utf-8");
  const output = await day4.part1(input);
  console.log({output});
})();
