import day10 from "./src/day10.js";
import day11 from "./src/day11.js";
import day8_3 from "./src/day8_3.js";
import fs from "node:fs/promises"
import day9 from "./src/day9.js";


(async () => {
  const input = await fs.readFile("./data/day9.txt", "utf-8");
  // const output = day8_3.part1(1000, input);
  const output = day9.part2(input);
  console.log({ output });
})();
