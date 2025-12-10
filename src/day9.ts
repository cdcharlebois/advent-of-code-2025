type TPoint = {
  x: number;
  y: number;
};
class Rectange {
  area: number;
  points: TPoint[];
  allFourBounds: TPoint[];
  id: string;
  constructor(points: TPoint[], id: string) {
    this.points = points;
    this.id = id;
    const topLeft = points[0]!;
    const bottomRight = points[1]!;
    this.area =
      (Math.abs(topLeft.x - bottomRight.x) + 1) *
      (Math.abs(topLeft.y - bottomRight.y) + 1);

    const otherPoints = [
      {
        x: topLeft.x,
        y: bottomRight.y,
      },
      {
        x: bottomRight.x,
        y: topLeft.y,
      },
    ];
    this.allFourBounds = [...points, ...otherPoints];
  }
}

const part1 = (input?: string): number => {
  const data =
    input ||
    `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
  //@ts-ignore
  const points: TPoint[] = data.split("\n").map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });
  const rectangles: Rectange[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i]!;
      const p2 = points[j]!;
      if (p1.x !== p2.x && p1.y !== p2.y) {
        rectangles.push(new Rectange([p1, p2], `${i}-${j}`));
      }
    }
  }
  rectangles.sort((a, b) => b.area - a.area);
  const largest = rectangles[0];
  console.log(`Total rectangles: ${rectangles.length}`);
  console.log(
    `Largest rectangle points: ${largest!.allFourBounds
      .map((p) => `(${p.x},${p.y})`)
      .join(" - ")}`
  );
  console.log(`Largest rectangle area: ${largest!.area}`);
  return largest!.area;
};

const part2 = (input?: string): number => {
  const data =
    input ||
    `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
  //@ts-ignore
  const points: TPoint[] = data.split("\n").map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });
  const rectangles: Rectange[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i]!;
      const p2 = points[j]!;
      if (p1.x !== p2.x && p1.y !== p2.y) {
        rectangles.push(new Rectange([p1, p2], `${i}-${j}`));
      }
    }
  }
  rectangles.sort((a, b) => b.area - a.area);
  const largest = rectangles[0];
  console.log(`Total rectangles: ${rectangles.length}`);
  console.log(
    `Largest rectangle points: ${largest!.points
      .map((p) => `(${p.x},${p.y})`)
      .join("-")}`
  );
  console.log(`Largest rectangle area: ${largest!.area}, ID: ${largest?.id}`);
  return largest!.area;
};

const validateRectangle = (rect: Rectange, rectanges: Rectange[]): boolean => {
    // need to orient the rectangle
    const [firstPoint, secondPoint] = rect.points;
    let direction;
    //@ts-ignore
    if (firstPoint.x < secondPoint.x && firstPoint.y < secondPoint.y) {
        // first point is top-left, second is bottom-right
        direction = "se"
        //@ts-ignore
    } else  if (firstPoint.x < secondPoint.x && firstPoint.y > secondPoint.y) {
        direction = "ne"
        //@ts-ignore
    } else if (firstPoint.x > secondPoint.x && firstPoint.y < secondPoint.y) {
        direction = "sw"
        //@ts-ignore
    } else if (firstPoint.x > secondPoint.x && firstPoint.y > secondPoint.y) {
        direction = "nw"
    }
    switch (direction) {
        case "se":
            // on the min x column, need a point at max Y or greater
    }
    return true;
}

export default {
  part1,
  part2,
};
