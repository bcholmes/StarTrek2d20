
export enum NoseType {
    StraightBasic,
    Convex,
    SmallBulb,
    Broad,
    LongNarrow,
    HighBridge,
    Bulbous,
    SmallFlat,
    SmallUpTurned,
    Hawk,
    BroadFlat,
    Pointed
}

export const allNoseTypes = (): NoseType[] => {
    return Object.keys(NoseType).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}
