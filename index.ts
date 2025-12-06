import day1 = require("./src/day1");
// import day2, {part2} from "./src/day2";
import { part1, part2 } from "./src/day3";
import day4 from "./src/day4";
import day5 from "./src/day5";
import day6 from "./src/day6";

const fs = require("node:fs/promises");


(async () => {
  const input = await fs.readFile("./data/day6.txt", "utf-8");
  const output = day6.part2(input);
  console.log({ output });
})();

