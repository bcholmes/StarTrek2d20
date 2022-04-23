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