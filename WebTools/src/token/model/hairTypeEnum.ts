
export enum HairType {
    Bald, BowlCutHair, StylishHair, SidePart, ShortAfro, VeryShortAfro, PulledBackPonyTail,
    Balding, Receding, DeLeve, LongHair1, MediumLengthFemaleSidePart, MediumMaleCenterPart,
    MediumLengthFemaleStraight, ChinLengthCombBack, ShortTeasedOverEyeStyle, FeminineDreadStyle, ShoulderLengthMostlyStraight,
    ShoulderLengthBob, CornRows, HighForeheadEfrosianStyle, PinnedUpHairWithPart, ShavedSides
}

export const allHairTypes = [ HairType.Bald, HairType.BowlCutHair, HairType.StylishHair, HairType.SidePart, HairType.ShortAfro,
    HairType.VeryShortAfro, HairType.PulledBackPonyTail, HairType.CornRows, HairType.Balding, HairType.Receding,
    HairType.DeLeve, HairType.LongHair1, HairType.MediumLengthFemaleSidePart,
    HairType.MediumMaleCenterPart, HairType.MediumLengthFemaleStraight,
    HairType.ChinLengthCombBack, HairType.ShortTeasedOverEyeStyle,
    HairType.FeminineDreadStyle, HairType.ShoulderLengthMostlyStraight, HairType.ShoulderLengthBob,
    HairType.HighForeheadEfrosianStyle, HairType.PinnedUpHairWithPart, HairType.ShavedSides ];


export const isTallForeheadHair = (hairType: HairType) => {
    return hairType === HairType.Bald || hairType === HairType.Balding ||
        HairType[hairType].indexOf("HighForehead") === 0;
}