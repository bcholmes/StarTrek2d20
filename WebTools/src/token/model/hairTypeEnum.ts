
export enum HairType {
    Bald, BowlCutHair, StylishHair, TousledSidePart, SidePart, ShortAfro, VeryShortAfro, PulledBackPonyTail,
    Balding, Receding, DeLeve, LongHair1, MediumLengthFemaleSidePart, MediumMaleCenterPart,
    MediumLengthFemaleStraight, ChinLengthCombBack, ChinLengthBob, ShortTeasedOverEyeStyle, FeminineDreadStyle, ShoulderLengthMostlyStraight,
    ShoulderLengthBob, CornRows, HighForeheadEfrosianStyle, PinnedUpHairWithPart, ShavedSides,
    KlingonHair1, KlingonHair2, KlingonHair3, RomulanPeakedHair, Mature, CentrePart,
    StraightCombedBackShort, StraightCombedBackMedium, UpsweptWithProduct,
}

export const allHairTypes = (): HairType[] => {
    return Object.keys(HairType).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}

export const isTallForeheadHair = (hairType: HairType) => {
    return hairType === HairType.Bald || hairType === HairType.Balding || hairType === HairType.Mature ||
        hairType === HairType.Receding ||
        hairType === HairType.KlingonHair1 || hairType === HairType.KlingonHair2 || hairType === HairType.KlingonHair3 ||
        hairType === HairType.StraightCombedBackShort ||
        hairType === HairType.StraightCombedBackMedium ||
        HairType[hairType].indexOf("HighForehead") === 0;
}