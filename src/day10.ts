import { maxHeaderSize } from "node:http";
import { machine } from "node:os";

/**
 *
 * @param input
 * [.##.] - indicator lights
 * (3) (1,3) (2) (2,3) (0,2) (0,1) - button wiring schematics
 * {3,5,4,7} - joltage requirements
 * @returns
 */
type Light = {
  on: boolean;
};
type Button = {
  toggleIndexes: number[];
};
type Machine = {
  target: string;
  lights: Light[];
  buttons: Button[];
};
type T = any;
// from https://stackoverflow.com/a/20871714
const permutator = (inputArr: T[]): T[] => {
  let result: T = [];

  const permute = (arr: T, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};
const getCombinations = (array: T[], n: number): T[] => {
  const result: T[] = [];

  const generate = (start: number, currentCombination: T[]) => {
    if (currentCombination.length === n) {
      result.push([...currentCombination]); // Add a copy of the combination
      return;
    }

    for (let i = start; i < array.length; i++) {
      currentCombination.push(array[i]);
      generate(i + 1, currentCombination);
      currentCombination.pop(); // Backtrack
    }
  };

  generate(0, []);
  return result;
};

const logMachine = (machine: Machine): void => {
  console.log(machine.lights.map((light) => (light.on ? "#" : ".")).join(""));
};
const isMachineComplete = (machine: Machine): boolean => {
  const currentState = machine.lights
    .map((light) => (light.on ? "#" : "."))
    .join("");
  return currentState === machine.target;
};
const pushButton = (machine: Machine, buttonIndex: number): void => {
  const button = machine.buttons[buttonIndex];
  if (!button || !machine) throw new Error("Invalid machine or button index");
  button.toggleIndexes.forEach((index) => {
    //@ts-ignore
    machine.lights[index].on = !machine.lights[index].on;
  });
  logMachine(machine);
};
const pushButtonsUntilMachineIsComplete = (machine: Machine) => {
  // TODO
  // try different combinations of button presses until the machine is complete.
  let presses = 0;
  let complete = false;
  console.log(`there are ${machine.buttons.length} buttons for this machine`);
  while (!complete) {
    const combinations = getCombinations(
      machine.buttons.map((_, index) => index),
      presses
    );
    // const combinations = permutator(machine.buttons.map((_, index) => index));
    console.log(
      `${machine.buttons.length} buttons with a total of ${presses} means ${combinations.length} combinations`
    );
    // console.log({combinations})
    for (const combination of combinations) {
      machine.lights.forEach((light) => (light.on = false)); // reset lights
      for (let i = 0; i < presses; i++) {
        pushButton(machine, combination[i]);
        if (isMachineComplete(machine)) {
          complete = true;
          console.log(`machine complete after ${presses} presses!`);
          break;
        }
      }
      if (complete) break;
    }
    if (complete) break;

    presses++;
  }
  return presses;
};
const getData = (input?: string): string =>
  input ||
  `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

const part1 = (input?: string): number => {
  const data = getData(input);
  const machines: Machine[] = data
    .split("\n")
    // .slice(0, 1)
    .map((line) => {
      const lightPart = line.match(/\[[\.|#]+\]/)![0].slice(1, -1);
      const buttonsPart = line.match(/\(.+\)/)![0];
      return {
        target: lightPart,
        lights: lightPart!.split("").map((char) => ({ on: false })),
        buttons: buttonsPart
          .split(" ")
          .map((str) => str.replace(/\(|\)/g, ""))
          .map(
            (pair) =>
              ({
                toggleIndexes: pair
                  .split(",")
                  .map((numStr) => parseInt(numStr)),
              } as Button)
          ),
      } as Machine;
    });
  machines.forEach((machine) => logMachine(machine));
  const presses = machines.map((machine) =>
    pushButtonsUntilMachineIsComplete(machine)
  );
  console.log({ presses });
  return presses.reduce((a, b) => a + b, 0);
};

export default {
  part1,
};
