type TBox = {
    x: number,
    y: number,
    z: number,
    id: number
}
type TPair = {
    box: TBox,
    closest: TBox,
    distance: number,
    rawBoxes: TBox[]
}
type TStrand = {
    boxes: TBox[]
}
const part1 = (input?: string): number => {
    const data = input || `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`
    //@ts-ignore
    const boxes: TBox[] = data.split("\n").map((line, nr) => {
        const [x, y, z] = line.split(",").map(Number);
        return { x, y, z, id: nr };
    });
    // const pairs: TPair[] = boxes.map(box => {
    //     const closestBox = boxes.reduce((prev, curr) => {
    //         // get the distance between this box and curr
    //         const distance = getDistance(box, curr)
    //         return distance < getDistance(box, prev) && distance != 0 ? curr : prev

    //     }, boxes.find(b => b.id !== box.id)!);
    //     return {
    //         box,
    //         closest: closestBox,
    //         distance: getDistance(box, closestBox),
    //         rawBoxes: [box, closestBox]
    //     };
    // });
    // pairs.forEach(logPair);
    const pairs = aNewHope(boxes);
    console.log(pairs.length)
    for (const p of pairs) {
        logPair2(p);
    }

    // console.log("DEDUPED:", dedupedPairs.length)
    // dedupedPairs.forEach(logPair);
    // const strands = recursivelyConnectBoxes(pairs, boxes, [], 0);
    // for (const s of strands) {
    //     console.log(`${s.boxes.length} boxes: ${s.boxes.map(logBox).join(",")}`)
    // }
    return 0;
}

type TPair2 = {
    boxes: TBox[],
    distance: number
}
const aNewHope = (boxes: TBox[]) : TPair2[] => {
    // establish the pairs (by distance)
    const pairs: TPair2[] = []
    boxes.forEach(box => {
        const closestBox = boxes.reduce((prev, curr) => {
            // get the distance between this box and curr
            const distance = getDistance(box, curr)
            return distance < getDistance(box, prev) && distance != 0 ? curr : prev
        }, boxes.find(b => b.id !== box.id)!);
        // if existing, ignore
        if (pairs.find(p => p.boxes.find(b => b.id === box.id) && p.boxes.find(b => b.id === closestBox.id))) {
            // ignore
        } else {
            // else add
            pairs.push({
                distance: getDistance(box, closestBox),
                boxes: [box, closestBox]
            })
        }
    });
    return pairs;
    // find the 10 shortest links
    // join them
}

const recursivelyConnectBoxes = (pairs: TPair[], boxes: TBox[], strands: TStrand[], minDistance: number): TStrand[] => {
    // console.log({ minDistance })
    pairs.forEach(logPair);
    const sortedPairs = pairs.sort((a, b) => a.distance - b.distance).slice(0, 10);
    for (const p of sortedPairs) {
        console.log(`connecting pair of boxes ${logBox(p!.box)} and ${logBox(p!.closest)}: ${p.distance}`)
        // connect the boxes. If either one of the boxes is already in a strand, add them to the strand
        // if you connect to an existing strand, add the new box/es to the strand
        const existingStrand = strands.find(s => s.boxes.find(b => b.id === p.box.id || b.id === p.closest.id));
        if (existingStrand) {
            console.log(`adding boxes ${logBox(p.box)} and ${logBox(p.closest)} to strand`)
            existingStrand.boxes = [...new Set([...existingStrand.boxes, p.box, p.closest])]
        }
        // otherwise, create a new strand
        else {
            console.log(`➕ new strand with boxes ${logBox(p.box)} and ${logBox(p.closest)}`)
            const strand: TStrand = { boxes: [p.box, p.closest] };
            strands.push(strand)
        }
        console.log(`🔔 there are now ${strands.length} circuits with ${strands.sort((a, b) => b.boxes.length - a.boxes.length).map(s => s.boxes.length).join(",")}`)
    }
    return strands.sort((a, b) => b.boxes.length - a.boxes.length);
}

const getDistance = (a: TBox, b: TBox): number => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}
const logPair = (item: TPair) => {
    console.log({
        box: logBox(item.box),
        closest: logBox(item.closest),
        distance: item.distance
    })
}
const logPair2 = (p: TPair2) => {
    console.log({
        box: logBox(p.boxes[0]!),
        closest: logBox(p.boxes[1]!),
        distance: p.distance
    })
}
const logBox = (box: TBox) => {
    return `[${box.id}]: ${box.x},${box.y},${box.z}`;
}

export default {
    part1
}