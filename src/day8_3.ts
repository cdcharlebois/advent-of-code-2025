import {v4 as uuid} from "uuid"

const randomId = uuid

type Box = {
    id: number,
    x: number,
    y: number,
    z: number
}
type Circuit = {
    id: string,
    boxes: Box[]
}
type Segment = {
    box1: Box,
    box2: Box,
    distance: number
}
const getData = (input?: string) => {
    return input || `162,817,812
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
}

const getDistance = (a: Box, b: Box): number => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

const getBoxes = (data: string): Box[] => {
    //@ts-ignore
    return data.split("\n").map((line, i) => {
        const [x, y, z] = line.split(",");
        return {
            x, y, z, id: i
        }
    })
}

const getClosestNeighbor = (box: Box, boxes: Box[], circuits: Circuit[]): Box | void => {
    // console.log("----- Findind the closest box to ", box.id, "-----")
    const boxesInCircuit = circuits.find(c => c.boxes.find(b => b.id === box.id))?.boxes || []
    // console.log("The following are already connected to ", box.id, ": ", boxesInCircuit.map(b => b.id).join(", "))
    const availableBoxes = boxes
        .filter(b => b.id != box.id) // not this box
        .filter(b => !boxesInCircuit.find(bb => bb.id === b.id)) // not boxes in circuit
    // console.log(`There are ${availableBoxes.length} available boxes`)
    if (!availableBoxes || availableBoxes.length < 1 || !availableBoxes[0]) {
        return
    }
    let closestDistance = getDistance(box, availableBoxes[0])
    const closest = availableBoxes.reduce((prev, curr) => {
        const dist = getDistance(box, curr);
        if (dist < closestDistance) {
            // console.log(`\tBox ${box.id} is ${dist} from box ${curr.id}`)
            closestDistance = dist;
            return curr;
        }
        return prev
    }, availableBoxes[0])
    // console.log(`\t\tThe closest box to ${box.id} is ${closest.id}.`)
    return closest;
}

const part1 = (connections: number, input?: string): number => {
    const data = getData(input);
    // console.log({data})
    const boxes = getBoxes(data);
    let circuits: Circuit[] = [];
    // find each box's closest neighbor 
    circuits = recursivelyConnectBoxes(boxes, circuits, connections-1);
    for (const c of circuits) {
        console.log(`Circuit ${c.id} has ${c.boxes.length} boxes: (${c.boxes.map(b => b.id).join(",")})`)
    }
    const top3 = circuits.sort((a, b) => b.boxes.length - a.boxes.length).slice(0, 3)
    console.log("--- Top 3 ---")
    for (const c of top3){
        console.log(`Circuit ${c.id} has ${c.boxes.length} boxes: (${c.boxes.map(b => b.id).join(",")})`)
    }
    return top3.reduce((prev, curr) => prev * curr.boxes.length, 1);
    // console.log(circuits);
    // return 0;
}

const recursivelyConnectBoxes = (boxes: Box[], circuits: Circuit[], connections: number): Circuit[] => {
    if (connections === 0) {
        return circuits;
    }
    // console.log("Circuits at start of call", JSON.stringify(circuits, null, 2))
    //@ts-ignore
    const neighborMap: { box: Box | null, neighbor: Box, distance: number }[] = boxes.map(b => {
        const neighbor = getClosestNeighbor(b, boxes, circuits);
        return {
            box: b,
            neighbor: neighbor,
            distance: neighbor ? getDistance(b, neighbor) : null
        }
    })
    // connect the shortest connection
    const shortestConnection = neighborMap.sort((a, b) => a.distance - b.distance)[0]
    if (!shortestConnection || !shortestConnection.box || !shortestConnection.neighbor) {
        return circuits
    } else {
        console.log(`----------`)
        console.log(`${circuits.length} circuits exist:`)
        circuits.forEach(c => {
            console.log(`\tCircuit ${c.id} has ${c.boxes.length} boxes: (${c.boxes.map(b => b.id).join(",")})`)
        })
        console.log(`The shortest connection is ${shortestConnection.distance.toFixed(2)}, between boxes ${shortestConnection.box.id} and ${shortestConnection.neighbor.id}`)
        //@ts-ignore
        const boxCircuit = circuits.find(c => c.boxes.find(b => b.id === shortestConnection.box.id));
        const neighborCircuit = circuits.find(c => c.boxes.find(b => b.id === shortestConnection.neighbor.id));
        // console.log({ boxCircuit, neighborCircuit })
        console.log(`Box ${shortestConnection.box.id} is on circuit ${boxCircuit?.id || "[NONE]"}, and box ${shortestConnection.neighbor.id} is on circuit ${neighborCircuit?.id || "[NONE]"}`)
        // if neither box is on a circuit,
        if (!(boxCircuit || neighborCircuit)) {
            const id = randomId();
            console.log(`Creating a new circuit ${id} with boxes ${[shortestConnection.box, shortestConnection.neighbor].map(b => b.id).join(",")}`)
            circuits.push({
                boxes: [shortestConnection.box, shortestConnection.neighbor],
                id
            })
        }
        // if box is on a circuit
        else if (boxCircuit && !neighborCircuit) {
            console.log(`Adding box ${shortestConnection.neighbor.id} to circuit ${boxCircuit.id}`)
            // add neighbor to boxCircuit
            boxCircuit.boxes.push(shortestConnection.neighbor);
        }
        // if neighbor is on a circuit
        else if (!boxCircuit && neighborCircuit) {
            console.log(`Adding box ${shortestConnection.box.id} to circuit ${neighborCircuit.id}`)
            // add box to neighborCircuit
            neighborCircuit.boxes.push(shortestConnection.box);
        }
        // if both on same circuit
        else if (boxCircuit && neighborCircuit && boxCircuit.id === neighborCircuit.id) {
            // do nothing
        }
        else if (boxCircuit && neighborCircuit && boxCircuit.id != neighborCircuit.id){
             // merge circuits
            const mergeId = randomId();
            console.log(`Merging circuits ${boxCircuit?.id} and ${neighborCircuit?.id} into ${mergeId}`);
            //@ts-ignore
            const allBoxes = [...boxCircuit?.boxes, ...neighborCircuit?.boxes]
            // const mergedBoxes = [...new Set(allBoxes)]
            // console.log(`Merged `)
            circuits = circuits
                .filter(c => !(c.id === boxCircuit.id || c.id === neighborCircuit.id));
            circuits.push({
                id: mergeId,
                boxes: allBoxes
            })
        } 
        else {
           
        }
        //@ts-ignore
        return recursivelyConnectBoxes(boxes, circuits, --connections)

    }

}

export default {
    part1
}