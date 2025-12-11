import path from "path";

const getData = (part: number, input?: string): string =>
  part === 1
    ? input ||
      `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`
    : input ||
      `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

const getDevices = (data: string): Device[] => {
  //@ts-ignore
  const devices: Device[] = data.split("\n").map((line) => ({
    name: line.split(": ")[0],
    downstream: line.split(": ")[1]!.split(" "),
    upstream: [],
  }));
  devices.push({ name: "out", downstream: [], upstream: [] });
  devices.forEach((device) => {
    device.upstream = devices
      .filter((d) => d.downstream.includes(device.name))
      .map((d) => d.name);
    logDevice(device);
  });
  return devices;
};
type Device = {
  name: string;
  downstream: string[];
  upstream: string[];
};

const logDevice = (device: Device): void => {
  console.log(
    `${device.name}: downstream -> [${device.downstream.join(
      ", "
    )}], upstream -> [${device.upstream.join(", ")}]`
  );
};
const logPath = (path: Device[]): void => {
  console.log(`Path: ${path.map((d) => d.name).join(" -> ")}`);
};

const part1 = (input?: string): number => {
  const data = getData(1, input);
  //@ts-ignore
  const devices: Device[] = getDevices(data);
  const path: Device[] = [devices.find((d) => d.name === "you")!];
  const validPaths: Device[][] = recursivelyExplorePaths(path, devices, "out", []);
  return validPaths.length;
};
/**
 * There are MANY more paths from svr to out than in part 1.
 * Can we filter the paths/devices somehow before exploring? Like starting with
 * only the roots that we know reach fft and dac?
 * this is a good idea, but not optimized enough.
 * Next thought: get all devices that are upstream of FFT, then when traversing 
 * from SVR, any time you reach a device that is not upstream of FFT, stop exploring that path.
 *        /\
 *       /  \
 * SVR <     > FFT
 *      \   /
 *       \ /
 * @param input 
 * @returns 
 */
const part2 = (input?: string): number => {
  const data = getData(2, input);
  //@ts-ignore
  const devices: Device[] = getDevices(data);
  const path: Device[] = [devices.find((d) => d.name === "svr")!];
  // console.log("Exploring paths from svr to fft...")
  // const pathsSvrToFft: Device[][] = recursivelyExplorePaths(path, devices, "fft", []);
  // console.log(`DONE. Found ${pathsSvrToFft.length} paths from svr to fft.`)
  // const pathsSvrToDac: Device[][] = recursivelyExplorePaths(path, devices, "dac", []);
  console.log(`Exploring paths from fft to dac...`)
  const pathsFftToDac: Device[][] = recursivelyExplorePaths([devices.find(d => d.name === "fft")!], devices, "dac", []);
  console.log(`...DONE. Found ${pathsFftToDac.length} paths`)
  const pathsDacToFft: Device[][] = recursivelyExplorePaths([devices.find(d => d.name === "dac")!], devices, "fft", []);
  // const pathsFftToOut: Device[][] = recursivelyExplorePaths([devices.find(d => d.name === "fft")!], devices, "out", []);
  // const pathsDacToOut: Device[][] = recursivelyExplorePaths([devices.find(d => d.name === "dac")!], devices, "out", []);
  // svr -> fft -> dac -> out 
  // const svrFftDacOut = pathsSvrToFft.length * pathsFftToDac.length * pathsDacToOut.length
  // // svr -> dac -> fft -> out
  // const svrDacFftOut = pathsSvrToDac.length * pathsDacToFft.length * pathsFftToOut.length

    // return svrFftDacOut + svrDacFftOut;
//   const filteredPaths = validPaths.filter(
//     (p) => p.filter((d) => d.name === "fft" || d.name === "dac").length === 2
//   );
//   for (const fp of pathsToFft) {
//     logPath(fp);
//   }
//   return pathsToFft.length;
    return 0;
};

const recursivelyExplorePaths = (
  currentPath: Device[],
  devices: Device[],
  target: string,
  validPaths: Device[][]
): Device[][] => {
  const currentDevice = currentPath[currentPath.length - 1];
  const nextDevices = devices.filter((d) =>
    currentDevice!.downstream.includes(d.name)
  );
  for (const nextDevice of nextDevices) {
    const newPath = [...currentPath, nextDevice];
    // logPath(newPath);
    if (nextDevice.name === target) {
      validPaths.push(newPath);
        console.log(
          `Found valid path: ${newPath.map((d) => d.name).join(" -> ")}`
        );
    } else {
      recursivelyExplorePaths(newPath, devices, target, validPaths);
    }
  }
  return validPaths;
};

export default {
  part1,
  part2,
};
