class Box {
  x: number;
  y: number;
  z: number;
  id: number;
  closest: Box | null = null;
  constructor(x: number, y: number, z: number, id: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
  }

  setCloset(box: Box) {
    this.closest = box;
  }

  getClosestBoxUnconnectedBox(boxes: Box[], circuits: Circuit[]): Box {
    // get the current Box's circuit
    const currentCircuit = circuits.find(circuit => circuit.containsBox(this.id));
    const unconnectedBoxes = boxes.filter(b => {
        // filter out boxes in the same circuit
        return !currentCircuit!.boxes.find(existing => existing.id === b.id);
    });
    return getClosest(this, unconnectedBoxes);
  }

  toString() {
    return `Box ${this.id} (${this.x}, ${this.y}, ${this.z})`;
  }
}

class Circuit {
    id: number;
    boxes: Box[];
    constructor(boxes: Box[]) {
        this.boxes = boxes;
        this.id = Math.floor(Math.random() * 1000000);
    }

    addBox(box: Box) {
        this.boxes.push(box);
    }
    containsBox (id: number): boolean {
        return this.boxes.some(b => b.id === id);
    }
    getBoxes(){
        return this.boxes;
    }
}

const distance = (a: Box, b: Box): number => {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  );
};

const getClosest = (box: Box, boxes: Box[]): Box => {
    let closest : {distance: number, box: Box | null} = {
        distance: Infinity,
        box: null
    };
    for (const other of boxes.filter(b => b.id != box.id)) {
        const d = distance(box, other)
        if (d < closest.distance) {
            closest.distance = d,
            closest.box = other;
        } else if (d === closest.distance){
            console.log(`🚨🚨🚨 TWO BOXES ARE THE SAME DISTANCE FROM BOX ${box.id} 🚨🚨🚨`)
            console.log(`${closest.box!.toString()} and ${other.toString()}`)
        }
    }
    return closest.box!;
};

const part1 = (input?: string): number => {
  const data =
    input ||
    `162,817,812
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
425,690,689`;
    const lines = data.split("\n");
    const boxes: Box[] = lines.map((line, index) => {
      const [x, y, z] = line.split(",").map(n => parseInt(n));
      // @ts-ignore
      return new Box(x, y, z, index);
    });

    for (const box of boxes) {
      const closest = getClosest(box, boxes);
      box.setCloset(closest);
      console.log(`${box.toString()} --> ${closest.toString()} (Distance: ${distance(box, closest)})`);
    }
    const sortedBoxes = boxes.sort((a, b) => {
        return distance(a, a.closest!) - distance(b, b.closest!);
    });
    const pairs = sortedBoxes.map(b => [b.id, b.closest!.id].sort())
    const dedupedPairs : number[][] = []
    for (const pair of pairs) {
        if (!dedupedPairs.find(p => p[0] === pair[0] && p[1] === pair[1])) {
            dedupedPairs.push(pair);
        }
    }
    dedupedPairs.forEach(p => {
        const boxA = boxes.find(b => b.id === p[0])!;
        const boxB = boxes.find(b => b.id === p[1])!;
        console.log(`${boxA.id} - ${boxB.id}: distance: ${distance(boxA, boxB)}`)
    })
    // ASSEMBLE CIRCUITS
    let circuits: Circuit[] = [];
    for (const pair of dedupedPairs.slice(0, 10)) {
        const boxA = boxes.find(b => b.id === pair[0])!;
        const boxB = boxes.find(b => b.id === pair[1])!;
        console.log(`Connecting ${boxA.toString()} and ${boxB.toString()}`);
        // connect the boxes
        const boxACircuit = circuits.find(circuit => circuit.containsBox(pair[0]!));
        const boxBCircuit = circuits.find(circuit => circuit.containsBox(pair[1]!));
        // if neither box is in a circuit, create a new circuit
        if (!(boxACircuit || boxBCircuit)) {
            const c = new Circuit([boxA, boxB]);
            circuits.push(c);

        }
        // if one box is in a circuit, add the other box to that circuit
        else if (boxACircuit && !boxBCircuit) {
            boxACircuit.addBox(boxB);

        } else if (!boxACircuit && boxBCircuit) {
            boxBCircuit.addBox(boxA);

        }
        // if both boxes are in the same cricuit, do nothing
        else if (boxACircuit!.id === boxBCircuit!.id) {

        }
        // if both boxes are in different circuits, merge the circuits
        else {
            const mergedBoxes = [...boxACircuit!.getBoxes(), ...boxBCircuit!.getBoxes()];
            const newCircuit = new Circuit(mergedBoxes);
            // remove the old circuits
            circuits = circuits.filter(c => c.id !== boxACircuit!.id && c.id !== boxBCircuit!.id);
            // add the new Cricuit
            circuits.push(newCircuit)
        }
        circuits.sort((a,b) => b.boxes.length - a.boxes.length).forEach(c => {
            console.log(`Circuit ${c.id}: [Length: ${c.boxes.length}] ${c.getBoxes().map(b => b.id).join("-")}\n`);
        })
    }
    const boxesRemaining = boxes.length - circuits.reduce((sum, c) => sum + c.boxes.length, 0);
    console.log(`Boxes remaining unconnected: ${boxesRemaining}`);
    console.log(`Total Circuits: ${circuits.length}`);

    return circuits.slice(0,3).reduce((prev, curr) => prev * curr.boxes.length, 1)
    // circuits.sort((a,b) => b.boxes.length - a.boxes.length).forEach(c => {
    //     console.log(`Circuit ${c.id}: [Length: ${c.boxes.length}] ${c.getBoxes().map(b => b.toString()).join("; ")}`);
    // })
    // console.log({circuits});

    // sample
    // 0, 19 ==> 0-19
    // 0, 7 ==> 0-19-7
    // 2, 13 ==> (0-19-7), (2-13)
    // 7, 19 ==> (0-19-7), (2-13)
    // 

};

export default {
  part1,
};


/**
0.  162,817,812
1.  57,618,57
2.  906,360,560
3.  592,479,940
4.  352,342,300
5.  466,668,158
6.  542,29,236
7.  431,825,988
8.  739,650,466
9.  52,470,668
10. 216,146,977
11. 819,987,18
12. 117,168,530
13. 805,96,715
14. 346,949,466
15. 970,615,88
16. 941,993,340
17. 862,61,35
18. 984,92,344
19. 425,690,689

0 - 19: distance: 316.90219311326956
0 - 7: distance: 321.560258738545
13 - 2: distance: 322.36935338211043
17 - 18: distance: 333.6555109690233
12 - 9: distance: 338.33858780813046
11 - 16: distance: 344.3893145845266
2 - 8: distance: 347.59890678769403
14 - 19: distance: 350.786259708102
19 - 3: distance: 367.9823365326113
4 - 6: distance: 371.70552861102294
4 - 5: distance: 373.41130138226936
11 - 15: distance: 407.53527454687895
1 - 5: distance: 424.24285497813634
10 - 12: distance: 458.360120429341
there should be 11 circuits: (5,4,2,2,1,1,1,1,1,1,1)

1. 0-19     ==> new circuit [0-19] ✅
2. 0-7      ==> [0-7-19] ✅
3. 13-2     ==> [0,7,19], [13,2] ✅
4. 17-18    ==> [0,7,19], [13,2], [17-18]
5. 12-9     ==> [0-7-19], [13-2], [17-18], [12-9] 
6. 11-16    ==> [0-7-19], [13-2], [17-18], [12-9], [11-16]
7. 2-8      ==> [0-7-19], [13-2-8], [17-18], [12-9], [11-16]
8. 14-19    ==> [0-7-19-14], [13-2-8], [17-18], [12-9], [11-16]
9. 19-3     ==> [0-7-19-14-3], [13-2-8], [17-18], [12-9], [11-16]
10. 4-6     ==> [0-7-19-14-3], [13-2-8], [17-18], [12-9], [11-16], [4,6]
*/

/**
 * Kyle's
 * (5) Circuit { id: 2, connections: [Connection { source: 2, target: 13, distance: 322.36935338211043 }, Connection { source: 2, target: 8, distance: 347.59890678769403 }, Connection { source: 17, target: 18, distance: 333.6555109690233 }] }
(4) Circuit { id: 0, connections: [Connection { source: 0, target: 19, distance: 316.90219311326956 }, Connection { source: 0, target: 7, distance: 321.560258738545 }, Connection { source: 14, target: 19, distance: 350.786259708102 }] }
(2) Circuit { id: 6, connections: [Connection { source: 11, target: 16, distance: 344.3893145845266 }] }

[2, 13, 8, 17, 18]
[0, 19, 7, 14]
[11, 16]
 */