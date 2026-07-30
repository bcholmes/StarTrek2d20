import i18next from "i18next";
import { Species } from "./speciesEnum";
import { makeKey } from "../common/translationKey";
import { Source } from "./sources";
import { ITalent } from "./italent";

export enum SpeciesAbilityChoice {
    Choice1,
    Choice2
}

export class SpeciesAbility {
    readonly species: Species;
    readonly source?: Source;
    readonly talentNames: string[];
    readonly choices: SpeciesAbilityChoice[];

    constructor(species: Species, source: Source = Source.Core2ndEdition, talentNames: string[] = [], choices: SpeciesAbilityChoice[] = []) {
        this.species = species;
        this.source = source;
        this.talentNames = talentNames;
        this.choices = choices;
    }

    get name() {
        let key = makeKey("SpeciesAbility.", Species[this.species]);
        return i18next.t(key);
    }

    get description() {
        let key = makeKey("SpeciesAbility.", Species[this.species], ".description");
        return i18next.t(key);
    }

    get isTalentSelectionSupported() {
        return this.talentNames?.length;
    }

    get isChoiceRequired() {
        return this.choices.length > 1;
    }

    isValidTalentSelection(talent: ITalent) {
        if (talent == null) {
            return true;
        } else {
            return this.isTalentSelectionSupported ? this.talentNames.includes(talent.name) : false;
        }
    }

    public getChoiceName(choice: SpeciesAbilityChoice) {
        let key = makeKey("SpeciesAbility.", Species[this.species], ".", SpeciesAbilityChoice[choice]);
        return i18next.t(key);
    }

    public getChoiceDescription(choice: SpeciesAbilityChoice) {
        let key = makeKey("SpeciesAbility.", Species[this.species], ".", SpeciesAbilityChoice[choice], ".description");
        return i18next.t(key);
    }
}

export class SpeciesAbilityList {

    private static _instance: SpeciesAbilityList;

    private items: { [id: number] : SpeciesAbility} = {
        [Species.Aenar]: new SpeciesAbility(Species.Aenar),
        [Species.Argrathi]: new SpeciesAbility(Species.Argrathi, Source.GammaQuadrant),
        [Species.Andorian]: new SpeciesAbility(Species.Andorian),
        [Species.Android]: new SpeciesAbility(Species.Android, Source.SpeciesSourcebook),
        [Species.Ankari]: new SpeciesAbility(Species.Ankari, Source.DeltaQuadrant),
        [Species.Arbazan]: new SpeciesAbility(Species.Arbazan, Source.AlphaQuadrant),
        [Species.Arkarian]: new SpeciesAbility(Species.Arkarian, Source.AlphaQuadrant),
        [Species.Ardanan]: new SpeciesAbility(Species.Ardanan, Source.BetaQuadrant),
        [Species.Aurelian]: new SpeciesAbility(Species.Aurelian, Source.SpeciesSourcebook),
        [Species.Bajoran]: new SpeciesAbility(Species.Bajoran),
        [Species.Barzan]: new SpeciesAbility(Species.Barzan, Source.SpeciesSourcebook),
        [Species.Benzite]: new SpeciesAbility(Species.Benzite, Source.SpeciesSourcebook),
        [Species.Betazoid]: new SpeciesAbility(Species.Betazoid, Source.Core2ndEdition, ["Telepathy2e", "Empathy2e"]),
        [Species.Betelgeusian]: new SpeciesAbility(Species.Betelgeusian, Source.SpeciesSourcebook),
        [Species.BlueOrion]: new SpeciesAbility(Species.BlueOrion, Source.SpeciesSourcebook),
        [Species.Bolian]: new SpeciesAbility(Species.Bolian, Source.SpeciesSourcebook),
        [Species.Breen]: new SpeciesAbility(Species.Breen, Source.SpeciesSourcebook),
        [Species.Brikar]: new SpeciesAbility(Species.Brikar, Source.SpeciesSourcebook),
        [Species.Bynar]: new SpeciesAbility(Species.Bynar, Source.SpeciesSourcebook),
        [Species.Caitian]: new SpeciesAbility(Species.Caitian, Source.SpeciesSourcebook),
        [Species.Cetacean]: new SpeciesAbility(Species.Cetacean, Source.SpeciesSourcebook),
        [Species.Chameloid]: new SpeciesAbility(Species.Chameloid, Source.SpeciesSourcebook),
        [Species.ChangelingGamma]: new SpeciesAbility(Species.ChangelingGamma, Source.SpeciesSourcebook),
        [Species.Chelon]: new SpeciesAbility(Species.Chelon, Source.SpeciesSourcebook),
        [Species.Cardassian]: new SpeciesAbility(Species.Cardassian),
        [Species.Deltan]: new SpeciesAbility(Species.Deltan, Source.SpeciesSourcebook),
        [Species.Denobulan]: new SpeciesAbility(Species.Denobulan),
        [Species.Dosi]: new SpeciesAbility(Species.Dosi, Source.GammaQuadrant),
        [Species.Drai]: new SpeciesAbility(Species.Drai, Source.GammaQuadrant),
        [Species.Edosian]: new SpeciesAbility(Species.Edosian, Source.SpeciesSourcebook,
            ["Multi-Tasking (Edosian)", "The Long View"]),
        [Species.Efrosian]: new SpeciesAbility(Species.Efrosian, Source.SpeciesSourcebook),
        [Species.ElAurian_2E]: new SpeciesAbility(Species.ElAurian_2E, Source.SpeciesSourcebook),
        [Species.Exocomp_2E]: new SpeciesAbility(Species.Exocomp_2E, Source.SpeciesSourcebook),
        [Species.Ferengi]: new SpeciesAbility(Species.Ferengi),
        [Species.Grazerite]: new SpeciesAbility(Species.Grazerite, Source.SpeciesSourcebook),
        [Species.Haliian]: new SpeciesAbility(Species.Haliian, Source.AlphaQuadrant),
        [Species.Hologram]: new SpeciesAbility(Species.Hologram, Source.SpeciesSourcebook),
        [Species.Horta_2E]: new SpeciesAbility(Species.Horta_2E, Source.SpeciesSourcebook),
        [Species.Human]: new SpeciesAbility(Species.Human),
        [Species.HumanAugment]: new SpeciesAbility(Species.HumanAugment, Source.SpeciesSourcebook),
        [Species.Illyrian_2E]: new SpeciesAbility(Species.Illyrian_2E, Source.SpeciesSourcebook),
        [Species.Jelna]: new SpeciesAbility(Species.Jelna, Source.SpeciesSourcebook, [],
            [SpeciesAbilityChoice.Choice1, SpeciesAbilityChoice.Choice2]),
        [Species.JemHadar]: new SpeciesAbility(Species.JemHadar, Source.SpeciesSourcebook),
        [Species.Jye]: new SpeciesAbility(Species.Jye, Source.DeltaQuadrant),
        [Species.Karemma]: new SpeciesAbility(Species.Karemma, Source.GammaQuadrant),
        [Species.Kellerun]: new SpeciesAbility(Species.Kellerun, Source.SpeciesSourcebook),
        [Species.Kelpien]: new SpeciesAbility(Species.Kelpien, Source.SpeciesSourcebook, [],
            [SpeciesAbilityChoice.Choice1, SpeciesAbilityChoice.Choice2]),
        [Species.Klingon]: new SpeciesAbility(Species.Klingon),
        [Species.KlingonQuchHa_2E]: new SpeciesAbility(Species.KlingonQuchHa_2E, Source.SpeciesSourcebook),
        [Species.Klowahkan]: new SpeciesAbility(Species.Klowahkan, Source.SpeciesSourcebook),
        [Species.Ktarian]: new SpeciesAbility(Species.Ktarian, Source.SpeciesSourcebook),
        [Species.Kwejian]: new SpeciesAbility(Species.Kwejian, Source.SpeciesSourcebook),
        [Species.Kzinti]: new SpeciesAbility(Species.Kzinti, Source.SpeciesSourcebook),
        [Species.Lanthanite]: new SpeciesAbility(Species.Lanthanite, Source.SpeciesSourcebook),
        [Species.LiberatedBorg]: new SpeciesAbility(Species.LiberatedBorg, Source.SpeciesSourcebook),
        [Species.Lokirrim]: new SpeciesAbility(Species.Lokirrim, Source.DeltaQuadrant),
        [Species.Lurian]: new SpeciesAbility(Species.Lurian, Source.SpeciesSourcebook),
        [Species.Mari]: new SpeciesAbility(Species.Mari, Source.DeltaQuadrant, ["Telepathy2e", "Empathy2e"]),
        [Species.Medusan]: new SpeciesAbility(Species.Medusan, Source.SpeciesSourcebook),
        [Species.Monean]: new SpeciesAbility(Species.Monean, Source.DeltaQuadrant),
        [Species.Nanokin]: new SpeciesAbility(Species.Nanokin, Source.SpeciesSourcebook),
        [Species.Nausicaan]: new SpeciesAbility(Species.Nausicaan, Source.SpeciesSourcebook),
        [Species.Napean]: new SpeciesAbility(Species.Napean, Source.ContinuingMissions),
        [Species.Ocampa]: new SpeciesAbility(Species.Ocampa, Source.SpeciesSourcebook),
        [Species.Orion]: new SpeciesAbility(Species.Orion),
        [Species.Osnullus]: new SpeciesAbility(Species.Osnullus, Source.SpeciesSourcebook),
        [Species.Pakled]: new SpeciesAbility(Species.Pakled, Source.SpeciesSourcebook),
        [Species.Paradan]: new SpeciesAbility(Species.Paradan, Source.GammaQuadrant),
        [Species.Pendari]: new SpeciesAbility(Species.Pendari, Source.DeltaQuadrant),
        [Species.Rakhari]: new SpeciesAbility(Species.Rakhari, Source.GammaQuadrant),
        [Species.Reman]: new SpeciesAbility(Species.Reman, Source.SpeciesSourcebook),
        [Species.Risian]: new SpeciesAbility(Species.Risian, Source.SpeciesSourcebook),
        [Species.Romulan]: new SpeciesAbility(Species.Romulan),
        [Species.Saurian]: new SpeciesAbility(Species.Saurian, Source.SpeciesSourcebook),
        [Species.Sikarian]: new SpeciesAbility(Species.Sikarian, Source.DeltaQuadrant),
        [Species.Skreeaa]: new SpeciesAbility(Species.Skreeaa, Source.GammaQuadrant),
        [Species.SonA]: new SpeciesAbility(Species.SonA, Source.SpeciesSourcebook),
        [Species.Talaxian]: new SpeciesAbility(Species.Talaxian, Source.SpeciesSourcebook),
        [Species.Tamarian]: new SpeciesAbility(Species.Tamarian, Source.SpeciesSourcebook),
        [Species.Tellarite]: new SpeciesAbility(Species.Tellarite),
        [Species.Terran]: new SpeciesAbility(Species.Terran, Source.SpeciesSourcebook),
        [Species.Tosk]: new SpeciesAbility(Species.Tosk, Source.GammaQuadrant),
        [Species.Trill]: new SpeciesAbility(Species.Trill),
        [Species.Turei]: new SpeciesAbility(Species.Turei, Source.DeltaQuadrant),
        [Species.Vulcan]: new SpeciesAbility(Species.Vulcan),
        [Species.VauNAkat]: new SpeciesAbility(Species.VauNAkat, Source.SpeciesSourcebook),
        [Species.Vorta]: new SpeciesAbility(Species.Vorta, Source.SpeciesSourcebook),
        [Species.Wadi]: new SpeciesAbility(Species.Wadi, Source.GammaQuadrant),
        [Species.Xahean]: new SpeciesAbility(Species.Xahean, Source.SpeciesSourcebook),
        [Species.XindiAquatic]: new SpeciesAbility(Species.XindiAquatic, Source.SpeciesSourcebook),
        [Species.XindiArboreal]: new SpeciesAbility(Species.XindiArboreal, Source.SpeciesSourcebook),
        [Species.XindiInsectoid]: new SpeciesAbility(Species.XindiInsectoid, Source.SpeciesSourcebook),
        [Species.XindiPrimate]: new SpeciesAbility(Species.XindiPrimate, Source.SpeciesSourcebook),
        [Species.XindiReptilian]: new SpeciesAbility(Species.XindiReptilian, Source.SpeciesSourcebook),
        [Species.Yridian_2E]: new SpeciesAbility(Species.Yridian_2E, Source.SpeciesSourcebook),
        [Species.Zakdorn]: new SpeciesAbility(Species.Zakdorn, Source.SpeciesSourcebook),
        [Species.Zahl]: new SpeciesAbility(Species.Zahl, Source.DeltaQuadrant),
        [Species.Zaranite]: new SpeciesAbility(Species.Zaranite, Source.AlphaQuadrant),
    }

    static get instance() {
        if (SpeciesAbilityList._instance == null) {
            SpeciesAbilityList._instance = new SpeciesAbilityList();
        }
        return SpeciesAbilityList._instance;
    }

    getBySpecies(species: Species) {
        return this.items[species];
    }
}