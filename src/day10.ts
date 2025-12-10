/**
 * 
 * @param input 
 * [.##.] - indicator lights
 * (3) (1,3) (2) (2,3) (0,2) (0,1) - button wiring schematics
 * {3,5,4,7} - joltage requirements
 * @returns 
 */
const getData = (input?: string): string => input || `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`

const part1 = (input?: string ): number => {
    const data = getData(input);
    return 0;
}

export default {
    part1
}