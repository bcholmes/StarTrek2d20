import { D20 } from "../../common/die";
import { TableRoll } from "../../common/table";

export enum BasicPlantaryFeature {
    DangerousAnimalOrPlantLife,
    PeacefulPrimitiveInhabitants,
    WarlikePrimitiveInhabitatnts,
    PeacefulTechnologicalInhabitants,
    WarlikeTechnologicalInhabitants,
    TranscendentInhabitantsOfGreatPower,
    AncientRuinsOrArtifacts,
    OffWorldVisitors,
    CrashedSpacecraft,
    LocalConditionsThatLimitOrProhibitTransporters,
    DangerousNaturalPhenomena
}

export const planetaryFeaturesOfInterest: TableRoll<BasicPlantaryFeature> = () => {
    switch (D20.roll()) {
        case 1:
        case 2:
            return BasicPlantaryFeature.DangerousAnimalOrPlantLife;
        case 3:
        case 4:
            return BasicPlantaryFeature.PeacefulPrimitiveInhabitants;
        case 5:
        case 6:
            return BasicPlantaryFeature.WarlikePrimitiveInhabitatnts;
        case 7:
            return BasicPlantaryFeature.PeacefulTechnologicalInhabitants;
        case 8:
        case 9:
            return BasicPlantaryFeature.WarlikeTechnologicalInhabitants;
        case 10:
        case 11:
            return BasicPlantaryFeature.TranscendentInhabitantsOfGreatPower;
        case 12:
        case 13:
            return BasicPlantaryFeature.AncientRuinsOrArtifacts;
        case 14:
        case 15:
            return BasicPlantaryFeature.OffWorldVisitors;
        case 16:
        case 17:
            return BasicPlantaryFeature.CrashedSpacecraft;
        case 18:
            return BasicPlantaryFeature.LocalConditionsThatLimitOrProhibitTransporters;
        case 19:
        case 20:
        default:
            return BasicPlantaryFeature.DangerousNaturalPhenomena;
    }
}