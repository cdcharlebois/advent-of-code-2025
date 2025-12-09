type TPoint = {
    x: number;
    y: number;
}
class Rectange {
    area: number;
    points: TPoint[];
    constructor(points: TPoint[]) {
        this.points = points;
        this.area = (Math.abs(points[0]!.x - points[1]!.x)+1) * (Math.abs(points[0]!.y - points[1]!.y)+1);
    }
}

const part1 = (input?: string): number => {
    const data = input || `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
    //@ts-ignore
    const points: TPoint[] = data.split("\n").map(line => {
        const [x, y] = line.split(",").map(Number);
        return {x, y};
    });
    const rectangles: Rectange[] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i]!;
            const p2 = points[j]!;
            if (p1.x !== p2.x && p1.y !== p2.y) {
                rectangles.push(new Rectange([p1, p2]));
            }
        }
    }
    rectangles.sort((a,b) => b.area - a.area);
    const largest = rectangles[0];
    console.log(`Total rectangles: ${rectangles.length}`);
    console.log(`Largest rectangle points: ${largest!.points.map(p => `(${p.x},${p.y})`).join(" - ")}`);
    console.log(`Largest rectangle area: ${largest!.area}`);  
    return largest!.area;
}


export default {
    part1
}