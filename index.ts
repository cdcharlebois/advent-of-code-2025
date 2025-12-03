import day1 = require("./src/day1");
import day2, {part2} from "./src/day2";

const fs = require("node:fs/promises");



(async () => {
  // const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`
  const input = await fs.readFile("./data/day2.txt", "utf-8");
  const output = await part2(input);
  console.log({output});
})();
