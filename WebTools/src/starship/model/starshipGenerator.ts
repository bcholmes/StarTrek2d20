import { CharacterType } from "../../common/characterType";
import { D20 } from "../../common/die";
import { MissionProfileStep, ServiceRecordStep, Starship } from "../../common/starship";
import RegistryNumber from "../../components/registryNumberGenerator";
import { Era } from "../../helpers/eras";
import { MissionPodHelper } from "../../helpers/missionPods";
import { MissionProfileHelper } from "../../helpers/missionProfiles";
import { SpaceframeHelper } from "../../helpers/spaceframes";
import { allSystems } from "../../helpers/systems";
import { TalentsHelper } from "../../helpers/talents";
import { isSecondEdition } from "../../state/contextFunctions";
import { RandomStarshipCharacterType } from "./randomStarshipCharacterTypes";
import { ServiceRecordList } from "./serviceRecord";
import { StarshipRandomNameTable } from "./starshipNameTable";

export interface IStarshipConfiguration {
    era: Era;
    campaignYear: number;
    type: RandomStarshipCharacterType;
}

const convertStarshipType = (type: RandomStarshipCharacterType) => {
    switch (type) {
        case RandomStarshipCharacterType.Romulan:
            return CharacterType.Romulan;
        case RandomStarshipCharacterType.Klingon:
            return CharacterType.KlingonWarrior;
        case RandomStarshipCharacterType.Starfleet:
        default:
            return CharacterType.Starfleet;
    }
}

const determinePrefix = (starship: Starship) => {
    if (starship.type === CharacterType.Starfleet) {
        return "USS ";
    } else if (starship.type === CharacterType.KlingonWarrior) {
        return "IKS ";
    } else if (starship.type === CharacterType.Romulan) {
        return "IRW ";
    } else {
        return "";
    }
}

export const starshipGenerator = (config: IStarshipConfiguration) => {

    let result = Starship.createStandardStarship(config.era, convertStarshipType(config.type), isSecondEdition() ? 2 : 1);
    result.serviceYear = config.campaignYear;
    const frames = SpaceframeHelper.instance().getSpaceframes(result, false)
        .filter(s => !s.isCivilian && !s.isSmallCraft);

    if (frames?.length) {
        result.spaceframeModel = frames[Math.floor(Math.random() * frames.length)];
    }

    const missionProfiles = MissionProfileHelper.getMissionProfiles(result);

    if (missionProfiles?.length) {
        result.missionProfileStep = new MissionProfileStep(missionProfiles[Math.floor(Math.random() * missionProfiles.length)]);

        const missionProfileTalents = result.missionProfileStep?.type?.talents?.filter(
            t => result.spaceframeModel == null || result.spaceframeModel.talents.map(t => t.name).indexOf(t.name) < 0);
        if (missionProfileTalents?.length) {
            result.missionProfileStep.talent = missionProfileTalents[Math.floor(Math.random() * missionProfileTalents.length)];
        }
    }

    if (result.spaceframeModel?.isMissionPodAvailable) {
        let pods = MissionPodHelper.instance().getMissionPods(result);
        if (pods?.length) {
            result.missionPodModel = pods[Math.floor(Math.random() * pods.length)];
        }
    }

    for (let i = 0; i < result.numberOfRefits; i++) {
        let systems = allSystems().filter(s => result.getSystemValue(s) < 12);
        result.refits.push(systems[Math.floor(Math.random() * systems.length)]);
    }

    for (let i = 0; i < result.freeTalentSlots; i++) {
        const talents = TalentsHelper.getStarshipTalents(result);
        if (talents?.length) {
            let viewModel = talents[Math.floor(Math.random() * talents.length)];
            result.additionalTalents.push(viewModel);
        }
    }

    if (result.version > 1) {
        if (D20.roll() > 12) {

            const records = ServiceRecordList.instance.records;
            let record = records[Math.floor(Math.random() * records.length)];

            result.serviceRecordStep = new ServiceRecordStep(record);
            result.serviceRecordStep.specialRule = TalentsHelper.getTalent(record.specialRule);
        }
    }

    if (result.type === CharacterType.Starfleet) {
        result.registry = RegistryNumber.generate(result.serviceYear, result.type, result.spaceframeModel);
    }
    result.name = determinePrefix(result)
        + StarshipRandomNameTable(config.era, config.type);

    return result;
}