export enum ExtraType {
  None,

  BajoranEarring,
  SimpleEarring,
  HoopEarring,

  SmallBindi,
  RisanSymbol,
  InuitTattoo,

  ZaraniteMask,
  Freckles,
  Visor,
  OrionPiece1,
  OrionPiece2,
  OrionPiece3,

  FerengiHeadFlap,
  SecurityHelmet,
  BynarHeadpiece1,
  BynarHeadpiece2,
  VulcanHeaddress,

  FerengiRankTattoo,

  BorgCheekImplant1,
  BorgJawImplant2,
  BorgEyebrowImplant3,
  BorgEyeImplant4,
  BorgEyeImplant5,
  BorgEyeImplant6,
}

export enum ExtraCategory {
  Ear,
  Forehead,
  Face,
  Headwear,
  BorgImplant,
}

export const allExtraTypes = (): ExtraType[] => {
  return Object.keys(ExtraType)
    .filter((item) => {
      return !isNaN(Number(item));
    })
    .map((item) => Number(item));
};

export const getExtraCategory = (extraType: ExtraType) => {
  switch (extraType) {
    case ExtraType.BajoranEarring:
    case ExtraType.SimpleEarring:
    case ExtraType.HoopEarring:
      return ExtraCategory.Ear;

    case ExtraType.FerengiHeadFlap:
    case ExtraType.SecurityHelmet:
    case ExtraType.BynarHeadpiece1:
    case ExtraType.BynarHeadpiece2:
    case ExtraType.VulcanHeaddress:
      return ExtraCategory.Headwear;

    case ExtraType.Visor:
    case ExtraType.Freckles:
    case ExtraType.ZaraniteMask:
    case ExtraType.OrionPiece1:
    case ExtraType.OrionPiece2:
    case ExtraType.OrionPiece3:
      return ExtraCategory.Face;

    case ExtraType.BorgCheekImplant1:
    case ExtraType.BorgJawImplant2:
    case ExtraType.BorgEyebrowImplant3:
    case ExtraType.BorgEyeImplant4:
    case ExtraType.BorgEyeImplant5:
    case ExtraType.BorgEyeImplant6:
      return ExtraCategory.BorgImplant;

    case ExtraType.SmallBindi:
    case ExtraType.RisanSymbol:
    case ExtraType.InuitTattoo:
    default:
      return ExtraCategory.Forehead;
  }
};
