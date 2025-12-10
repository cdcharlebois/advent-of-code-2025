import day8_3 from "./src/day8_3.js";
import fs from "node:fs/promises"


(async () => {
  const input = await fs.readFile("./data/day8.txt", "utf-8");
  // const output = day8_3.part1(1000, input);
  const output = day8_3.part1(10);
  console.log({ output });
})();

