const part1 = (input?: string): number => {
    const data = input || `3-5
10-14
16-20
12-18

1
5
8
11
17
32`

    // the first lines are the ranges of fresh ingredients
    // then the next are IDs of ingredients available
    // how many ingredients are fresh?

    const [strRanges, strAavailable] = data.split("\n\n").map(line => line.split("\n"));
    const ranges = strRanges?.map(rangeString => {
        const [strFrom, strTo] = rangeString.split("-");
        return {
            from: parseInt(strFrom!),
            to: parseInt(strTo!)
        }
    })
    const available = strAavailable?.map(idString => parseInt(idString));
    const numAvailable = available?.filter(id => ranges?.find(range => id >= range.from && id <= range.to)).length
    console.log({ strRanges, strAavailable, ranges, numAvailable })
    return numAvailable!
}

const part2 = (input?: string): number => {
    const data = input || `3-5
10-14
16-20
12-18
10-20

1
5
8
11
17
32`

    // the first lines are the ranges of fresh ingredients
    // then the next are IDs of ingredients available
    // how many ingredient IDs are fresh?

    const [strRanges, strAavailable] = data.split("\n\n").map(line => line.split("\n"));
    if (!strRanges) throw new Error("bad")
    let ranges: TRange[] = strRanges?.map(rangeString => {
        const [strFrom, strTo] = rangeString.split("-");
        return {
            from: parseInt(strFrom!),
            to: parseInt(strTo!)
        }
    })
    /**
     * Part 2 strategy for tomorrow:
     * add all the ranges to an array
     * recursively, check each range in the array to see if it:
     * a) is contained in another range or
     *      --> remove the range (it's superfluous)
     * b) clips another range
     *      --> expand the other range and remove this one 
     * c) is exclusive
     * 
     * once every item in the array is exclusive, (c), we have the right array or ranges and can reduce it to get the sum total
     */
    if (!ranges) throw new Error("Bad ranges")
    const combinedRanges = recursivelyCombineRanges(ranges);
    const clips = checkRangesForClips(combinedRanges);
    const hasDupes = checkRangesForDupes(combinedRanges);
    console.log({ clips, hasDupes })
    const countFresh = combinedRanges.reduce((prev, curr) => prev + curr.to - curr.from + 1, 0)
    // console.log({
    //     ranges,
    //     countFresh,
    //     combinedRanges
    // })
    return countFresh;
}
type TRange = {
    from: number,
    to: number
}
const recursivelyCombineRanges = (ranges: TRange[]): TRange[] => {
    for (const range of ranges) {
        // console.log(">>> loop start", { ranges })
        let clipped = ranges.find(er =>
            (!(er.from === range.from && er.to === range.to)) && // not the same range
            (er.from <= range.from && er.to >= range.from ||  // range.from is inside er
                er.from <= range.to && er.to >= range.to)         // range.to is inside er
        )
        /**
         * This was tricky! If a duped range exists, it doesn't actually catch
         * in the clipped check above, because it filters out ranges with the 
         * same start and end (in an effort to not match with the range itself).
         * This check is needed as a separate check to see if there's a dupe
         * and, if so, to remove one of them.
         */
        const duped = ranges.filter(er => er.from === range.from && er.to === range.to)
        if (duped.length > 1) {
            // remove this range
            const firstOccurrence = ranges.findIndex(er => er.from === range.from && er.to === range.to)
            ranges = [...ranges.slice(0, firstOccurrence), ...ranges.slice(firstOccurrence + 1)]
        }
        if (clipped) {
            // take some action and then recurse
            // check fully contained
            if (clipped.from <= range.from && clipped.to >= range.to) {
                // fully contained
                console.log("range", range, "is fully contained in", clipped, ". removing", range)
                ranges = ranges.filter(r => !(r.to === range.to && r.from === range.from))
            } else {
                console.log("range", range, "is clipped in", clipped, ". adjusting", clipped)
                const newMax = Math.max(clipped.to, range.to);
                const newMin = Math.min(clipped.from, range.from);
                const newRange = {
                    from: newMin,
                    to: newMax
                }

                console.log("removing", range)
                ranges = ranges.filter(r => !(r.to === range.to && r.from === range.from))
                console.log("adding:", newRange)
                ranges.push(newRange);
            }
            return recursivelyCombineRanges(ranges);
        }
    }
    return ranges;
}

/**
 * These functions are to help troubleshoot and confirm that the recursive
 * function above is doing what it's supposed to. They are not strictly
 * necessary
 * @param ranges 
 * @returns 
 */
const checkRangesForClips = (ranges: TRange[]): boolean => {
    for (const range of ranges) {
        let clipped = ranges.find(er =>
            (!(er.from === range.from && er.to === range.to)) && // not the same range
            (er.from <= range.from && er.to >= range.from ||  // range.from is inside er
                er.from <= range.to && er.to >= range.to)         // range.to is inside er
        )
        if (clipped) {
            console.error("range", range, "is clipped in range", clipped)
            return true;
        }
    }
    return false;
}
const checkRangesForDupes = (ranges: TRange[]): boolean => {
    for (const range of ranges) {
        let dupe = ranges.filter(er =>
            er.from === range.from && er.to === range.to       // range.to is inside er
        )
        if (dupe.length > 1) {
            console.error("range", range, "is duplicated", dupe.length, "times")
            return true;
        }
    }
    return false;
}

export default {
    part1, part2
}

/**
 * Part 2 strategy for tomorrow:
 * add all the ranges to an array
 * recursively, check each range in the array to see if it:
 * a) is contained in another range or
 *      --> remove the range (it's superfluous)
 * b) clips another range
 *      --> expand the other range and remove this one 
 * c) is exclusive
 * 
 * once every item in the array is exclusive, (c), we have the right array or ranges and can reduce it to get the sum total
 */