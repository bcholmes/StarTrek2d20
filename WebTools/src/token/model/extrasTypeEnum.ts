
export enum ExtraType {
    None,

    BajoranEarring, SimpleEarring, HoopEarring,

    SmallBindi, RisanSymbol, InuitTattoo,

    ZaraniteMask, Visor,

    FerengiHeadFlap
}

export enum ExtraCategory {
    Ear, Forehead, Face, Headwear
}

export const getExtraCategory = (extraType: ExtraType) => {

    switch (extraType) {
        case ExtraType.BajoranEarring:
        case ExtraType.SimpleEarring:
        case ExtraType.HoopEarring:
            return ExtraCategory.Ear;

        case ExtraType.FerengiHeadFlap:
            return ExtraCategory.Headwear;

        case ExtraType.Visor:
        case ExtraType.ZaraniteMask:
            return ExtraCategory.Face;

        case ExtraType.SmallBindi:
        case ExtraType.RisanSymbol:
        case ExtraType.InuitTattoo:
        default:
            return ExtraCategory.Forehead;
    }
}