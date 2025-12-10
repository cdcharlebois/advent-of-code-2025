import day1 = require("./src/day1");
// import day2, {part2} from "./src/day2";
import { part1, part2 } from "./src/day3";
import day4 from "./src/day4";
import day5 from "./src/day5";
import day6 from "./src/day6";
import day7 from "./src/day7";
import day8_2 from "./src/day8_2";
import day9 from "./src/day9";

const fs = require("node:fs/promises");


(async () => {
  // const input = await fs.readFile("./data/day9.txt", "utf-8");
  const output = day9.part2();
  console.log({ output });
})();

