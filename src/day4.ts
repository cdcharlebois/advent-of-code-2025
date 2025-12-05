/**
 * a roll (@) can be accessed by a forklift if there are fewer than 4 rolls
 * in the adjacent 8 tiles
 * ___
 * _X_
 * ___
 * @param input 
 * @returns 
 */
const part1 = (input?: string): number => {
    const data = input || `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
    const grid = getGrid(data);
    let countAccessible = 0;
    const cellsWithRoll = grid.filter(cell => cell.roll)

    for (const cell of cellsWithRoll) {
        const neighbors = getNeighbors(grid, cell);
        if (neighbors.filter(n => n.roll).length < 4) {
            countAccessible++
        }
    }

    return countAccessible
}

const part2 = (input?: string) => {
    const data = input || `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
    const grid = getGrid(data);
    return recursivelyRemoveRolls(grid, 0);
}

type TGridCell = {
    roll: boolean,
    row: number,
    col: number,
}

const recursivelyRemoveRolls = (grid: TGridCell[], countRemoved: number): number => {
    const cellsWithRoll = grid.filter(cell => cell.roll)
    let removedThisCycle = 0
    for (const cell of cellsWithRoll) {
        const neighbors = getNeighbors(grid, cell);
        if (neighbors.filter(n => n.roll).length < 4) {
            cell.roll = false       // remove roll
            removedThisCycle++;
        }
    }
    // if none removed, exit
    if (removedThisCycle === 0) {
        return countRemoved + removedThisCycle
    }
    // else, call again with the new grid
    return recursivelyRemoveRolls(grid, countRemoved + removedThisCycle);
}


/**
 * Turn the string input into a flat array with row and column properties for 
 * ease of filtering
 * @param input 
 * @returns {TGridCell[]}
 */
const getGrid = (input: string): TGridCell[] => {
    let grid: TGridCell[] = [];
    const rows = input.split("\n");
    for (let r = 0; r < rows.length; r++) {
        const cols: TGridCell[] = rows[r]!.split("").map((str, c) => ({
            roll: str === '@',
            row: r,
            col: c
        }) as TGridCell)
        grid = [...grid, ...cols]
    }
    return grid;
}

/**
 * since the grid is a flat array now, finding neighbors is just filtering with 
 * the row and column of the reference cell. No 2D array stuff to worry about
 * or index out-of-bounds
 * @param grid 
 * @param cell - the reference cell
 * @returns {TGridCell[]} the neighboring cells
 */
const getNeighbors = (grid: TGridCell[], cell: TGridCell): TGridCell[] => {
    const neighbors = grid.filter(otherCell =>
        !(otherCell.row === cell.row && otherCell.col === cell.col) &&
        otherCell.row >= cell.row - 1 && otherCell.row <= cell.row + 1 &&
        otherCell.col >= cell.col - 1 && otherCell.col <= cell.col + 1)
    return neighbors
}

export default {
    part1, part2
}