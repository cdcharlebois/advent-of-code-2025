enum EOperation {
    addition = "+",
    multiplication = "*"
}
type TProblemDef = {
    operation: EOperation,
    start: number,
    end: number
}
const part1 = (input?: string): number => {
    const data = input || `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
    // assume that the operator is the leftmost column for the problem.
    const lines = data.split("\n")
    const operations = lines.slice(-1)[0];
    const values = lines.slice(0, lines.length - 1);
    if (!operations) throw new Error("bad data")
    // console.log({ operations });
    const horizontalBreaks: TProblemDef[] = [];
    operations.split("").forEach((val, i) => {
        if (val != ' ') {
            const nextSymbol = operations.substring(i + 1).search(/\+|\*/)
            horizontalBreaks.push({
                operation: val === '+' ? EOperation.addition : EOperation.multiplication,
                start: i,
                end: (nextSymbol > -1 ? i + nextSymbol : operations.length)
            });
        }
    })
    // console.log({ horizontalBreaks, values })
    let problemNumber = 0;
    let total = 0;
    for (const hb of horizontalBreaks) {
        // console.log(problemNumber)
        const numbers: number[] = [];
        // extract the values in each row 
        for (const valueRow of values) {
            numbers.push(parseInt(valueRow.substring(hb.start, hb.end)))
        }
        // console.log({ numbers })
        const solution = solveProblem(numbers, hb.operation);
        total += solution;
        // console.log({ solution })
        problemNumber++;
    }
    return total
}

const part2 = (input?: string): number => {
    const data = input || `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
    // assume that the operator is the leftmost column for the problem.
    const lines = data.split("\n")
    const operations = lines.slice(-1)[0];
    const values = lines.slice(0, lines.length - 1);
    if (!operations) throw new Error("bad data")
    // console.log({ operations });
    const horizontalBreaks: TProblemDef[] = [];
    operations.split("").forEach((val, i) => {
        if (val != ' ') {
            // find the next symbol (as the start of the next problemDef)
            const nextSymbol = operations.substring(i + 1).search(/\+|\*/)
            horizontalBreaks.push({
                operation: val === '+' ? EOperation.addition : EOperation.multiplication,
                start: i,
                // the end is either the next symbol or the end of the line
                end: (nextSymbol > -1 ? i + nextSymbol : operations.length)
            });
        }
    })
    // console.log({ horizontalBreaks, values })
    let problemNumber = 0;
    let total = 0;
    for (const hb of horizontalBreaks) {
        // console.log(problemNumber)
        const numbers: number[] = [];
        const rawNumbers: string[] = [];
        // extract the values in each row 
        for (const valueRow of values) {
            numbers.push(parseInt(valueRow.substring(hb.start, hb.end)))
            rawNumbers.push(valueRow.substring(hb.start, hb.end))
        }
        // console.log({ numbers })
        const solution = solveProblemAsCephalopod(rawNumbers, hb.operation);
        total += solution;
        // console.log({ solution })
        problemNumber++;
    }
    return total
}

/**
 * Solve the problem given an array of numbers and an operation
 * @param numbers 
 * @param operation 
 * @returns 
 */
const solveProblem = (numbers: number[], operation: EOperation): number => {
    switch (operation) {
        case EOperation.addition:
            return numbers.reduce((prev, curr) => prev += curr, 0)
        case EOperation.multiplication:
            return numbers.reduce((prev, curr) => prev *= curr, 1)
    }
}

/**
 * This part wasn't so bad. Needed to preserve the raw numbers as strings
 * instead of parsing them as numbers straight from the input, so that the index
 * of digits can be respected. From here, assemble them as cephalopod numbers 
 * (vertically) and then prase those as numbers, then solve the problem as 
 * normal.
 * @param rawNumbers the string segments of the problem numbers
 * @param operation 
 * @returns 
 */
const solveProblemAsCephalopod = (rawNumbers: string[], operation: EOperation): number => {
    // parse the numbers as a cephalopod, and then call `solveProblem`
    const problemWidth = rawNumbers[0]?.length;
    if (!problemWidth) throw new Error("problemn has bad width");
    const realNumbers : number[] = [];
    for (let i = 0; i < problemWidth; i++){
        const assembledStr = rawNumbers.reduce((prev, curr) => prev+`${curr.charAt(i)}` , "")
        // console.log({assembledStr});
        realNumbers.push(parseInt(assembledStr));
    }
    console.log({ rawNumbers, problemWidth, realNumbers });
    return solveProblem(realNumbers, operation);
}

export default {
    part1, part2
}