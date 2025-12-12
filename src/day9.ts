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
  const filtered = rectangles.filter(r => validateRectangle(r, rectangles, points)).sort((a, b) => b.area - a.area);
  const largest = filtered[0];
  console.log(`Total rectangles: ${rectangles.length}`);
  console.log(
    `Largest rectangle points: ${largest!.points
      .map((p) => `(${p.x},${p.y})`)
      .join("-")}`
  );
  console.log(`Largest rectangle area: ${largest!.area}, ID: ${largest?.id}`);
  console.log(validateRectangle(largest!, rectangles, points))
  return largest!.area;
};

const validateRectangle = (rect: Rectange, rectanges: Rectange[], allPoints: TPoint[]): boolean => {
  /**
   * A rectangle with points (x1, y1), (x2, y2) 
   * [and shadow points (x1, y2), (x2, y1)] is valid if there exists a point in
   * each of the following regions:
   * 1. (0,0):(x1, y1) -> Above and left
   * 2. (x2, y2): (Infinity, Infinity) -> below and right 
   * 3. (0, y2): (x1, Infinity) -> brelow and left
   * 4. (x2, 0): (Infinty, y1) -> above and right
   */
  let a, b, c, d;
  // are the points in rect AD or CB?
  const [p1, p2] = rect.points;
  if (p1!.x < p2!.x) {
    // p1 is left of p2
    if (p1!.y < p2!.y) {
      // p1 is above p2
      a = p1;
      d = p2;
      b = { x: d!.x, y: a!.y } as TPoint
      c = { x: a!.x, y: d!.y } as TPoint
    } else if (p1!.y > p2!.y) {
      // p1 is below p2
      c = p1;
      b = p2;
      a = { x: c?.x, y: b?.y } as TPoint
      d = { x: b?.x, y: c?.y } as TPoint
    } else {
      // there's the same y value
      a = c = p1;
      b = d = p2;
    }
  } else if (p1!.x > p2!.x) {
    // p1 is right of p2
    if (p1!.y < p2!.y) {
      // p1 is above p2
      b = p1;
      c = p2;
      a = { x: c?.x, y: b?.y } as TPoint
      d = { x: b?.x, y: c?.y } as TPoint
    } else if (p1!.y > p2!.y) {
      // p1 is below p2
      d = p1;
      a = p2;
      b = { x: d!.x, y: a!.y } as TPoint
      c = { x: a!.x, y: d!.y } as TPoint
    } else {
      // there's the same y value
      a = c = p1;
      b = d = p2;
    }
  }
  console.log(`This rectange has points
    A: (${a?.x}, ${a?.y})
    B: (${b?.x}, ${b?.y})
    C: (${c?.x}, ${c?.y})
    D: (${d?.x}, ${d?.y})`)
  // assign rectangle's points to a, b, c, d such that:
  /**
   * (1) |       | (4)
   *  ---A-------B---
   *     |       |
   *  ---C-------D---
   * (3) |       | (2)
   */
  // filter points to see if one exists in each range 1,2,3,4
    /**
     * @todo new!
     */
  // the points in (1,4) and (2,3) need to have matching y values
  // the points in (1,3) and (2,4) need to have matching x values
  const origin : TPoint = {
    x: 0, y: 0
  }
  const inf : TPoint = {
    x: Infinity, y: Infinity 
  }
  const pointInRange1 = findPointInBounds(origin, a!, allPoints);
  const pointInRange2 = findPointInBounds(d!, inf, allPoints);
  const pointInRange3 = findPointInBounds({x: 0, y: c!.y}, {x: c!.x, y: Infinity}, allPoints);
  const pointInRange4 = findPointInBounds({x: b!.x, y: 0}, {x: Infinity, y: b!.y}, allPoints);
  console.log({pointInRange1, pointInRange2, pointInRange3, pointInRange4})
  return pointInRange1 && pointInRange2 && pointInRange3 && pointInRange4;
}

const findPointInBounds = (topLeft: TPoint, bottomRight: TPoint, allPoints: TPoint[]): boolean => {
  const minX = topLeft.x,
    maxX = bottomRight.x,
    minY = topLeft.y,
    maxY = bottomRight.y;

  return allPoints.some(p => {
    return minX <= p.x && p.x <= maxX &&
      minY <= p.y && p.y <= maxY
  })
}

export default {
  part1,
  part2,
};

// 4776100539 first answer
// 4647960552 too high