export enum System {
    Comms,
    Computer,
    Engines,
    Sensors,
    Structure,
    Weapons
}

export function allSystems() {
    return [ System.Comms, System.Computer, System.Engines, System.Sensors, System.Structure, System.Weapons ];
}

export function systemByName(name: string) {
    let result = allSystems().filter(s => System[s] === name);
    return result?.length ? result[0] : undefined;
}