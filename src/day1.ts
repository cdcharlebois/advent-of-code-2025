export const day1 = async () => {
    // const input = `R1000`;
    const input = 
`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`
//   const input = await fs.readFile("./day1/input.txt", "utf-8");
  const processSpin = (val: number, spin: string): [number, number] => {
    let newVal = val;
    let rawNewVal = 0;
    let clicks = 0;
    const amount = parseInt(spin.slice(1));
    const dir = spin.charAt(0) === "R" ? "right" : "left";

    if (dir === "right") {
      // right spin, add
      newVal += amount;
    } else {
      // left spin, subtract
      newVal -= amount; 
    }
    rawNewVal = newVal
    // check bounds
    if (newVal < 0 || newVal > 99) {
      [newVal, clicks] = clamp(newVal, val)
    }
    // console.log(`Spinning ${amount} to the ${dir} to point at ${newVal}${pointsStr}`);
    console.log(`Rotating ${spin} from ${val} to ${rawNewVal} (${newVal}) with ${clicks} clicks along the way`)
    return [newVal, clicks];
  };
  /**
   * Clamp to value in [0, 99]
   */
  const clamp = (number: number, from: number) : [number, number] => {
    let numberLineHundreds = 0
    if (from < number) {
        for (let i = from+1; i < number; i ++){
        if (i % 100 ===0) numberLineHundreds++;
    }
    } else {
         for (let i = number+1; i < from; i ++){
        if (i % 100 ===0) numberLineHundreds++;
    }
    }
    
    let newNumber = number
    let countClamps = 0;
    while (newNumber < 0){
        newNumber += 100
        if (newNumber != 0){
            countClamps++;
        }
    }
    while (newNumber > 99){
        newNumber -= 100
        if (newNumber != 0){
            countClamps++;
        }
        
    }
    // console.log(`[Clamping ${number} to ${newNumber}, ${countClamps} clamps]`)
    return [newNumber, numberLineHundreds]
  }
  const lines = input.split("\n");
//   console.log(lines);
  let val = 50;
  let zeroes = 0;
  let clicks = 0;
  for (const l of lines) {
    let newClicks = 0;
    [val, newClicks] = processSpin(val, l);
    // console.log({val, newClicks})
    if (val === 0) zeroes++;
    clicks += newClicks;
  }
  console.log(`---
    there are ${zeroes} zeroes and ${clicks} clicks, for a total of ${zeroes + clicks}`);
};