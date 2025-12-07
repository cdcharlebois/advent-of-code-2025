type TSplitter = {
    row: number,
    col: number,
}
type TManifold = {
    width: number,
    rows: number,
    startColumn: number,
    splitters: TSplitter[],
}
const part1 = (input?: string): number => {
    const data = input || `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`
    const manifold = parseManifold(data);
    const hit = processManifold(manifold);
    // console.log(JSON.stringify(manifold, null, 2))
    return hit.length;
}
const part2 = (input?: string): number => {
    const data = input || `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`
    const manifold = parseManifold(data);
    // const hits = processManifold(manifold);
    const paths = evaluatePaths(manifold);
    // const hitSplitters = processManifold(manifold);
    // console.log({ hits })
    return paths;
}

/**
 * Holy moly this took me a long time to wrap my head around. Ultimately, the 
 * thought that helped was thinking about pouring water down the paths, where
 * *each* output of each splitter was the sum of the incoming volume (I called
 * this "weight"). I needed to track the weight of each beam as it progressed 
 * down the tree, so I added that as a property of the beams. 
 * 
 * If one splitter is hit by 2 incoming beams, that means there are 2 ways to 
 * get to that splitter, so there are two ways to arrive at each of _that_ 
 * splitter's destinations as well. Hence carrying the weight forward. 
 * 
 * Once you reach the bottom, you have the beams and the total weight carried by
 * each, which amounts to the total number of ways there are to arrive at each
 * beam. Sum those numbers and that's the number of possible paths.
 * @param manifold 
 * @returns 
 */
const evaluatePaths = (manifold: TManifold): number => {
    // init the beam with weight 1
    let beams = [{
        column: manifold.startColumn,
        weight: 1
    }];
    // for each row, process the  hit splitters, based on the beam/s 
    for (let r = 1; r < manifold.rows; r++) {
        // console.log(`In row ${r}, the beams are at cols [${beams.join(", ")}]`)
        const splittersThisRow = manifold.splitters.filter(s => s.row === r);
        // console.log(`There are splitters here at cols [${splittersThisRow.map(s => s.col).join(", ")}]`)
        const hitSplittersThisRow = splittersThisRow.filter(s => beams.find(b => b.column === s.col))
        // console.log(`Splitters ${hitSplittersThisRow.map(s => s.col).join(", ")} are hit`)
        // console.log({hitSplitters})
        for (const s of hitSplittersThisRow) {
            // find the beams that hit this splitter
            const incomingBeams = beams.filter(b => b.column === s.col);
            const outgoingWeight = incomingBeams.reduce((prev, curr) => prev + curr.weight, 0)
            //  console.log(`Splitter ${s.col}, is hit with weight ${outgoingWeight}`)
            beams = beams.filter(b => b.column != s.col) // the beam stops at the splitter
            beams.push(...[{
                column: s.col - 1,
                weight: outgoingWeight
            }, {
                column: s.col + 1,
                weight: outgoingWeight
            }])
        }
    }
    console.log({ beams })
    const beamWeight = beams.reduce((prev, curr) => prev + curr.weight, 0)
    // console.log()
    console.log({ beamWeight })
    // return the number of active splitters
    // console.log({hitSplitters})
    return beamWeight
}

const processManifold = (manifold: TManifold): TSplitter[] => {
    // init the beam
    let beams = [manifold.startColumn];
    const hitSplitters: TSplitter[] = []
    // for each row, process the  hit splitters, based on the beam/s 
    for (let r = 1; r < manifold.rows; r++) {
        console.log(`In row ${r}, the beams are at cols [${beams.join(", ")}]`)
        const splittersThisRow = manifold.splitters.filter(s => s.row === r);
        console.log(`There are splitters here at cols [${splittersThisRow.map(s => s.col).join(", ")}]`)
        const hitSplittersThisRow = splittersThisRow.filter(s => beams.indexOf(s.col) > -1)
        console.log(`Splitters ${hitSplittersThisRow.map(s => s.col).join(", ")} are hit`)
        hitSplitters.push(...hitSplittersThisRow);
        // console.log({hitSplitters})
        for (const s of hitSplittersThisRow) {
            beams = beams.filter(b => b != s.col) // the beam stops at the splitter
            beams.push(...[s.col - 1, s.col + 1])
        }
        beams = [...new Set(beams)];
    }
    // return the number of active splitters
    // console.log({hitSplitters})
    return hitSplitters
}

/**
 * Parses the manifold into an object with an array of splitters, a start
 * column, width and height
 * @param input 
 * @returns 
 */
const parseManifold = (input: string): TManifold => {
    const rows = input.split("\n");
    if (!rows[0]) throw new Error("bad input")
    const width = rows[0].length;
    const start = rows[0].indexOf("S");
    const splitters: TSplitter[] = [];
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < width; c++) {
            const char = rows[r]?.charAt(c)
            if (char && char === "^") {
                splitters.push({
                    row: r,
                    col: c,
                })
            }
        }
    }
    return {
        rows: rows.length,
        width,
        startColumn: start,
        splitters
    }
}



export default {
    part1, part2
}