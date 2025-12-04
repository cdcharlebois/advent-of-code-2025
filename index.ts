import day1 = require("./src/day1");
// import day2, {part2} from "./src/day2";
import { part1, part2} from "./src/day3";

const fs = require("node:fs/promises");



(async () => {
  const input = await fs.readFile("./data/day3.txt", "utf-8");
  const output = await part2(input);
  console.log({output});
})();
