import { D20 } from "../../common/die";
import { TableRoll } from "../../common/tableRoll";
import { PlanetaryFeature } from "./planetaryFeature";

export enum StandardPlantaryFeature {
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

export const planetaryFeaturesOfInterest: TableRoll<StandardPlantaryFeature> = () => {
    switch (D20.roll()) {
        case 1:
        case 2:
            return StandardPlantaryFeature.DangerousAnimalOrPlantLife;
        case 3:
        case 4:
            return StandardPlantaryFeature.PeacefulPrimitiveInhabitants;
        case 5:
        case 6:
            return StandardPlantaryFeature.WarlikePrimitiveInhabitatnts;
        case 7:
            return StandardPlantaryFeature.PeacefulTechnologicalInhabitants;
        case 8:
        case 9:
            return StandardPlantaryFeature.WarlikeTechnologicalInhabitants;
        case 10:
        case 11:
            return StandardPlantaryFeature.TranscendentInhabitantsOfGreatPower;
        case 12:
        case 13:
            return StandardPlantaryFeature.AncientRuinsOrArtifacts;
        case 14:
        case 15:
            return StandardPlantaryFeature.OffWorldVisitors;
        case 16:
        case 17:
            return StandardPlantaryFeature.CrashedSpacecraft;
        case 18:
            return StandardPlantaryFeature.LocalConditionsThatLimitOrProhibitTransporters;
        case 19:
        case 20:
        default:
            return StandardPlantaryFeature.DangerousNaturalPhenomena;
    }
}

export enum ColonyFeature {
    MiningColony,
    HuntingAndTrackingLodge,
    MaroonedSurviverColony,
    ResearchStation,
    MilitaryBase,
    EarlySpaceExplorationStation,
    TerraformingBase,
    CommercialBase,
    PirateBase,
    CommunicationsStation
}

export class ColonyFeatureModel implements PlanetaryFeature {

    readonly name: string;
    readonly id: ColonyFeature;

    constructor(id: ColonyFeature, name: string) {
        this.id = id;
        this.name = name;
    }

    get localizedDescription() {
        return this.name;
    }
}

class ColonyFeatureRegistry {
    private static _instance: ColonyFeatureRegistry;

    private items: ColonyFeatureModel[] = [
        new ColonyFeatureModel(ColonyFeature.MiningColony, "An industrial mining colony"),
        new ColonyFeatureModel(ColonyFeature.HuntingAndTrackingLodge, "A small lodge for hunting and tracking"),
        new ColonyFeatureModel(ColonyFeature.MaroonedSurviverColony, "An adhoc colony formed by survivers of a crashed ship"),
        new ColonyFeatureModel(ColonyFeature.ResearchStation, "A scientific research station"),
        new ColonyFeatureModel(ColonyFeature.MilitaryBase, "A Military base, barracks, or outpost"),
        new ColonyFeatureModel(ColonyFeature.EarlySpaceExplorationStation, "A habitat from a world's early space exploration program"),
        new ColonyFeatureModel(ColonyFeature.TerraformingBase, "Terraforming base"),
        new ColonyFeatureModel(ColonyFeature.CommercialBase, "A commercial base (e.g.: a deep space store or shopping mall)"),
        new ColonyFeatureModel(ColonyFeature.PirateBase, "A secret pirate base"),
        new ColonyFeatureModel(ColonyFeature.CommunicationsStation, "A communications station (a subspace repeater station or possibly a listening post)"),
    ]


    static get instance() {
        if (ColonyFeatureRegistry._instance == null) {
            ColonyFeatureRegistry._instance = new ColonyFeatureRegistry();
        }
        return ColonyFeatureRegistry._instance;
    }

    getByType(type: ColonyFeature) {
        return this.items.filter(i => i.id === type)[0];
    }
}

export const isolatedColonyFeaturesOfInterest: TableRoll<PlanetaryFeature> = () => {
    switch(D20.roll()) {
        case 1:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.HuntingAndTrackingLodge);
        case 2:
        case 3:
        case 4:
        case 5:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.MiningColony);
        case 6:
        case 7:
        case 8:
        case 9:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.MilitaryBase);
        case 10:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.MaroonedSurviverColony);
        case 11:
        case 12:
        case 13:
        case 14:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.ResearchStation);
        case 15:
        case 16:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.TerraformingBase);
        case 17:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.CommunicationsStation);
        case 18:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.PirateBase);
        case 19:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.CommercialBase);
        case 20:
        default:
            return ColonyFeatureRegistry.instance.getByType(ColonyFeature.EarlySpaceExplorationStation);
    }
}