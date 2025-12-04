export const part1 = async (input: string): Promise<number | undefined> => {
    console.log("day 3")
    const banks = input.split("\n");
    let joltage = 0;
    for (const bank of banks) {
        // find the highest number in the line (that isn't the last number)
        const max = maxInSequenceOrFallback(bank, false);
        // from there, find the highest number after it
        const maxIndex = bank.indexOf(`${max}`);
        const remainingRange = bank.slice(maxIndex + 1)
        const nextMax = maxInSequenceOrFallback(remainingRange, true)
        const maxJolts = parseInt(`${max}${nextMax}`);
        console.log({ maxJolts })
        joltage += maxJolts
    }
    return joltage;
}
4234234234278
export const part2 = async (input: string): Promise<number | undefined> => {
    console.log("day 3 part 2")
    const banks = input.split("\n");
    // const banks = [""]
    let joltage = 0;
    for (const bank of banks) {
        const jolts = recursivelyAssemble(bank, 11, "");
        console.log({jolts})
        joltage += parseInt(jolts);
        // const bankLength = bank.length;
        // let remainderLength = 12;
        // let jolts;
        // const [max, index] = maxInSequence(bank);
        // // index = length-12 → only one solution ✅)
        // if (index === bankLength - remainderLength) {
        //     jolts = parseInt(bank.slice(bankLength - remainderLength))
        //     joltage += jolts;
        // } else if (index < bankLength - remainderLength){
        //     const [max, index] = maxInSequence(bank.slice(index)) /// with new remainder
        // }
        
    }
    return joltage;
}


const recursivelyAssemble = (bank: string, remainder: number, base: string) : string => {
    // find the highest number that isn't in the last 11 digits
    if (remainder === -1) return base;
    console.log({bank, remainder, base});
    const possibleNumbers = bank.slice(0, bank.length-remainder);
    console.log({possibleNumbers})
    const [maxInPossible, index] = maxInSequence(possibleNumbers);
    console.log({maxInPossible, index})
    base += `${maxInPossible}`
    return recursivelyAssemble(bank.slice(index+1), remainder-1, base);

} 

const maxInSequence = (input: string): [number, number] => {
    const max = Math.max(...input.split("").map(n => parseInt(n)));
    const index = input.indexOf(`${max}`);
    return [max, index];
}
const maxInSequenceOrFallback = (input: string, allowLastDigit: boolean): number => {
    let [maxInLine, _] = maxInSequence(input);
    if (!allowLastDigit && input.indexOf(`${maxInLine}`) === input.length - 1) {
        console.log("max is last char ", maxInLine)
        maxInLine = Math.max(...input.slice(0, input.length - 1).split("").map(n => parseInt(n)));
        console.log("falling back to second highest: ", maxInLine)
    } else {
        console.log("max is", maxInLine)
    }
    return maxInLine
}