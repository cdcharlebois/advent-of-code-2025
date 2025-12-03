export default async (input: string) : Promise<number | undefined> => {
    console.log("day 2");
    const ranges = input.split(",");
    let runningTotal = 0;
    for (const r of ranges) {
        const [minStr, maxStr] = r.split("-");
        try {
            const min = parseInt(minStr || "");
            const max = parseInt(maxStr || "");
            console.log({ min, max })
            for (let i = min; i <= max; i++) {
                const numberAsString = `${i}`;
                const length = numberAsString.length;
                if (length % 2 === 1) continue;
                const firstHalf = numberAsString.slice(0, length/2)
                const secondHalf = numberAsString.slice(length/2)
                console.log({firstHalf, secondHalf})
                if (firstHalf === secondHalf){
                    console.log(">>> MATCH <<<", i);
                    runningTotal += i;
                }
            }
            console.log({runningTotal})
        }
        catch (e) {
            throw new Error("Invalid min or max")
        }
    }
    return runningTotal;
    // console.log({ranges})
}

export const part2 = async (input: string) : Promise<number | undefined> => {
  console.log("day 2 part 2");
    const ranges = input.split(",");
    let runningTotal = 0;
    for (const r of ranges) {
        const [minStr, maxStr] = r.split("-");
        try {
            const min = parseInt(minStr || "");
            const max = parseInt(maxStr || "");
            console.log({ min, max })
            for (let i = min; i <= max; i++) {
                const numberAsString = `${i}`;
                if (isRepeatingOnly(numberAsString)){
                    console.log(">>> MATCH >>>", i);
                    runningTotal+=i;
                }
            }
            console.log({runningTotal})
        }
        catch (e) {
            throw new Error("Invalid min or max")
        }
    }
    return runningTotal;
    // console.log({ranges})
}

const isRepeatingOnly = (input: string) : boolean => {
    for (let i = 1; i <= input.length/2; i++){
        const seq = input.slice(0, i);
        if (input.split(seq).every(s => s === "")) {
            return true;
        }
    }
    return false;
}