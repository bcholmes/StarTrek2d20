import { Attribute } from './attributes';
import { TalentModel, TalentsHelper } from './talents';
import { AlliedMilitaryDetails, Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Era } from '../helpers/eras';
import { Source } from '../helpers/sources';
import { Species } from './speciesEnum';
import store from '../state/store';
import { hasAnySource, hasSource } from '../state/contextFunctions';
import { makeKey } from '../common/translationKey';
import i18next from 'i18next';

export interface NameModel {
    type: string;
    suggestions: string;
}

export const ANY_NAMES = [ { type: "any", suggestions: "anything"} as NameModel ]

export interface ISpecies {
    id: Species;
    name: string;
    nameSuggestions: NameModel[];
}

export class SpeciesModel implements ISpecies {
    id: Species;
    name: string;
    eras: Era[];
    sources: Source[];
    private description: string[];
    attributes: Attribute[];
    trait: string;
    private traitDescription: string;
    exampleValue: string;
    talents: TalentModel[];
    nameDescription: string;
    nameSuggestions: NameModel[];
    // at the moment, only Ktarians have secondary attributes
    secondaryAttributes: Attribute[];
    isMixedSpeciesAllowed: boolean;

    constructor(id: Species, name: string, eras: Era[], sources: Source[], description: string[], attributes: Attribute[], trait: string, traitDescription: string, exampleValue: string, talents: TalentModel[], nameDescription: string, nameSuggestions: NameModel[], secondaryAttributes: Attribute[] = [], isMixedSpeciesAllowed: boolean = true) {
        this.id = id;
        this.name = name;
        this.eras = eras;
        this.description = description;
        this.attributes = attributes;
        this.trait = trait;
        this.traitDescription = traitDescription;
        this.exampleValue = exampleValue;
        this.talents = talents;
        this.nameDescription = nameDescription;
        this.nameSuggestions = nameSuggestions;
        this.sources = sources;
        this.secondaryAttributes = secondaryAttributes;
        this.isMixedSpeciesAllowed = isMixedSpeciesAllowed;
    }

    private get speciesKeyName() {
        let result = Species[this.id];
        if (result.indexOf("Ext") === (result.length - 3)) {
            result = result.substring(0, result.length - 3);
        }
        return result;
    }

    get isAttributeSelectionRequired() {
        let definedAttributeCount = this.attributes.length - this.decrementAttributes.length;
        if (definedAttributeCount <= 3) {
            return false;
        } else {
            return true;
        }
    }

    get decrementAttributes() {
        if (this.id === Species.Napean) {
            return [Attribute.Presence, Attribute.Presence];
        } else {
            return [];
        }
    }

    get localizedName() {
        const key = makeKey('Species.', this.speciesKeyName, ".name");
        const localized = i18next.t(key);
        return key === localized ? this.name : localized;
    }

    get localizedTrait() {
        const key = makeKey('Species.', this.speciesKeyName, ".trait");
        const localized = i18next.t(key);
        return key === localized ? this.localizedName : localized;
    }

    get localizedDescription() {
        const key = makeKey('Species.', this.speciesKeyName, ".description");
        const localized = i18next.t(key);
        return key === localized ? this.description.join("\n\n") : localized;
    }

    get localizedDescription2e() {
        const key = makeKey('Species.', this.speciesKeyName, ".description2e");
        const localized = i18next.t(key);
        return key === localized ? this.localizedDescription : localized;
    }

    get localizedSoloDescription() {
        const key = makeKey('Species.', this.speciesKeyName, ".soloDescription");
        const localized = i18next.t(key);
        return key === localized ? this.description : localized;
    }

    get localizedNameDescription() {
        const key = makeKey('Species.', this.speciesKeyName, ".aboutNames");
        const localized = i18next.t(key);
        return key === localized ? this.nameDescription : localized;
    }

    get localizedTraitDescription() {
        const key = makeKey('Species.', this.speciesKeyName, ".traitDescription");
        const localized = i18next.t(key);
        return key === localized ? this.traitDescription : localized;
    }

    get localizedTraitDescription2e() {
        const key = makeKey('Species.', this.speciesKeyName, ".traitDescription2e");
        const localized = i18next.t(key);
        return key === localized ? this.localizedTraitDescription : localized;
    }

    get localizedExampleValue() {
        const key = makeKey('Species.', this.speciesKeyName, ".exampleValue");
        const localized = i18next.t(key);
        return key === localized ? this.exampleValue : localized;
    }
}

class _Species {
    private _species: { [id: number]: SpeciesModel } = {
        [Species.Andorian]: new SpeciesModel(
            Species.Andorian,
            "Andorian",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [ Source.Core, Source.CaptainsLog, Source.Core2ndEdition ],
            ["An aggressive, passionate people from the frozen moon Andoria, the Andorians have been part of the United Federation of Planets since its foundation, having been firm allies of Humanity for several years beforehand. Their blue skin, pale hair, and antennae give them a distinctive appearance, and while the Andorian Imperial Guard was demobilized when the Federation was founded, they still maintain strong military traditions, and a tradition of ritualized honor-duels known as Ushaan, using razorsharp ice-mining tools."],
            [Attribute.Control, Attribute.Daring, Attribute.Presence],
            "Andorian",
            "This trait may reduce the Difficulty of Tasks to resist extreme cold, or Tasks impacted by extremely low temperatures. Their antennae aid in balance and spatial awareness; a lost antenna can be debilitating until it regrows. Andorians also have a high metabolism, meaning, amongst other things, that they tire more quickly than Humans; this also makes them more vulnerable to infection from certain types of injury. Before the Federation, Andorians and Vulcans had numerous disputes; though these issues are largely considered to be ancient history, Andorians and Vulcans don’t always get along.",
            "Proud Son/Daughter of Andoria",
            [TalentsHelper.getTalent("Proud and Honorable"), TalentsHelper.getTalent("The Ushaan")],
            "Andorian names tend to be somewhat harsh-sounding, and have a personal name followed by a clan name. Amongst some Andorians, it’s common to begin the clan name with a gender-specific prefix: 'zh' or 'sh' for females, and 'ch' or 'th' for males. This is placed before the family name, separated by an apostrophe. Longer or more complicated Andorian names are commonly shortened, especially when dealing with other species. Examples: Ishrelia zh’Azonan (female), Atheth th’Zynes(male)",
            [
                { type: "Female", suggestions: "Athytti, Vryvih, Zyle, Vyssia, Thriras, Shreri, Vrossaan, Itamaan, Ishrelia, Vreraat, Talas, Tarah, Jhamel, Talla" },
                { type: "Male", suggestions: "Ishrath, Thoss, Shon, Oshrev, Atheth, Tyvaass, Thasiv, Tyssab, Tylihr, Thy’lek, Shras, Thelev, Keval, Gareb" },
                { type: "Clan Names", suggestions: "Tharhat, Qiaqir, Chiaqis, Thenehr, Zynes, Shraviq, Thilrerh, Azonan, Azollarh, Shran" }
            ]),
        [Species.Bajoran]: new SpeciesModel(
            Species.Bajoran,
            "Bajoran",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["A spiritual, dauntless people from the planet Bajor, the Bajorans have lost much after decades of occupation by the Cardassian Union. Many Bajorans were scattered across the Alpha Quadrant during the occupation, while those who remained on Bajor often acted as insurgents or toiled in labor camps under Cardassian rule. The occupation ended a few years ago, but the scars it left will take generations to heal. Bajor is not a member of the Federation, but many Bajorans scattered by the diaspora have found their way into Starfleet. Bajoran culture places a strong belief in the Prophets, celestial beings who are said to have watched over Bajor for millennia; modern religious doctrine states that the Bajoran Wormhole is the Prophets’ Celestial Temple."],
            [Attribute.Control, Attribute.Daring, Attribute.Insight],
            "Bajoran",
            "For obvious reasons, Bajorans tend to be hostile towards Cardassians, and resentful of those who are dismissive of, or turned a blind eye to, the suffering of the Bajoran people. While not all Bajorans are spiritual or religious to the same degree, most have a cultural understanding of the Prophets’ place in Bajoran society.",
            "Faith in the Prophets",
            [TalentsHelper.getTalent("Orb Experience"), TalentsHelper.getTalent("Strong Pagh")],
            "Bajoran names begin with the family name, followed by a personal name. The individual names are normally short — rarely more than two syllables — and with a soft or melodic sound. Bajor Is traditionally matriarchal, with children taking their mother’s family name. Examples: Reil Yesa (female), Latara Gel (male)",
            [
                { type: "Female", suggestions: "Adami, Chami, Fala, Jaxa, Laren, Lipras, Leeta, Lupaza, Meru, Neela, Nerys, Seriah, Sul, Yesa" },
                { type: "Male", suggestions: "Anaphis, Edon, Essa, Furel, Gel, Holem, Hovath, Kag, Los, Mabrin, Nalas, Reon, Taban, Tennan" },
                { type: "Family", suggestions: "Anbara, Anjohl, Faren, Jaro, Kalem, Krim, Kubus, Latara, Latha, Lenaris, Li, Tahna, Reil" },
            ]),
        [Species.Betazoid]: new SpeciesModel(
            Species.Betazoid,
            "Betazoid",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["The peaceful Betazoid people hail from the idyllic, verdant world Betazed. The world is a valued member of the Federation, and its people can be found across Federation space, including Starfleet. Betazoids appear almost identical to Humans, but differ in one major way: they are naturally telepathic, developing mental abilities during adolescence. The potency of this ability varies between individuals, but it has resulted in a culture where honesty and directness are fundamental: it is difficult to keep secrets when everyone around you can read minds."],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Betazoid",
            "All Betazoids are telepathic to varying degrees, and even when not actively using their abilities, they are highly perceptive of others around them, but also highly sensitive to telepathic disturbances and mental assaults. They have little familiarity with lies and deception, due to their open culture and ability to read the thoughts and emotions of others. As they are sensitive to the minds of other living beings, they tend not to be comfortable around animals, for fear of losing themselves in the minds of wild creatures.",
            "Compassion Through Understanding",
            [TalentsHelper.getTalent("Empath"), TalentsHelper.getTalent("Telepath"), TalentsHelper.getTalent("Open Book"), TalentsHelper.getTalent("Abrupt Insights")],
            "Betazoid names tend to have at least two syllables and a melodic sound, with a personal name followed by a family name; of these, the family name tends to have a harder sound. Betazoids are traditionally matriarchal, with children taking their mother’s family name.",
            [
                { type: "Female", suggestions: "Deanna, Ania, Kestra, Lwaxanna, Dalera, Gloranna, Abeana, Pekera, Nissila, Lomestra, Ioza, Pegira, Nemenna, Nerira, Lojeea" },
                { type: "Male", suggestions: "Konal, Reban, Xani, Enon, Dael, Etas, Andal, Kolel, Atani, Devoni, Algar, Jensar, Nikael, Kalos, Rennan" },
                { type: "Family", suggestions: "Grax, Hagen, Morganth, Stadi, Dutrax, Odutan, Nelan, Onovren, Kader, Nostrun, Dulas, Konin, Ebesin" },
            ]),
        [Species.Denobulan]: new SpeciesModel(
            Species.Denobulan,
            "Denobulan",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["Hailing from the planet Denobula, Denobulans are a gregarious, inquisitive people who have been allies of Humanity since the 2130s. Though Denobula was not one of the founders of the Federation, the Denobulans joined soon after. Denobulans are a sociable people, with distinctive expressive features, who are used to living in close, communal conditions, and whose extended family groups are large and complex — a Denobulan may have several spouses, each of whom may have several partners of their own, and dozens of children between them. Culturally, they are intellectually curious, perceptive, and interested in a wide range of philosophies, though their scholarly nature, large families, and gregarious nature means that relatively few of them venture far from their homeworld."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Reason],
            "Denobulan",
            "Denobulans have a robust immune system, but a vulnerability to various forms of radiation poisoning. They are naturally adept climbers, scuttling up sheer walls like some forms of terrestrial lizard. Denobulans do not need to sleep, but must hibernate for several days each year, becoming disoriented if kept awake during this period.",
            "Safety in Numbers",
            [TalentsHelper.getTalent("Cultural Flexibility"), TalentsHelper.getTalent("Parent Figure")],
            "Denobulans tend to only have a single name — an individual Denobulan may be part of several overlapping families. Some Denobulans may use the name of one of their spouses as an impromptu surname, however; this is often to indicate association to species that may not understand Denobulan families. Denobulan names tend to be short and hard-sounding, particularly male names.",
            [
                { type: "Female", suggestions: "Anari, Andora, Asha, Daphina, Feezal, Forliza, Kessil, Liera, Lusis, Miral, Natala, Ninsen, Henna, Sabra, Secka, Symmé, Trevis, Vesena" },
                { type: "Male", suggestions: "Biras, Bogga, Delix, Grolik, Groznik, Nettus, Moga, Morox, Phlox, Rinix, Takis, Tropp, Tuglian, Vinku, Yolen, Zepht, Zinet" },
            ]),
        [Species.Human]: new SpeciesModel(
            Species.Human,
            "Human",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["Originating on the planet Earth in the Sol system, Humans are a resilient, diverse, and adaptable species, who developed from fractious, warring nations on the brink of mutual annihilation to a united, peaceful society in less than a century, and managed to forge alliances between former enemies within a century of achieving interstellar space flight. Earth is a founder and pivotal member of the United Federation of Planets, and many of the Federation’s institutions can be found on Earth. Humans often exhibit a dichotomy in their nature — being both driven to strong emotion and careful reason — and while they have largely grown beyond their warlike and divisive past, their drive and capacity for aggression are as much a part of their success as their curiosity and analytical minds."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Human",
            "Humans are adaptable and resilient, and their resolve and ambition often allow them to resist great hardship and triumph despite great adversity. However, Humans can also be reckless and stubborn, irrational, and unpredictable.",
            "The Drive for Exploration",
            [TalentsHelper.getTalent("Resolute"), TalentsHelper.getTalent("Spirit of Discovery")],
            "Human names vary wildly, and rather than make sweeping generalizations here, it’s better that Players seek out other sources for names, considering the vast range of languages, cultures, and traditions Humanity encompasses.",
            [
            ]),
        [Species.Tellarite]: new SpeciesModel(
            Species.Tellarite,
            "Tellarite",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["The stout, hirsute Tellarite species comes from Tellar Prime, a temperate planet in the Alpha Quadrant. Theirs is a culture noted for being abrasive and argumentative, with a stubborn pride, quick tempers, and little patience. However, this is only a superficial view: while Tellarites are argumentative, it comes from a sense of intellectual honesty and rigorous skepticism. To a Tellarite, no idea, concept, or person is beyond challenge or analysis, and any notion that cannot stand up to scrutiny is an unworthy one. Tellarites revel in debates, and tend to greet one another with criticisms, complaints, and even insults; failing to respond in kind is poorly- regarded, as it displays a weakness of character and an unwillingness to confront flaws."],
            [Attribute.Control, Attribute.Fitness, Attribute.Insight],
            "Tellarite",
            "Tellarites have a keen sense of smell and a high tolerance for many common drugs, toxins, and inebriants (Tellarites don’t get drunk, just feisty). They also have excellent eyesight, and more acute perception of distance, depth, and dimension than Humans.",
            "All Ideas must Withstand Scrutiny",
            [TalentsHelper.getTalent("Incisive Scrutiny"), TalentsHelper.getTalent("Sturdy"), TalentsHelper.getTalent("Asking the Right Questions")],
            "Tellarite names have considerable variation, but all tend to be composed of harsh, even guttural sounds. Tellarite names consist of a personal name and a family name, though the family name is often a compound, indicating that the family name is a patronym or matronym (the name of a father or mother, respectively), toponym(derived from a place) or similar — in this way, these prefixes are similar to “O’”, “Mc“, “von”, and similar elements in some Human names. Examples: Pola jav Brin (female), Tuk glasch Khutohk (male)",
            [
                { type: "Female", suggestions: "Pola, Cherthish, Zhuggaa, Torthem, Neshlel, Verg, Kholo, Fratho, Skig, Vaolli, Glavom, Nihraogh, Ghand, Rensh" },
                { type: "Male", suggestions: "Prugm, Brag, Dash, Gisich, Gullerg, Zankir, Hellek, Trar, Jorsh, Geshniv, Tuk, Rinkog, Veth, Cek, Gullak" },
                { type: "Prefixes", suggestions: "bav, glov, blasch, lorin, jav, bim, glasch" },
                { type: "Family", suggestions: "Gronnahk, Nonkursh, Slaal, Ker, Zhiv, Blav, Zhuffand, Khebloss, Pend, Brin, Wenkurn, Gerkow, Khutohk, Jagh, Krer" },
            ]),
        [Species.Trill]: new SpeciesModel(
            Species.Trill,
            "Trill",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["The Trill species, from their homeworld of the same name, appear almost identical to Humans, but for rows of spots running down the sides of their bodies, from head to toe. However, this superficial similarity conceals a considerable difference — the Trill are capable of bonding with a symbiotic organism known as a symbiont, creating a distinct being from the two individual creatures. The symbionts can live for many centuries, and are placed with successive hosts, carrying the memories and knowledge of previous hosts into a new joining with each new generation. This fact isn’t widely known outside the Trill themselves, but it isn’t a secret — it simply isn’t widely discussed, and the number of joined Trill is relatively small. The Trill have been part of the Federation for well over a century, with several renowned Trill serving important roles in shaping the Federation. The Trill, as a culture, tend to be focused on intellectual pursuits first and foremost, as learning and wisdom are prized by the symbionts in their hosts."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Trill",
            "Trill are especially resilient to parasites, as a quirk of their potential to be Joined; Joined Trill are entirely immune to parasitic infection. However, they tend to have strong allergic reactions to insect bites and other forms of venom, which can disrupt their neurochemistry, particularly if they’re Joined. As many of the specifics of Trill physiology — especially with regards to symbiosis — are not widely known, this can result in medical complications.",
            "Four Lifetimes of Adventure",
            [TalentsHelper.getTalent("Former Initiate"), TalentsHelper.getTalent("Joined")],
            "Trill names consist of a personal name and a family name, though in the case of a joined Trill, the family name is replaced with the name of the symbiont. Examples: Koria Inazin (female, unjoined), Bejal Okir (male, joined)",
            [
                { type: "Female", suggestions: "Audrid, Azala, Emony, Kareel, Lenara, Nilani, Reeza, Zharaina, Koria, Lidra, Diranne, Kimoni, Larista, Vidria, Kehdza" },
                { type: "Male", suggestions: "Arjin, Bejal, Curzon, Hanor, Joran, Malko, Selin, Timor, Tobin, Torias, Verad, Yedrin, Keman, Sabin, Joal, Dorin" },
                { type: "Family", suggestions: "Nedan, Sozenn, Rulon, Les, Tral, Inazin, Hama, Kelen, Imonim, Razix, Idiron, Paron, Tanan, Sulil, Kerev" },
                { type: "Symbiont", suggestions: "Jexen, Del, Ogar, Kyl, Eku, Nala, Cela, Pohr, Ral, Okir, Etahn, Lahl" },
            ]),
        [Species.Vulcan]: new SpeciesModel(
            Species.Vulcan,
            "Vulcan",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog, Source.Core2ndEdition],
            ["The Vulcans are a stoic, rational people. Widely claimed to be emotionless, in truth the Vulcans feel deeply and intensely, to their own detriment. Their stoicism comes from a culture of logic and self- discipline, where emotions are analyzed and dissected to rob them of their potency, so that they cannot overwhelm or control the individual. Vulcans embrace science and reason, but their lives are not purely devoted to logic: they also have a deeply philosophical side, with art and music as vital to their culture as logic. They are also an intensely private people, with many aspects of their culture — such as the rites of pon farr — which are not discussed amongst outsiders."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Vulcan",
            "Due to the harsh, arid, high-gravity world they come from, Vulcans are naturally resistant to extreme heat and dehydration; they are also extremely strong, with keen auditory and olfactory senses. They are also telepathic, though this takes training to properly manifest, and they learn mental discipline and emotional control from childhood. However, this control takes regular meditation to maintain, and their controlled nature and desire for privacy can distance them from others, and make interactions awkward.",
            "The Needs of the Many Outweighs the Needs of the Few, or the One",
            [TalentsHelper.getTalent("Kolinahr"), TalentsHelper.getTalent("Mind-Meld"), TalentsHelper.getTalent("Nerve Pinch")],
            "Vulcans have only a single name, in practical terms — while they do have family names, these are not discussed amongst other species — and tend to be traditional in the names they use. Male Vulcans often — though far from always — are given names beginning with S, while female names frequently begin with T. These are far from universal, however.",
            [
                { type: "Female", suggestions: "Falor, Metana, Perren, T’Karra, T’Laan, T’Lar, T’Les, T’Mal, T’Paal, T’Pan, T’Rel, T’Vran, Seleya, Simora, V’Lar" },
                { type: "Male", suggestions: "Aravik, Delvok, Kovar, Muroc, Rekan, Salok, Savel, Sevek, Skon, Soral, Sutok, Syrran, Tekav, Tolek, Velik" },
            ]),
        [Species.KlingonExt]: new SpeciesModel(
            Species.KlingonExt,
            "Klingon",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["Klingon characters are typically large, physically powerful, and proud, with an aggressive approach to everything they do, and a propensity for violence that makes them extremely dangerous. They are predatory, with a primarily carnivorous diet, and a preference for either still-living food or wild prey from a hunt. Culturally, Klingons revere physical prowess, victory in battle, and a code of personal and familial honor that influences most of their politics, though not all Klingons live up to this; in some Klingons, this only keeps them from performing shameful acts so long as they can avoid the repercussions."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Klingon",
            "Klingon physiology is hardy, with many redundant internal organs allowing them to withstand harm and a number of poisons, which would be deadly for many other species. They are significantly stronger and more resilient than Humans, though they have less tolerance for the cold.",
            "",
            [],
            "",
            []),
        [Species.RomulanExt]: new SpeciesModel(
            Species.RomulanExt,
            "Romulan",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["Romulans are similar, but not quite identical, to Vulcans, having diverged from their common ancestors, though they did not adopt the stoicism and logic of their cousins. Rather, Romulans are a cruel and ruthless people, quick to anger, and easily moved to emotion. A culture of military discipline seems to keep their worst members directed towards useful ends, though paranoia and self-interest motivate Romulan politics as much as a desire for collective benefit; at times, it seems that the only things keeping the Romulan Star Empire together are the fact that they despise other species more than they despise one another."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Romulan",
            "Romulan physiology is not meaningfully different to that of Vulcans, though a portion of the Romulan species exhibits a v-shaped forehead ridge not evident in Vulcans. The largest difference is that Romulans lack the intense mental discipline common to Vulcans. Psychologically and culturally, Romulans prize cunning and strength of will, and are distrustful of other species: this opinion is reciprocated, as Romulans have a reputation for manipulation, deception, and betrayal.",
            "",
            [],
            "",
            []),
        [Species.Borg]: new SpeciesModel(
            Species.Borg,
            "Borg",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["Borg is not something that a person is born to, but rather something that they are forced to become — though for infants and children assimilated by the Collective, they may have little or no memory of any other life. The Borg meld biology with technology, and a drone will have countless implants, the result of both invasive surgery and aggressive nanotechnology. As of 2371, only a single individual has ever been removed from the Borg Collective — Jean-Luc Picard, who was captured only days earlier, meaning that his implants were less extensive than those of someone assimilated years or decades before. Borg NPCs are all mixed-species characters — their original species, and their new reality as part of the Collective."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Borg",
            "Borg are extremely strong and resilient, owing to their technologically-enhanced physiology. They lack self-determination and intuition, relying on directives and protocols from the Collective, and the gestalt consciousness of countless other Borg drones.",
            "",
            [],
            "",
            [], [], false),
        [Species.FerengiExt]: new SpeciesModel(
            Species.FerengiExt,
            "Ferengi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["Ferengi are short, unimposing beings, noted more as merchants and traders than as warriors, scientists, or engineers. Their culture promotes the acquisition of material wealth, and their society is extremely capitalistic, with most routine activities accompanied by the exchange of a precious, non-replicable substance called latinum (a room-temperature liquid metal, often stored within gold “slips,” “bricks” or “bars”). Ferengi discriminate between their genders considerably, with female Ferengi not being permitted to own property or wear clothing; enterprising female Ferengi invariably find a way around these restrictions."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Ferengi",
            "Ferengi physiology does not lend itself to physical activity, nor does their culture value such hardship, though they have a high resistance to many common diseases. Ferengi have exceptionally keen hearing, and highly-sensitive ears, though this also means that intense sounds (and physical force applied to the ears) can inflict debilitating pain. Their unusual brain structure means that telepaths cannot read Ferengi minds. Culturally, Ferengi are acquisitive, regarding the accumulation of wealth as the highest virtue, and while this has given them a reputation as cunning negotiators, they are also often seen as duplicitous and manipulative as well.",
            "",
            [],
            "",
            []),
        [Species.CardassianExt]: new SpeciesModel(
            Species.CardassianExt,
            "Cardassian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["Cardassians are tall, grey-skinned humanoids with pronounced ridges on their bodies and faces. Their culture demands absolute loyalty to family and to the state — with Cardassian morality plays often depicting conflicts between familial loyalty and loyalty to the state — and they prize individual cunning, self-control, and the ability to endure hardship. Cardassians are a secretive people, even amongst close friends and family, and being suspicious and skeptical of others is regarded as wise and prudent. They value educational attainment and knowledge, and they are fond of conversation and lively debate. They are frequently regarded as domineering, ruthless, arrogant, and duplicitous."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Cardassian",
            "Cardassians possess extraordinary mental discipline, and commonly have photographic memories, the result of intense training during childhood. They are intolerant of cold environments, but quite comfortable at higher temperatures. Cardassian hearing is slightly less acute than that of Humans, and they are uncomfortable in bright light. Cardassians have a negative reputation amongst many Alpha Quadrant cultures, particularly Bajorans, whose homeworld they occupied for decades.",
            "",
            [],
            "",
            []),
        [Species.JemHadar]: new SpeciesModel(
            Species.JemHadar,
            "Jem'Hadar",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core, Source.CaptainsLog],
            ["The Jem’Hadar are genetically-engineered life-forms, created to serve as the military of the Dominion. Bred in birthing chambers, rather than born naturally, they grow to maturity in three days, developing complex reasoning and language skills within a day of birth. Once mature, they do not eat, drink, or sleep, taking all nourishment from the drug ketracel-white, often simply known as “the white,” which is distributed to them by their Vorta overseer as a means of ensuring loyalty. Few Jem’Hadar live for longer than fifteen years due simply to battlefield casualties, with those living to twenty being regarded as ‘Elders’."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Jem'Hadar",
            "Individual Jem’Hadar are physically powerful, and far stronger and more resilient than Humans. They also have exceptionally keen eyesight, and act utterly without fear or hesitation in battle. They do not regard death with any apprehension, and are extremely aggressive, limited only by their absolute obedience to the Founders and the Vorta.",
            "",
            [],
            "",
            []),
        [Species.Vorta]: new SpeciesModel(
            Species.Vorta,
            "Vorta",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Core],
            ["The Vorta are genetically-engineered life-forms, created to serve as advisors, scientists, diplomats, and overseers for the Dominion, acting as the Founders’ closest servants and foremost representatives. Vorta are cloned, in batches of identical beings, with a new clone being activated and placed into service upon the death of a predecessor, receiving the memories of those that came before them, though each clone is nevertheless a distinct individual. Vorta are extremely cunning and clever, but have little creativity or sense of aesthetics."],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Vorta",
            "Vorta have extremely keen hearing, but relatively poor eyesight. They are immune to most forms of poison. Vorta are absolutely loyal to the Dominion, revering the Founders as living gods. Those who encounter the Vorta often regard them as insincere or manipulative.",
            "",
            [],
            "",
            []),
        [Species.Ardanan]: new SpeciesModel(
            Species.Ardanan,
            "Ardanan",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Ardanan citizens have a long history of societal division. The two castes that still hold sway over an Ardanian’s potential are the city-dwellers of the floating city, Stratos, and the surface dwelling Troglytes. While anatomically no different, for years the Troglytes suffered from conditions and mental difficulties that reduced their higher brain functions. This was due to exposure to the zenite mines where they labored and, once the Federation Bureau of Industrialization got involved, breathing apparatus was quickly made mandatory. In contrast the beautiful City of Stratos, floating in the lower atmosphere of Ardana, is home to a people entirely devoted to art, government and culture."],
            [Attribute.Fitness, Attribute.Presence, Attribute.Reason],
            "Ardanan",
            "Ardana natives from either caste are hardy individuals, whose duality of art and culture, and resource mining and management, make them excellent all-rounders. Without the exposure to zenite gas many Troglytes reach a level of academic and artistic ability on par with the city-dwellers, making the Ardanans both a people of stout endurance and cultural excellence.",
            "Nothing Is More Beautiful Than a City In the Sky",
            [TalentsHelper.getTalent("Above the Clouds"), TalentsHelper.getTalent("Zenite in the Soul")],
            "",
            [
                { type: "Male", suggestions: "Anka, Midro, Plasus" },
                { type: "Female", suggestions: "Droxine, Vanna" }
            ]),
        [Species.Benzite]: new SpeciesModel(
            Species.Benzite,
            "Benzite",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Benzite physiology gives this species’ skin a hairless blue-to-green complexion. The Benzite skull has a thick protrusion that extends over the brow and nose, with two facial tendrils above the lip. Until 2370 Benzites in Starfleet had trouble breathing a standard nitrogen/oxygen atmosphere and relied on breathing apparatus. Their apparent change in condition, which allows the species to go without breathing aids, is rumored to be thanks to genetic engineering, though reports are unconfirmed. Highly meticulous, a Benzite Starfleet officer is a valuable resource when it comes to exploration and investigation."],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Benzite",
            "A Benzite’s average body temperature is several degrees lower than an average, warm blooded humanoid, though the Benzite themselves are not cold blooded. Their blood being mercury and platinum based. Benzites also have 2 apposable thumbs on each hand, aiding their dexterity.",
            "Report Only What You Know",
            [TalentsHelper.getTalent("Meticulous Analysis"), TalentsHelper.getTalent("All Fingers and Thumbs")],
            "",
            [
                { type: "Male", suggestions: "Mendon, Mordock" },
                { type: "Female", suggestions: "Hoya" }
            ]),
        [Species.Bolian]: new SpeciesModel(
            Species.Bolian,
            "Bolian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["From the planet Bolarus IX, Bolians are well known for their hospitality and outgoing personalities. Identified by a cartilaginous ridge that extends down their head, vertically, down the center of the face to the chest, with skin color ranging from light blues, to dark greens and muted purples with darker banding across the head. They are predominantly bald, though some females are known to have hair on their heads. Bolian marriages have more than two partners, of both sexes, but procreation with other species isn’t all that common, given the Bolians’ incompatibility with others. Humans, in particular, have noted several side effects of inter-species relations, including nausea, fatigue, and inflammation."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Bolian",
            "Bolians are able, thanks to their cartilaginous tongues, to consume substances unsafe to other species, such as acids or decaying meat. Bolian hearts are on the right side of their body, moving blue blood around their circulatory system. Bolians are an understanding, hospitable species, often forward-facing in their duties in customer relations or diplomatic service.",
            "A Broad Smile and a Warm Heart",
            [TalentsHelper.getTalent("Warm Welcome"), TalentsHelper.getTalent("Born Near a Warp Core")],
            "",
            [
                { type: "Male", suggestions: "Ardon, Hars, Boq'ta, Brathaw, Chell, Rixx, Zim" },
                { type: "Female", suggestions: "Golwat, Lysia, Mitena" },
                { type: "Family Name", suggestions: "Adislo, Arlin, Brott" }
            ]),
        [Species.Deltan]: new SpeciesModel(
            Species.Deltan,
            "Deltan",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["These humanoids from the Delta system differ in appearance only slightly from Humans, with very little hair across their bodies, aside from eye brows and lashes. As a telepathic and empathic species, the Deltans rank themselves alongside the Vulcans and Betazoids as able to read and communicate via thoughts and feelings. Indeed, some Deltan genealogists have theorized Betazoids are a distant cousin species. With some of the most potent pheromones the Federation has ever encountered, many other species find the Deltans very sexually appealing.The vast majority of Deltans in Starfleet, therefore, take an oath of celibacy, ensuring their sexuality is not a distraction to their colleagues.By all accounts this is a good thing, as the Deltan act of intimacy involves not only their bodies but also their telepathic minds, possibly endangering the mental health of other species."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Deltan",
            "Deltans are considered to be beautiful individuals, with powerful empathic abilities and heightened sensuality. The pheromones they excrete are a natural aphrodisiac in most species throughout the Federation, and while serving aboard Starfleet they must be very careful with their natural physiology, using chemical suppressants to cancel the effect.",
            "Bodies and Minds as One",
            [TalentsHelper.getTalent("Deltan Pheromones"), TalentsHelper.getTalent("Empath")],
            "",
            [
                { type: "Male", suggestions: "Jedda, Clarze" },
                { type: "Female", suggestions: "Ilia, Zinaida" },
                { type: "Family Name", suggestions: "Adzhin-Dal" }
            ]),
        [Species.Efrosian]: new SpeciesModel(
            Species.Efrosian,
            "Efrosian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Hailing from the planet Efros Delta, Efrosians are renowned musicians and historians. Their society is dedicated to oral teaching, most notably in the form of a musical language that all Efrosian children are taught in some form or another. They are also excellent navigators and are often sought out as helm and navigation officers, as well as translators thanks to being natural linguists and communications experts. While their cranial ridges bear some similarity to Klingon physiology (though less pronounced), a male’s hair is almost always white from birth while females exhibit darker colors. Males grow long moustaches and both male and female Efrosians grow their hair out down their backs."],
            [Attribute.Fitness, Attribute.Presence, Attribute.Reason],
            "Efrosian",
            "As the natives to a planet of harsh freezing storms, Efrosians have natural resilience and survival instincts. They have two stomachs to break down any tough foodstuffs and protect from infection, while their naturally poor eyesight is made up for by their enhanced senses of smell and taste. Interestingly, even though they have poor vision compared to other humanoids, they can perceive a greater portion of the light spectrum than most.",
            "Specialization Furthers Knowledge",
            [TalentsHelper.getTalent("Visual Spectrum"), TalentsHelper.getTalent("Oral Scholar")],
            "",
            [
                { type: "Male", suggestions: "Ra-Ghoratreii, Xin Ra-Havreii, Ra-Yalix" },
                { type: "Female", suggestions: "Hu'Ghrovlatrei, Fellen Ni-Yaleii" }
            ]),
        [Species.Klingon]: new SpeciesModel(
            Species.Klingon,
            "Klingon",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.KlingonCore, Source.CaptainsLog, Source.Core2ndEdition],
            ["With its capital at Qo’noS, the Klingon Empire is almost as large as the Federation, and larger than the Romulan Empire. Distinguishable by the sagittal crest over their foreheads and crowns, Klingons are taller and stronger than most humanoid species, something that helps enhance their reputation as warriors. The hardy Klingons have been both allies and enemies throughout their years of contact with the Federation. Now, as staunch allies, this proud people have begun to exchange officers with Starfleet. Not only that but Worf, son of Mogh, created a precedent as the first Klingon to graduate of Starfleet Academy. This has brought more applications from Klingons, especially those of mixed heritage who don’t feel at ease in the Klingon Empire. Klingons embody pride and honor above all. Many dedicate their lives to the warrior ethos for the honor of house and family."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Klingon",
            "There is a great redundancy in Klingon organs, with two livers, multiple stomachs, three lungs, and an eight-chambered heart. Their skeletal structure also has several redundancies that mitigate injuries that would prove fatal to other humanoids.",
            "Honor is More Important Than Life",
            [TalentsHelper.getTalent("To Battle!"), TalentsHelper.getTalent("Brak'lul"), TalentsHelper.getTalent("R'uustai"), TalentsHelper.getTalent("Warrior's Spirit"), TalentsHelper.getTalent("Killer's Instinct")],
            "",
            [
                { type: "Male", suggestions: "Be'etor, Cheng, Mogh, Qeng, Torgh" },
                { type: "Female", suggestions: "a'Setbur, HuS, lurSa, Mara" }
            ]),
        [Species.Chelon]: new SpeciesModel(
            Species.Chelon,
            "Rigellian Chelon",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant],
            ["Chelons are a hardy race, sharing their home solar system of Rigel with Rigellian Jelna. They are descendants of sabertoothed turtles and, though bipedal, they have retained their ancestral beaks, claws and hard shells. Chelons are androgynous and take on masculine or feminine societal roles at varying points in their lives, reproducing like most reptilians by laying eggs and fertilizing those eggs. Some traditionalists within Chelon society maintain a neutral gender, and refuse to take on male or female roles."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Rigellian Chelon",
            "The Chelon species retains a lot of characteristics from its ancestral species, a type of saber-toothed turtle. They have beaks, and a strong (if clumsy) bite; some have trained to use this in closequarters combat. During times of stress or physical combat they also emit a deadly toxin through their skin. This can be used with their claws so that the toxin reaches an opponent’s blood. They are skilled swimmers and prefer a warm, humid climate. They are also resistant to ultraviolet radiation and, to a lesser extent, other radioactivity. This is probably due to the shells that extend over much their bodies.",
            "Real Power is in the Service of Others",
            [TalentsHelper.getTalent("Chelon Shell"), TalentsHelper.getTalent("Toxic Claws")],
            "",
            [
                { type: "Male", suggestions: "T'k-agha, Genn, Stek'ghen" },
                { type: "Female", suggestions: "Salka, Ash'lak, Dakla'" }
            ]),
        [Species.Jelna]: new SpeciesModel(
            Species.Jelna,
            "Rigellian Jelna",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant],
            ["The Jelna, like the Chelon, are natives of the Rigel system and come from Rigel V. A diligent and hard-working species, the Jelna were the first Rigellians to engage in space flight. Although they took to commerce and systemwide government quicker than the Chelon, the Jelna weren’t aggressive, and they made sure that of democratic representation for all Rigellian species on the Governing Board and the Rigellian Trade Commission. The humanoid Jelnas have four genders: two male and two female genders. Male and female exosexes contain an additional Z chromosome, and they outnumber the endosexes 2 to 1. Exosexes are the more resilient and physically adept members of the species, while endosexes are more comparable to the male and female sexes typically found in other humanoid species."],
            [Attribute.Fitness, Attribute.Presence, Attribute.Reason],
            "Rigellian Jelna",
            "The Jelna on Rigel V evolved along similar lines to most humanoids, aside from their four sexes. Endosexes are comparable to other humanoids, while exosexes possess a more robust physique and aggressive tendancies. Endosexes have exclusively gray skin and red eyes and are more suited to nurture and care; exosexes have a pale brown complexion.",
            "Governance and Trade for the Prosperity of All",
            [TalentsHelper.getTalent("Exosex"), TalentsHelper.getTalent("Industrious Mind")],
            "",
            [
                { type: "Male", suggestions: "Jemer, Shalna" },
                { type: "Female", suggestions: "Lahvon, Velkal" },
                { type: "Family Name", suggestions: "Pahtel, Zehron" }
            ]),
        [Species.Risian]: new SpeciesModel(
            Species.Risian,
            "Risian",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Risa was a planet of fierce storms and tectonic instability before the Risians took it upon themselves to essentially terraform their planet. It is now colloquially known throughout the Federation as a “pleasure planet.” It’s a wonder the Risians evolved into the ceremonial society they have today, with tradition and ceremony being central to Risa society. Risians have an honest and open attitude to sexuality, renowned throughout the Galaxy.Potential mates with a sexual appetite display ceremonial icons, called a horga’hn, that invite partners to participate in the sexual rite jamaharon."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Risian",
            "Risians appear much like Humans, save a decorative gold emblem in the center of the forehead. They have open and adventurous personalities but also have a great patience with others.",
            "All That is Ours is Yours",
            [TalentsHelper.getTalent("Peaceful Existence"), TalentsHelper.getTalent("Open and Insightful")],
            "",
            [
                { type: "Male", suggestions: "Doranis, Melek, Oran" },
                { type: "Female", suggestions: "Aradnis, Elianjah, Joval" }
            ]),
        [Species.XindiArboreal]: new SpeciesModel(
            Species.XindiArboreal,
            "Xindi-Arboreal",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["The intelligent Arboreal species of the Xindi are a contrast some of their cousins on Xindus in that they are known to have an incredibly calm demeanor, some would call them lethargic. But with a relaxed pace comes an appreciation for logical thought and considered discussion. Since becoming members of the Federation, Xindi–Arboreals have worked in Starfleet and the Federation as mediators, counsellors, diplomats and administrators."],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Xindi-Arboreal",
            "Covered in hair, and with distinctive ridges on their nose and cheekbones, the Arboreals are evolved from creatures similar to that of the Earth sloth. They possess sharp claws and have slightly longer arms than the average humanoid. With a naturally calm, rational mind, they do not panic or stress easily though they do fear large bodies of water. Their dark eyes allow them to see easier in low light conditions compared to other humanoids.",
            "Calm Focuses the Mind",
            [TalentsHelper.getTalent("Calm Under Pressure")],
            "",
            [
                { type: "Male", suggestions: "Janner, Gralik" },
                { type: "Female", suggestions: "Adela, Rolindis" },
                { type: "Family Name", suggestions: "Durr" }
            ]),
        [Species.XindiPrimate]: new SpeciesModel(
            Species.XindiPrimate,
            "Xindi-Primate",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Xindi-Primates were the second Xindus species to evolve intelligence, after the Xindi–Aquatics. Primates are talented engineers and are often fair, honest and trusted. The Xindi inclusion into the United Federation of Planets in 2311 enabled Xindi-Primates to enhance their learning, and find positions in design, architecture, engineering, along with research and development. They, more than most species to attend the Academy, find themselves in the command division upon graduation, given their adaptability and audaciousness."],
            [Attribute.Daring, Attribute.Presence, Attribute.Reason],
            "Xindi-Primate",
            "With a similar physiology to humans, Primates share their characteristic internal organ structure and metabolism, as well as their sensory perceptions. Their facial structure is markedly different, however, with pronounced foreheads and ridged cheekbones like other Xindus species. Amongst other Xindi, Primates have a reputation for fairness and honesty. Many people beyond Xindus have come to regard Xindi-Primates as trustworthy and decent.",
            "Honestly Never Makes a Problem Worse",
            [TalentsHelper.getTalent("A Mind for Design")],
            "",
            [
                { type: "Male", suggestions: "Degra, Ragnar, Toki" },
                { type: "Female", suggestions: "Bryn, Guyda, Hreidur" }
            ]),
        [Species.XindiReptilian]: new SpeciesModel(
            Species.XindiReptilian,
            "Xindi-Reptilian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["The Reptilian species from Xindus rival the insectoids in aggression, and are likely to resort to force to achieve their goals. They’re also notably dishonest and impatient when it comes to dealing with other species, including other Xindi. It is rare for Reptilians to apply to Starfleet Academy, and rarer still for them to be accepted, as their temperament can lead to confrontations. Those XindiReptilians who do join Starfleet rival the Klingons in martial prowess, Tellarites in aptitude for debate, and Zakdorn in tactical expertise."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Xindi-Reptilian",
            "These are cold blooded individuals who prefer hotter climates. Scales, ridges and spikes cover their body and they have vertical slit eyes, for adapting to low light conditions and judging depth. A carnivorous, protein-heavy diet gives them muscular tone and definition that enhances their strength and endurance. They have a reputation amongst other Xindi for being aggressive, impatient, stubborn, and untrustworthy.",
            "Patience is for the Dead",
            [TalentsHelper.getTalent("Stun Resistance")],
            "",
            [
                { type: "Male", suggestions: "Dankra, Guruk" },
                { type: "Female", suggestions: "Igak, Krell" },
                { type: "Family Name", suggestions: "Dolim" },
            ]),
        [Species.XindiInsectoid]: new SpeciesModel(
            Species.XindiInsectoid,
            "Xindi-Insectoid",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Among Xindus species, Xindi-Insectoids are considered one of the most aggressive and decisive. They, and the Reptilians are responsible for the destruction of their original homeworld, after detonating vast explosions beneath several seismically active points. Their language is the most complex among the Xindi species with 67 different dialects of clicks and chirps that other species find hard to replicate. Insectoid names grow longer as the individual ages, carrying more meaning and life history than many other species’ given names."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Xindi-Insectoid",
            "Reproduction is asexual with a single adult laying a clutch of eggs. Life expectancy is very short compared to other species with 12 years as the average. Their insectoid bodies grant them enhanced abilities, such as crawling and climbing, while their cheek ridges distinguish them as Xindus natives.",
            "Protect Your Off-spring at the Expense of Self",
            [TalentsHelper.getTalent("Protective Instinct")],
            "Xindi-Insectoid names are an incredibly intricate series of clicks and chirps, and while amongst other species often choose a name to be known as by their crewmates, favoring short names that work well with their consonant heavy language.",
            []),
        [Species.Zakdorn]: new SpeciesModel(
            Species.Zakdorn,
            "Zakdorn",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Seen as easily the best tactical minds in the Galaxy, the Zakdorn excel at complex strategic thinking. This asset has enabled the Federation to streamline its defensive policy over the years, with Zakdorn officials overseeing training exercises and “war games” for Starfleet. Their personal confidence and conviction is often considered boasting and hubris, particularly given that no rival species has ever tested the Zakdorn military. Zakdorn strategists have, however, helped Starfleet and the Federation immeasurably since they joined in the early 24th Century."],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Zakdorn",
            "Zakdorn tend to be of shorter stature than most humanoids and have distinctive wrinkles of fatty tissue over their faces and bodies. This fatty layer enables Zakdorn to survive without food for much longer periods than normal humanoids. Their analytical brains give them an edge in logic and reasoning that rivals even Vulcans.",
            "A Coherent Strategy is the First Line of Defense",
            [TalentsHelper.getTalent("Tactical Voice"), TalentsHelper.getTalent("Master Strategist")],
            "",
            [
                { type: "Male", suggestions: "Gruhn, Jir, Koll, Sirna" },
                { type: "Female", suggestions: "Bel, Myk, Orym" },
                { type: "Family Name", suggestions: "Azernal, Bunkrep, Kolrami, Roplik" },
            ]),
        [Species.Changeling]: new SpeciesModel(
            Species.Changeling,
            "Changeling",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DS9],
            ["A fluidic, shapeshifting species from the Gamma Quadrant, Changelings are typically reclusive, elusive beings, who try to avoid contact with other species, referred to by Changelings as “monoforms” or “solids”. Most Changelings are collectively the Founders of the Dominion, but Changelings encountered beyond the Dominion are often from “The Hundred”, a group of infants sent out to learn about the galaxy before being compelled to return home. The Founders collectively regard themselves as The Great Link, a fluid collective that appears more like an ocean than a society, where the distinctions between individuals disappear."],
            [Attribute.Control, Attribute.Fitness, Attribute.Insight],
            "Changeling",
            "A Changeling is naturally a gelatinous orange-brown fluid, which can adopt the form and structure of any solid object, including other living creatures and diffuse substances like fog. While they cannot become energy, a Changeling’s ability to assume other forms is limited more by skill and experience than by physical capacity: it is theorized that they transfer mass to and from subspace in order to change size and density. Many Changelings find themselves persecuted by “solids” for their shapeshifting ability, and often crave a sense of order and justice in the universe, with a rigid attitude at odds with their fluid forms.",
            "Solids Fear What They Don't Understand, and They Don't Understand Me",
            [TalentsHelper.getTalent("Morphogenic Matrix"), TalentsHelper.getTalent("Morphogenic Mastery")],
            "",
            []),
        [Species.Ferengi]: new SpeciesModel(
            Species.Ferengi,
            "Ferengi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DS9, Source.CaptainsLog, Source.Core2ndEdition],
            ["Ferengi are short, unimposing beings, noted more as merchants than traders than as warriors, scientists, or engineers. Their culture promotes the acquisition of material wealth, and their society is extremely capitalistic, with most routine activities accompanied by the exchange of a precious, nonreplicable substance called latinum (a room-temperature liquid metal, often stored within gold “slips,” “bricks,” or “bars.”) Ferengi discriminate between their genders considerably, with female Ferengi not being permitted to own property or wear clothing; enterprising young female Ferengi invariably find a way around these restrictions."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Ferengi",
            "Ferengi physiology does not lend itself to physical activity, nor does their culture value such hardship, though they have a resistance to many common diseases. Ferengi have exceptional hearing, and highlysensitive ears, though this also means that intense sounds (and physical force applied to the ears) can inflict debilitating pain. Their unusual brain structure means that telepaths cannot read Ferengi minds. Culturally, Ferengi are acquisitive, regarding the accumulation of wealth as the highest virtue, and while this has given them a reputation as cunning negotiators, they are also often seen as duplicitous and manipulative as well.",
            "18th Rule of Acquisition - A Ferengi Without Profit is No Ferengi At All",
            [TalentsHelper.getTalent("Greed Is Eternal"), TalentsHelper.getTalent("Never Place Friendship Above Profit")],
            "",
            []),
        [Species.Android]: new SpeciesModel(
            Species.Android,
            "Soong-type Android",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.TNG, Source.CaptainsLog],
            ["Originally designed by Dr. Noonian Soong the Soong-type Android is a exceptionally advanced artificial intelligence life-form. These android are capable of incredible feats of reason due to their positronic brain but are normally emotionless and may find it difficult to relate to organic beings. Certain advanced versions offset this problem by use of an emotion chip that allows them to experience a full gamut of emotions. Unfortunately it is possible for negative emotions like anger and megalomania to become dominant and cause the android to harm others."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Soong-type Android",
            "The physical and mental capabilities of a Soong-type android are superior to that of most organic or cybernetic life-forms, allowing them to ignore or resist effects like hard vacuum, disease, radiation, oxygen deprivation, telepathy, or biochemical imbalance. However, some environmental conditions, such as highly-ionized atmospheres, and electromagnetic fields, can have a severe effect. Further, Soong-type androids do not naturally have the capacity for emotions, requiring additional hardware to process and experience any feelings. The legal personhood of Soong-type androids is somewhat disputed, though a landmark case involving Lieutenant Commander Data establishes their right to self-determination.",
            "Ethical Programming Defines My Thinking",
            [TalentsHelper.getTalent("Polyalloy Construction"), TalentsHelper.getTalent("Positronic Brain")],
            "",
            []),
        [Species.Reman]: new SpeciesModel(
            Species.Reman,
            "Reman",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.CaptainsLog],
            ["Remans are a nocturnal species subjugated by the Romulan Star Empire. They are enslaved by the Empire, employed both as indentured miners within the Reman mines, and as expendable shock troops and bodyguards serving the Romulan military. Little is known about the Remans outside of the Romulan Empire, due mainly to the Romulans’ secrecy."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Reman",
            "Remans are tall, powerfully built beings, stronger and more durable even than Romulans. Their nocturnal nature means that they cannot easily tolerate bright light. A proportion of Remans have telepathic abilities, allowing them to read the minds of others and to project their thoughts to others, though using these powers effectively takes skill and training.",
            "",
            [],
            "",
            []),
        [Species.Orion]: new SpeciesModel(
            Species.Orion,
            "Orion",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant, Source.ShackletonExpanse, Source.CaptainsLog],
            ["The Orions are a paradoxical species. An Orion will be warm and welcoming to newcomers and be open to talking about a variety of topics as they get to know them. Too often this is a ruse, as Orion culture is based around seizing the advantage in all things and working out the best deals to benefit their society. Though they proudly claim to be strictly neutral in the affairs of the galaxy, the Orions are the founders of two organizations that have profoundly impacted Starfleet and other empires: the Orion Trade Union and the Orion Syndicate. Too often Orions are members of both of these organizations and the species they interact with will learn too late which group they are dealing with. Though the Orion Syndicate is a menace that is the target of dozens of law enforcement agencies, their persuasive negotiating skills and extensive criminal empire have guaranteed their continued existence.",
            "Orion society is broken down along binary gender lines. Orion females are typically the leaders of Orion society, and have evolved an advantage where their bodies secrete special pheromones that cause a hypnotic effect in males of some species. Orion males were second-class citizens for centuries and only recently gained full recognition in Orion society, though they are still most commonly seen as laborers and crew on Orion outposts and vessels. When it comes to the Syndicate, Orions prefer to let members of other species work for them; this not only guarantees that the Orion can continue their claim of strict neutrality, but they also avoid the risk of fallout from their criminal enterprises."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Orion",
            "Orions thrive in Class-M environments and are well suited to long voyages through space. The Orions are a dimorphic species where the females secrete special pheromones that can stimulate the adrenal systems of other species and make them become fascinated with them, which the Orion women have used to maintain control over not only Orion males but to manipulate other species. The pheromones produced by Orion males can generally make them seem attractive to other humanoids, but not to the same degree as that produced by Orion females.",
            "Everything is a Deal",
            [TalentsHelper.getTalent("That Wasn't Me"), TalentsHelper.getTalent("Criminal Understanding"), TalentsHelper.getTalent("Pheromones")],
            "",
            [
                { type: "Sample Names", suggestions: "Adreltosh, Brielar, D’Nesh, Kotho, Navaar, Prasad, Savarah, Shretsh" }
            ]),
        [Species.GornExt]: new SpeciesModel(
            Species.GornExt,
            "Gorn",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.BetaQuadrant],
            ["A bipedal, reptilian species from the Beta quadrant, who have a civilization — the Gorn Hegemony — far from Federation Space. First encountered by Starfleet in 2267, the Gorn are technologically advanced to a level comparable to the Federation and other Beta Quadrant powers in most regards. Even a century after first contact, there is relatively little contact between the Gorn Hegemony and the Federation."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Gorn",
            "Gorn are large and powerfully-built, even more so than other famously-mighty species such as the Klingons or Nausicaans. They are many times stronger than a human being, and resilient enough to ignore massive blunt force trauma or even short periods in hard vacuum. However, Gorn are not especially agile or fast. Gorn are ectothermic — cold-blooded — with their body temperature varying by external factors, and thus favour warm environments where they can be most active and effective.",
            "",
            [],
            "",
            []),
        [Species.Arbazan]: new SpeciesModel(
            Species.Arbazan,
            "Arbazan",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog],
            ["The Arbazan were one of the earliest civilizations encountered during Starfleet’s early ventures into deep space. Within a short time, the stoic Arbazan were welcomed into the newly-formed Federation and are considered by many to be one of its founding members, a fact the Arbazan take great pride in. Like many humanoid species within the Federation, the Arbazan are physically similar to Humans, though the forward portion of their skulls have slightly raised plates that reinforce their brows. The Arbazan are known for their conservative values, infallible self-confidence, and devotion to social protocol. Some, however, find the cultural focus on proper social etiquette to be stifling, and rebellious young Arbazan can often be found at Starfleet Academy pursuing security or ship operation roles."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Arbazan",
            "Arbazan have been Federation members since shortly after its founding and are found throughout Federation space, often serving as ambassadors, attaches, advisors, and negotiators – though there have also been several well-known scientific discoveries and engineering advancements by dedicated Arbazan.",
            "Propriety First and Always",
            [TalentsHelper.getTalent("Cold Shoulder"), TalentsHelper.getTalent("The Protocol of Politics")],
            "Arbazan names reflect their traditional natures and adherence to social protocols. They are never shortened or familiarized, favor hard syllables, but oddly do not make use of surnames. The Arbazan, of course, consider discussion of the topic to be socially unacceptable.",
            [
                { type: "Female", suggestions: "Galez, Krata, Dortas, Taxco, Kezik, Kimod" },
                { type: "Male", suggestions: " Warik, Rotes. Apocec, Berton, Tuvmil, Valbu" }
            ]),
        [Species.Arkarian]: new SpeciesModel(
            Species.Arkarian,
            "Arkarian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant],
            ["Arkarians are native to the Class-M world of Arkaria, home to the Remmler Array – an orbital facility that removes built-up baryon particles (a by-product of warp travel) – and Arkaria Base. Arkaria is a member world of the Federation and Arkarians serve throughout Starfleet and other Federation organizations. Arkaria is known for its abnormal weather patterns, resulting in extremely colorful sunrises and sunsets of every shade of green, pink, and purple as well as higherthan-normal average temperatures. The nature trails that run throughout the sweeping plains located near Arkaria Base are a common attraction for those visiting the Array or Base, especially for those wanting to see the nesting sites for horn fowls. Arkarians are physically very similar to Humans and other humanoid species – save for distinctive brow and nasal ridges. Their society has recently begun to shift away from its traditional authoritarian nobility toward the more common egalitarian systems found throughout the Federation. This is largely believed to be due to the increasing interactions between Arkarians and other Federation member worlds, though a conservative minority continues to maintain their noble holdings and social expectations."],
            [Attribute.Control, Attribute.Daring, Attribute.Reason],
            "Arkarian",
            "Direct and hardworking, Arkarians have a reputation for detail-oriented work practices and high expectations. Due to their historical authoritarian nobility, Arkarians tend to be more socially reserved than many other Federation member species and tend to be inwardly uncomfortable in social gatherings where ‘mingling’ and ‘small talk’ are expected. In addition, Arkarians are accustomed to slightly warmer climates than other humanoids and can endure higher temperatures than many other species without difficulty.",
            "Dedication and Diligence",
            [TalentsHelper.getTalent("Cool Under Pressure"), TalentsHelper.getTalent("Quick Recovery")],
            "Arkarian names are usually two to three syllables, and most often feature a prominent vowel which reoccurs in each syllable. Arkarians do not use a surname to denote family lineage, and instead include a portion of the mother’s name into the child’s.",
            [
                { type: "Female", suggestions: "Bracha, Achan, Teres, Arat, Sibinis, Urus, Latash, Saksah, Hannah, Kamala" },
                { type: "Male", suggestions: "Pemten, Vivik, Kopnon, Raksab, Navanat, Natsan, Imis, Anat, Hagan, Vilim, Sachan, Feder" }
            ]),
        [Species.Aurelian]: new SpeciesModel(
            Species.Aurelian,
            "Aurelian",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog, Source.AnimatedSeries ],
            ["One of the few avian species to be represented within the Federation, the Aurelians are renowned for their study of history and service within the Federation Science Council. While not unheard of, there are a few Aurelians serving in Starfleet, and those that do most commonly work as science officers. Aurelians dislike enclosed spaces and many suffer from a mild form of claustrophobia, which makes long-term service aboard a starship that much more difficult. Most Aurelians that pursue a career in Starfleet request assignments at planetary installations, allowing them to spend their off-duty time outdoors."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Aurelian",
            "Aurelians are capable of flight, thanks to large and muscular wings. This allows them to quickly traverse distances and avoid obstacles on the ground. They also possess keen sight and a natural directional sense based on the magnetic poles of planetary bodies. Nearly all Aurelians suffer from claustrophobia, though the severity of the affliction differs from individual to individual.",
            "Soar High and Achieve Greatness",
            [TalentsHelper.getTalent("Aerial Combat"), TalentsHelper.getTalent("Keen Senses")],
            "Aurelian names usually comprise song-like syllables with the individual’s name first and the familial or clan name second. The familial name, however, is included for tradition’s sake only – as clan divisions have long since been abolished on Aurelia.",
            [
                { type: "Female", suggestions: "Manika-Esp, Sutrial-Jon, Loisma-Ne, Pipadi-Par, Inroha-Fe, Evaasa-Al" },
                { type: "Male", suggestions: "Jorenber-Le, Aleek-Om, Pealo-Dix, Tarieel-Er, Lovalga-Li, Dueyyit-Ne" }
            ]),
        [Species.Caitian]: new SpeciesModel(
            Species.Caitian,
            "Caitian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog, Source.AnimatedSeries],
            ["The Caitian are a bipedal felinoid species with a strong history of service within Starfleet. Their homeworld of Cait is a pleasant Class-M planet with extensive grasslands that support sprawling city complexes that integrate seamlessly into the environment, for which the Caitians have great respect. While known to be extremely effective and proud warriors, the Caitian culture holds artistic and philosophical endeavors in extremely high regard."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Caitian",
            "Caitians are all slightly smaller in both height and weight than average humanoids – with most reaching between 1.5-1.7 meters. They have retained the retractable claws of their evolutionary ancestors along with a flexible tail. Caitians are carnivorous and prefer uncooked meat. While they evolved from predatory felines, the Caitians are regarded as some of the greatest poets and philosophers within the Federation.",
            "War is Instinct, Conflict an Art",
            [TalentsHelper.getTalent("Disarming Nature"), TalentsHelper.getTalent("Prehensile Tail")],
            "Caitians derive their names from their familial units, to which they have strong connections. Their names often have a near-musical quality, though most humanoid species have difficulty pronouncing them correctly – as the species generates extremely low frequency vibrations that are at the far range of Human hearing.",
            [
                { type: "Female", suggestions: "J’Aana, M’ress, S’isha, K’irst, N’Simi, H’Lata, A’Ahia, P’Erone, C’Nola, L’Eni" },
                { type: "Male", suggestions: "R’Than, C’horn, Ur’Barr, L’Enton, H’Sook, K’Raka, A’Outte, V’Wilk, A’Mathi, Z’Thors" }
            ]),
        [Species.Cardassian]: new SpeciesModel(
            Species.Cardassian,
            "Cardassian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog, Source.Core2ndEdition],
            ["There are few species as disliked or mistrusted as Cardassians. While they generate art, music, and poetry to match any other species – Cardassians are known instead for their devotion to the State, aggressive military tactics, and absolute faith in their own superiority. Advancement in Cardassian society is driven by capability and demonstrated success, resulting in an upper class of cunning and strategic individuals who expect complete devotion of their subordinates and families. While they may not be as technologically capable as the Federation, the ruthless efficiency of the Cardassian government and military has resulted in making them evenly matched with Starfleet during engagements over the last few decades."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Cardassian",
            "Cardassians are known for their dedication and discipline – mentally and culturally. With an emphasis on the superiority of the State, Cardassians are a xenophobic species, considering themselves superior to nearly all others. Many dislike them, viewing them as arrogant, intolerant, and cruel. Physically, Cardassians are similar to most species, save for slightly reduced hearing and a biological preference for hotter climates.",
            "State - Family - Self",
            [TalentsHelper.getTalent("Duty and Discipline"), TalentsHelper.getTalent("Suspicious by Nature"), TalentsHelper.getTalent("Regimented Mind"), TalentsHelper.getTalent("The Ends Justify the Means")],
            "Cardassian names consist of a personal and family name. However, Cardassians rarely, if ever, provide their family name to those they do not share a close relationship with, giving their personal name almost exclusively. Male Cardassian personal names usually are made up of two to three syllables and tend to make use of harder sounds. Female Cardassians however, often possess soft, nearly melodic names.",
            [
                { type: "Female", suggestions: "Mesha, Eskei, Asha, Brocai, Zarale, Marata, Itea, Risha, Gaska, Kosha, Alissa, Marei, Esha, Seam, Dearei" },
                { type: "Male", suggestions: "Trula, Ganem, Jolort, Setem, Dukat, Meket, Corak, Seltan, Revok, Ekoor, Hadar, Telak, Kovat, Yaltar" },
                { type: "Family", suggestions: "Priman, Aanrad, Drat, Rin, Liat, Moset, Tain, Lang, Pa’Dar, Dal, Ghemor, Belor, Prin, Oddat, Zenal" }
            ]),
        [Species.Edosian]: new SpeciesModel(
            Species.Edosian,
            "Edosian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog, Source.AnimatedSeries],
            ["Edosians are a tripedal species with three arms and three legs. While not a member of the Federation, the Edosians have a long-standing, loose alliance with the Federation since their earliest contact. It is rare, though not unknown, for Edosians to serve in Starfleet. Edosian culture tends toward inner reflection and a meticulousness with historical records. Genealogy has a much larger focus than in many other cultures, and Edosians are able to trace their individual family lines back thousands of years. Being a race that lives longer than even Vulcans, an Edosian may spend decades focused on a particular area of study before moving on to a new interest. Interesting to exobiologists, with practice, an Edosian becomes capable of allocating sections of their brain to each arm, operating independently with nearly fully focus and capability."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Reason],
            "Edosian",
            "With three legs, Endosians are somewhat slower than most humanoids, but far more stable. With three multidextrous arms, they are able to operate multiple stations or controls at the same time. They are long-lived and capable of deep thought – which others often mistake as antisocial behavior. Their long lives grant them a perspective most others lack and they are often able to recall details and facts from disciplines outside their areas of focus due to decades of exposure and broad study.",
            "Perspective Brings Understanding",
            [TalentsHelper.getTalent("Multi-Tasking"), TalentsHelper.getTalent("The Long View")],
            "Given their species evolutionary emphasis on three’s, Edosian names typically contain three syllables – though two syllable names are not entirely uncommon. Edosians do not traditionally use surnames to denote family lineages, though Edosians with the same given name will often differentiate between each other by citing their region, city, or neighborhood of birth.",
            [
                { type: "Female", suggestions: "Nitemi, Besheri, Unora, Kribara, Zamare, Cayamen, Elanwa, Matawa, Bodanie, Awiwa" },
                { type: "Male", suggestions: "Ainbelad, Arex, Ropetir, Elwomo, Cargarin, Manoko, Nusien, Joelpo, Darame, Nileber" }
            ]),
        [Species.FerengiAlpha]: new SpeciesModel(
            Species.FerengiAlpha,
            "Ferengi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant],
            ["While Ferengi have ventured through the stars in search of profit and advantageous business arrangements, official first contact with the Federation did not occur until 2364. In the following decade, Ferengi can be found nearly anywhere there is profit to made. Nearly all of Ferengi culture, government, and beliefs are based around the acquisition and retention of wealth – earning them a reputation as greedy, duplicitous, and conniving merchants and con-men. While some Ferengi are not obsessed with wealth or self-promotion, they are few and far between and are looked down upon by other Ferengi. With a society devoted to business and trade, there is little central government outside of business and regulatory functions. The Ferengi Alliance is, in reality, a collection of corporate and private businesses and their territorial holdings."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Ferengi",
            "Ferengi possess acute hearing far beyond  that of other humanoid races and are able to hear both higher and lower frequencies. However, this means that they experience severe pain at intense sound and any physical trauma to their enlarged ears. They also possess hardy immune systems, rendering them immune to many common diseases, but their small stature makes them ill-suited for intense or prolonged physical exertion and many consider them weak. Ferengi try to avoid hard labor and direct confrontation, leading to a reputation for cowardice. The structure of Ferengi brains renders them immune to telepathy.",
            "41st Rule of Acquisition - Profit is its Own Reward",
            [TalentsHelper.getTalent("Every Man Has His Price"), TalentsHelper.getTalent("Hear All, Trust Nothing"), TalentsHelper.getTalent("Knowledge Equals Profit")],
            "Ferengi names tend to range between one and three syllables, and often favor harder sounds. While Ferengi maintain reasonably strong family ties, they do not use a family or surname.",
            [
                { type: "Female", suggestions: "Bosha, Olene, Ishka, Helsel, Gela, Isall, Norvira, Vena, Ganka, Yaldis, Pav" },
                { type: "Male", suggestions: "Lexor, Nurpax, Nog, Kakag, Frector, Quark, Frink, Torta, Rom, Zek, Gigi" }
            ]),
        [Species.Grazerite]: new SpeciesModel(
            Species.Grazerite,
            "Grazerite",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant],
            ["The Grazerite are a peaceful people whose homeworld, Grazer, is one of the harsher examples of the far ends of the planetary M classification. The three main continents are predominately covered by extensive mountain ranges that reach as far as 10 kilometers above ‘sea level.’ The Grazerites’ evolutionary development has incorporated not only traditional humanoid traits – but also those of bovidae – giving them goat like physical features. Grazerites are a peaceful people with a natural sense of curiosity."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Grazerite",
            "Grazerites possess powerful jaws and durable teeth – allowing them to chew through a surprising number of hardened substances. They cannot, however, digest inorganic materials, despite being able to chew through them, and as evolutionary vegetarians, have a difficult time digesting meats. Their brows are adorned with a pair of durable horns, which slope back in the vast majority. Further, Grazerite fingers evolved from hooves and their fingernails remain extremely dense, and are capable of supporting their full weight – making them excellent climbers.",
            "Patient Study Yields the Best Results",
            [TalentsHelper.getTalent("Communal"), TalentsHelper.getTalent("Horn-Sense")],
            "Grazerite names incorporate both their given names, provided by their father, and a familial name, provided by the mother, into a single name. It is commonly, and mistakenly, believed that these are in fact two separate names. Grazerites rarely correct this mistake, believing it is rude and combative to correct strangers.",
            [
                { type: "Female", suggestions: "Milina-Summ, Photine-Mon, Maevra-Rewe, Tanti-Gome, Mintu-Tian, Natali-Leag" },
                { type: "Male", suggestions: "Anmer-Tasik, Erasmo-Tes, Saburo-Taff, Jaresh-Inyo, Zenko-Arwi, Jacus-Kelle, Luciro-Asi" }
            ]),
        [Species.Haliian]: new SpeciesModel(
            Species.Haliian,
            "Haliian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant],
            ["Haliians are native to the Federation world of Halii – renowned for its crystal formations and beautiful waterfalls. As one of the few telepathic species in the Federation, the Haliians share many of the same social nuances of other telepathic or empathic species, such as Betazoids. Haliians often find it hard to truly connect with non-Haliians, and this has the unfortunate effect of limiting their interactions with other Federation species. Due to the nature of their telepathic abilities, Haliians are either far more prone to physical contact during social encounters or avoid it entirely depending on individual in question. Haliians also share a deep fondness for holidays – of which they have many – which almost always involve music."],
            [Attribute.Daring, Attribute.Insight, Attribute.Presence],
            "Haliian",
            "Physically, Haliians are similar to other humanoid species within the Federation; however, the natives of Halii possess distinctive bulges along the bridge of their noses and just above their brows. Haliians tend to have close family bonds and numerous festivals and holidays. Much like other telepathic species, Haliians struggle with the use of deception, and will often misinterpret it during social encounters.",
            "Many sides to Every Tale",
            [TalentsHelper.getTalent("Contact Empathy"), TalentsHelper.getTalent("Faceted Attention")],
            "Haliians follow many other humanoid species with regard to naming conventions. Their given names are provided by their parents, though in Haliian culture the child’s mother has final say in the matter. Surnames are passed from father to child almost exclusively. To call a Haliian by their full name indicates both tremendous familiarity and directed frustration or anger.",
            [
                { type: "Female", suggestions: "Lympia, Nathali, Angeal, Aquiel, Camil, Laura, Sondra, Jardine, Anisa, Sabia" },
                { type: "Male", suggestions: "Franic, Goker, Rowlan, Devar, Atall, Ordst, Jayce, Valtern, Cale, Nereus, Norris" },
                { type: "Surnames", suggestions: "Mahki, Santosi, Uhnari, Kinge, Rozenn, Terzi, Abeln, Kedzi, Albini, Nani, Apito" }
            ]),
        [Species.Ktarian]: new SpeciesModel(
            Species.Ktarian,
            "Ktarian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant],
            ["The Ktarians are a physically diverse species native to the Federation world of Ktaris. They are a common sight throughout Federation space and are one of the many species that maintains its own fleet of vessels – both merchant and military. The Ktarian fleet is considered to be a reserve force, and can be transferred to the command of Starfleet during times of great need. Unlike most Federation species, the Ktarians are comprised of two separate species that evolved together on Ktaris – one whose brows are bisected into two hemispheres and the other with bone ridges along the center of the forehead. Intermarriage among these two species has resulted in both carrying the traits of the other. Predicting which traits will manifest in offspring is extremely difficult, especially when Ktarians mate with other species. Rumors circulate that the Miradorn are an offshoot of Ktarians, but the Miradorns’ reclusive nature makes this difficult to confirm."],
            [Attribute.Control, Attribute.Reason],
            "Ktarian",
            "Ktarians are a hard people, determined and relentless in pursuit of their goals. The intertwining of the two native species has led to the Ktarians possessing the best traits of both. They are physically fit and quick witted – adapting and responding to adversity with ease. They rarely engage in negotiations unless they feel they have the upper hand.",
            "Hold the Course Until the End",
            [TalentsHelper.getTalent("Deep Determination"), TalentsHelper.getTalent("Negotiate from Strength")],
            "Ktarian names are as diverse as the two interbred species that give them. Some are simple two to three syllables while others are a string consisting of as many as eight syllables. Most names follow familial or geographic traditions, though Ktarians rarely use surnames regardless of origin.",
            [
                { type: "Female", suggestions: "Nives, Etana, Milosama, Brunmohley, Jezas, Selit, Meriana, Reginalundula" },
                { type: "Male", suggestions: "Rafen, Tomishamin, Lazos, Mizan, Dukannigarm, Koolen, Barhenk, Greskrendtegk" }
            ],
            [Attribute.Fitness, Attribute.Presence]),
        [Species.Zaranite]: new SpeciesModel(
            Species.Zaranite,
            "Zaranite",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AlphaQuadrant, Source.CaptainsLog],
            ["Zaranites are a humanoid species native to a Class-K world, Zaran II, a planet of endless volcanic activity that supports a flourishing chemosynthesis-based ecosystem. The Zaranites evolved breathing the toxic volcanic gases and must wear a respirator that provides the gas mixture that would be lethal to most Federation species. In addition, Zaranites have a strong sensitivity to light due to the constant clouds of volcanic ash covering their world, and must wear special eye protection to prevent damage to their retinas."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Zaranite",
            "Zaranites are hardy and immune to toxic gases, complications due to bright lighting, and can survive the extremes conditions of the vacuum of space, so long as their respirator tanks last. In general, Zaranites are pleasant if not somewhat reserved. In addition to their service in Starfleet, Zaranites also serve in various positions within the scientific community and diplomatic corps.",
            "The Tougher the Skin, the Tougher the Being",
            [TalentsHelper.getTalent("Hardened Hide"), TalentsHelper.getTalent("Multispectrum Vision")],
            "Zaranite names are nearly unpronounceable by most species, including Humans. Complicating this issue further is the Zaranites’ reliance on respirators which distort their natural vocalizations. Ever adaptive, the Zaranites long ago adopted the use of “public names” which they provide to members of other species.",
            [
                { type: "Female", suggestions: "Doraki, Neelu, Ayami, Karis, Elensa, Irinu, Kiran, Tristi, Lyudmi, Natelani, Adelyna" },
                { type: "Male", suggestions: "Castel, Makan, Keshen, Shrive, Rayan, Perraul, Jossmah, Kantasen, Noorber, Vosgi" }
            ]),
        [Species.Argrathi]: new SpeciesModel(
            Species.Argrathi,
            "Argrathi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Argrathi consider themselves to have the most civilized and orderly culture in the Gamma Quadrant. Decades ago they eliminated their penal system by developing a series of easy to understand laws and by changing the punishment for most crimes from imprisonment to having false memories implanted in the offender’s mind so that they can serve out their sentence instantaneously but feel like they have been in prison for years. The Argrathi consider their society to be an orderly one, and this has freed them to pursue other interests such as literature and developing defensive technology. The Argrathi see upholding the law as one of the most sacred things they can do in their life, and Argrathi police officers frequently cooperate with other planets to maintain peace across the Gamma Quadrant. The only time they will refuse to follow a law is if it conflicts with the Argrathi’s established laws, which they view as sacrosanct and superior to all other legal systems. "],
            [Attribute.Fitness, Attribute.Insight, Attribute.Reason],
            "Argrathi",
            "The Argrathi are blunt and direct, with an emphasis on seeing that punishments are carried out quickly and that the Argrathi legal system knows best. Although some might claim that mistakes are made, the Argrathi’s desire to promote peace and justice has led to them being seen as one of the more reasonable races in the Gamma Quadrant. The Argrathi hope that one day all other cultures, including the Dominion, will acknowledge the superiority of their legal system. Until that day, they will follow the rules as best they can and work to insure law and order across the quadrant. ",
            "The Law is Blind But Also Fair",
            [TalentsHelper.getTalent("Absolute Conviction"), TalentsHelper.getTalent("Mind Games")],
            "",
            [
                { type: "Masculine", suggestions: "Ee'char, V-gda Ruu" },
                { type: "Feminine", suggestions: "K'Par Rinn, M'kethi Enu" },
                { type: "Gender-neutral", suggestions: "N'Mi Char, S'Geda Yuu" }
            ]),
        [Species.ChangelingGamma]: new SpeciesModel(
            Species.ChangelingGamma,
            "Changeling",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant, Source.CaptainsLog],
            ["To the people of the Gamma Quadrant, the Founders of the Dominion are shadowed in myth and legend. Few realize that the mythical Changelings from the quadrant’s distant history were in fact the same species that rules over all of the Dominion. To the people of the Alpha Quadrant, the Changelings are a grave threat and one that is very difficult to counter. They are an entire species composed of a morphogenic substance that allows them to not only take on the appearance of what they are trying to mimic but the physical qualities as well. The simplest of them can assume the forms of rocks, trees, and even simple animals like hawks and reptiles. The more experienced Changelings are able to change their forms to completely appear like the species they are mimicking, whether it is a Starfleet officer working in a top secret space station or as a shower of light that floats gently through a room. Some Changelings have even discovered the secret of interstellar travel by taking on the form of organisms that are able to enter subspace at will. Unlike other shapeshifting species throughout the Galaxy, Changelings are unique in that they can shift their molecules around and literally turn into the rocks around them, making it difficult for them to be located by all but the most intensive scans. "],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Changeling",
            "A Changeling is naturally a gelatinous orange-brown fluid, which can adopt the form and structure of any solid object, including other living creatures and diffuse substances like fog. While they cannot become energy, a Changeling’s ability to assume other forms is limited more by skill and experience than by physical capacity: it is theorized that they transfer mass to and from subspace in order to change size and density. Many Changelings find themselves persecuted by “solids” for their shapeshifting ability, and often crave a sense of order and justice in the universe, with a rigid attitude at odds with their fluid forms. ",
            "The Founders Are the Will of the Dominion",
            [TalentsHelper.getTalent("Morphogenic Matrix"), TalentsHelper.getTalent("Morphogenic Mastery")],
            "",
            [
                { type: "Masculine", suggestions: "Odo, Holak" },
                { type: "Feminine", suggestions: "Lall, Chiree" }
            ]),
        [Species.Dosi]: new SpeciesModel(
            Species.Dosi,
            "Dosi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Dosi may appear comical from a distance with their brightly painted faces and numerous markings along their skin, but they are not a race that appreciates mockery. Equally adept at being warriors as well as merchants, the Dosi are an imposing sight across trading outposts along the Gamma Quadrant. Their aggressive negotiating tactics combined with their need to not appear foolish leads to many races taking great steps not to offend them. The Dosi’s alliance with the Dominion has insured that the Dosi can roam as they please across the Gamma Quadrant as long as they do not interfere with the Dominion’s business and continue to earn them a profit. Contrary to the belief that they must only appreciate war and profit, the Dosi are excellent artists and vintners, and tulaberry wine has become an important trade good between the Alpha and Gamma Quadrants."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Presence],
            "Dosi",
            "The Dosi are a conundrum to outsiders, but their culture has lasted over a thousand years. Each Dosi paints their skin in brilliant swirling patterns of stripes and dots to denote battles they have won or great accomplishments they have achieved. The Dosi do not do things subtly, and when they walk into a room they wish to make sure that everyone has noticed that they have arrived. They consider everything to be a test of their skill, and when it comes to trade negotiations they approach each business deal with the same meticulous planning one might focus towards winning a war. ",
            "I Have Already Proven Myself the Victor",
            [TalentsHelper.getTalent("Strength and Cunning"), TalentsHelper.getTalent("Glorious Notoriety")],
            "",
            [
                { type: "Masculine", suggestions: "Inglatu, Mofala" },
                { type: "Feminine", suggestions: "Seketch, Zyree" },
                { type: "Gender-neutral", suggestions: "Ballu, Vish" }
            ]),
        [Species.Drai]: new SpeciesModel(
            Species.Drai,
            "Drai",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["A reclusive race that prefers to spend their time out exploring the universe in pursuit of their prey, the Drai are known as the Hunters to the majority of the Gamma Quadrant. Unlike other races under the control of the Dominion, the Hunters are free to roam where they please and are given significant leeway into how they manage their own affairs. Masters in the field of cloning, the Drai are responsible for the creation of the perfect prey and the perfect soldiers. It is through their genetic mastery that they created the Tosk, which proves to be the most challenging form of prey for them to stalk, and they have created the Jem’Hadar, who have proven to be the domineering fist of the Dominion for centuries. Proud, vain, and focused solely on their own affairs, the Drai pursue the Hunt as the grandest thing they can do with their lives. While success is publicly shared so too is failure, and it is not uncommon for failed Hunters to find their names spread throughout the quadrant as shameful examples for how others are to do better."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Drai",
            "The Drai care only for the Hunt and each one will wear the finest hunting gear that they can buy. Even their day to day clothing is focused more towards being fit for survival, with hidden pouches and miniaturized survival equipment being commonly found on Drai at all times. While they are on the Hunt they will often not change clothes and will spend every waking hour pursuing their prey. When they are not hunting, the Drai dedicate themselves towards maintaining peak physical fitness and train to keep their eyes and reflexes sharp. ",
            "There Are No Challenges Like the Hunt",
            [TalentsHelper.getTalent("Genetic Mastery"), TalentsHelper.getTalent("Born Stalker")],
            "",
            [
                { type: "Masculine", suggestions: "Gilga, Huru" },
                { type: "Feminine", suggestions: "Sekma, Isett" },
                { type: "Gender-neutral", suggestions: "Netyr, Coziss" }
            ]),
        [Species.Karemma]: new SpeciesModel(
            Species.Karemma,
            "Karemma",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["Honesty and integrity are cornerstones of the Karemma way of life. The unofficial merchant caste of the Dominion, the Karemma have been tasked by the Founders with regulating trade across the Gamma Quadrant. Unlike the Ferengi, who always attempt to leverage the rules to provide an unfair advantage with who they are dealing with, the Karemma prefer to deal openly and honestly. That is not to say they are naïve, and all Karemma must study hard in order to obtain high positions in the Karemma corporatocracy. Their shrewd business senses and honesty have given them a fair amount of trust by the Founders who allow them to maintain the economic workings of the Dominion. If the Karemma have a fault it is that their pursuit of honesty can often force them to enter into contracts against their will. No Karemma would be willing to dishonor themselves or their family by engaging in dishonesty, though the Karemma will always pursue strongly worded deals that benefit themselves."],
            [Attribute.Control, Attribute.Reason, Attribute.Presence],
            "Karemma",
            "The Karemmas’ tall appearance and bird-like nature causes them to stand out in a crowd, but most Karemma would prefer to be seen rather than ignored. From an early age they are taught the delicate art of appraising what they see around them, and the Karemma are able to tell an object’s true worth in a few moments of inspection. This often leads them to inadvertently offend their hosts when a Karemma, who is truly curious about the worth of objects around them, moves about the bridge of the ship and declaring how much each individual’s possessions are worth. ",
            "I See Your True Worth",
            [TalentsHelper.getTalent("My Honor Is My Shield"), TalentsHelper.getTalent("Instant Appraisal")],
            "",
            [
                { type: "Masculine", suggestions: "Hanok, Ornithar" },
                { type: "Feminine", suggestions: "Nethys, Zarestra" },
                { type: "Gender-neutral", suggestions: "Bulko, Yebesh" }
            ]),
        [Species.Lurian]: new SpeciesModel(
            Species.Lurian,
            "Lurian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant, Source.CaptainsLog],
            ["A race as well known for their fierce martial skills as they are for their artistic endeavors, the Lurians are a power whose homeworld is near the Wormhole. Though their world is controlled by the Royal Family of Luria, they are a frequent sight at outposts and trading posts across the quadrant, and their skill as navigators and warriors makes them prized members of any crew. With multiple hearts and two stomachs they require large quantities of food and their religious custom dictates that attendees at a Lurian funeral should bring plenty of food and liquor to see the dead through their journey into the afterlife. Though some Lurians have become involved in criminal endeavors such as the Orion Syndicate, they prefer to make their own way across the quadrant, and it is not uncommon to see lone Lurians happily plying their way through space on another great adventure."],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Lurian",
            "Lurians are a passionate people, and never do anything by half measure. Whether it is by devoting themselves to the arts or by trying to become the greatest pilots in the quadrant, the Lurians live with their emotions on their sleeves despite their normally impassive facial features. Lurians are always great thinkers and dreamers, and even though they may appear quiet their minds are often on important matters and on formulating plans for their futures. The Dominion War is of great interest on the Lurians’ homeworld, where their people swing from obsession with how the war will play out for their people to mild annoyance that the war is all that off worlders will talk about. ",
            "Belly Full of Song and Heart Full of Glory",
            [TalentsHelper.getTalent("Into the Breach"), TalentsHelper.getTalent("Resistant Anatomy")],
            "",
            [
                { type: "Masculine", suggestions: "Morn, Lok" },
                { type: "Feminine", suggestions: "Eltessa, Zyrionda" },
                { type: "Gender-neutral", suggestions: "Gresh, Slurr" }
            ]),
        [Species.Paradan]: new SpeciesModel(
            Species.Paradan,
            "Paradan",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant, Source.CaptainsLog],
            ["The Paradans are one of the few Gamma Quadrant races near the wormhole who have not been absorbed into the Dominion, and possess a thorough understanding of cloning techniques. Known for their reptilian appearance and their obnoxious odor, the Paradans are a resourceful species whose ability to create cloned replicants has helped them wage covert wars with their neighbors for centuries. These replicants are so exact that they will often pass undetected through bioscanners and many do not know they are replicants until their cellular structure begins to decay after they have successfully completed or failed their mission. The Paradans come from a curious culture that inspires many to leave their homeworld and travel to the Alpha Quadrant to see what it has in store for them. With their superior medical knowledge and natural ruggedness they are not afraid to travel even into dangerous warzones if only to satisfy their intense curiosity."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Presence],
            "Paradan",
            "Paradans rely upon their olfactory glands to help determine the mood of whomever they are speaking with, and they possess potent scent glands around their bodies that release potent odors. The Paradans are also physically imposing, and are able to survive comfortably in hot environments. ",
            "I Am Original and That Gives Me Strength",
            [TalentsHelper.getTalent("Replicating Past Success"), TalentsHelper.getTalent("Distracting Senses")],
            "",
            [
                { type: "Masculine", suggestions: "Coutu, Sebeksyr" },
                { type: "Feminine", suggestions: "Quetzla, Maceda" },
                { type: "Gender-neutral", suggestions: "Zeill, Shatu" }
            ]),
        [Species.Rakhari]: new SpeciesModel(
            Species.Rakhari,
            "Rakhari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Rakhari people are as resilient and stoic as their planet which has had the misfortune of seeing dozens of conflicts throughout its history. The Rakhari had just completed their twelfth of what the Terrans might call a “World War” when their current government came into being and declared the majority of crimes on their planet to be punishable by death. This tense atmosphere has led to the Rakhari to finally know peace for the first time in centuries although there is still a strong dissident movement slowly accumulating power on the planet. As more and more Rakhari take to the stars to escape their government, they are starting to become a common sight along the edges of Dominion space."],
            [Attribute.Daring, Attribute.Insight, Attribute.Reason],
            "Rakhari",
            "The Rakhari live under a strict set of laws known as the Canon. These laws were put in place over a century ago to insure strict obedience to the state but in recent years the control of the Rakhari government has lessened, allowing many Rakhari to begin to think for themselves. Though some still carry themselves in a rough and cautious manner, a growing portion of the population is starting to dream of a different kind of life and demonstrations are becoming more common as these firebrands seek to exact change upon their society. The Rakhari are primarily driven by their families, and whether it is their biological families or adopted ones they will do anything to insure the safety and survival of the group. ",
            "I Make the Rules and You Obey Them",
            [TalentsHelper.getTalent("The Truth of the Matter"), TalentsHelper.getTalent("Disciplined Mind")],
            "",
            [
                { type: "Masculine", suggestions: "Croden, Malar" },
                { type: "Feminine", suggestions: "Yereth, Etheran" },
                { type: "Gender-neutral", suggestions: "Nicihil, Heldix" }
            ]),
        [Species.Skreeaa]: new SpeciesModel(
            Species.Skreeaa,
            "Skreeaa",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Skreeaans are a people who have been oppressed for centuries and have been forced to suffer the inhumane indignity of exploitation and foreign rule. Conquered by the T-Rogorans, their culture was reduced to a servile state until the Dominion conquered the T-Rogorans in turn. Now the Skreeaans have scattered around the Gamma Quadrant with a few having managed to escape through the anomaly into the Alpha Quadrant. In exchange for a planet to colonize, several Skreeaans have brought their enduring work ethic and physical strength to help the Federation, with a few Skreeaans joining Starfleet. The Skreeaans are known for their tough, abrasive skin and their durable muscle tissue thanks to the higher than normal gravity of their former home world. Most Skreeaans are deeply religious and dream of finding Kentanna, a paradise world that the Skreeaans believe exists somewhere in the Galaxy and is a reward for their enduring untold hardships throughout their history."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Skreeaa",
            "A Skreeaan’s skin sheds routinely, causing them to leave behind skin flakes. Skreeaan females are also generally taller than males and it is not uncommon for a Skreeaan woman to have multiple husbands. Their language uses a unique syntax that takes time for some universal translators to develop a translation matrix.",
            "The Tide Always Breaks Upon the Shore and the Shore Endures",
            [TalentsHelper.getTalent("Agricultural Specialist"), TalentsHelper.getTalent("Strength Through Struggle")],
            "",
            [
                { type: "Masculine", suggestions: "Kelcho, Tumak" },
                { type: "Feminine", suggestions: "Haneek, Kachaya" },
                { type: "Gender-neutral", suggestions: "Kolden, Hartik" }
            ]),
        [Species.SonA]: new SpeciesModel(
            Species.SonA,
            "Son’a",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Son’a are a new addition to the Dominion’s ranks of allies but important to their war in the Alpha Quadrant. The Son’a are unique in that they are an off-shoot of the Ba’ku, a race of beings hailing from a planet in the sector of space known as the Briar Patch. They are a race of conquerors who had subjugated several neighboring systems into their small but powerful empire, and they were not afraid to employ weaponry such as isolytic subspace weapons which were so deadly they tore holes in subspace to release devastating waves of energy. Their use of slave labor and illegal genetic tampering meant that the Federation could not initiate trade with them although a rogue Starfleet Admiral was caught offering the Son’a assistance with a plot to drain their homeworld of its metaphasic radiation. Although some Son’a returned to their homeworld to try to start over, a large number of their race refused to give up their wealth and territory and allied themselves with the Dominion during the war. Although they make up a small portion of the Dominion’s armed forces, the Son’a fight ravenously against the Federation because they see them as having ruined their chance at immortality. Some Son’a refuse to join in their race’s vendetta against the Federation, and instead travel as traders of illicit goods."],
            [Attribute.Control, Attribute.Daring, Attribute.Insight],
            "Son’a",
            "The Son’a were once similar to humans in appearance but centuries of exile from their homeworld has led them to experiment upon themselves to stay alive. Most Son’a must spend several hours each day undergoing beautification treatments and extensive genetic modifications in order to stay alive. Most Son’a can be described as possessing a stretched appearance to their faces, while others develop painful lesions along their body. Son’a children, who are almost never permitted to leave their homeworld, are similar in appearance to the Ba’ku but possess pale skin.",
            "We Do What We Must",
            [TalentsHelper.getTalent("At All Costs"), TalentsHelper.getTalent("Particle Engineering")],
            "",
            [
                { type: "Masculine", suggestions: "Ru'afo, Soboi" },
                { type: "Feminine", suggestions: "Var'esheshka, Tu'la" },
                { type: "Gender-neutral", suggestions: "Wy'nalido, Vesh" }
            ]),
        [Species.Tosk]: new SpeciesModel(
            Species.Tosk,
            "Tosk",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The Tosk are a created race where their genome was meticulously screened, developed, and created by the race known as the Drai. Tosk are created with one purpose in mind: to serve as prey for the Drai’s Hunts. The Drai consider the Hunt to be the most important task they can ever dedicate themselves to but as a race they bored themselves on stalking lesser forms of life. This led to the creation of the Tosk, a reptilian survivor that is born with all the knowledge they need to provide a meaningful Hunt for the Hunters. They only need 17 minutes of sleep per day and their bodies can survive off simple protein chains for weeks if need be. Although the Drai like to insure that every Tosk is tracked down and captured it is not unheard of for a Tosk to go rogue from the Hunt and seek shelter among the Hunters’ enemies. These Tosk are considered outcasts among their own kind, and the Drai will do anything to bring these rogue creatures back to their homeworld where they can suffer the most horrible death of all: being kept alive, on display for the masses in a zoo where their shame is plain for all to see. The Tosk who do go rogue value their freedom too much to accept this fate willingly and will do anything to remain free."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness],
            "Tosk",
            "The Tosk are almost completely identical as their genome is often replicated from the same source material. Although some might differ due to the preferences of a Hunter’s requests, each Tosk is strong, resourceful, and cunning. When a Tosk enters a room they instinctively size up the many ways to escape as well as anything that could help them in a fight. Though the Tosk are often peaceful and do not wish to inflict harm on others, they have inborn feral instincts that allow them to fight ferociously when the need calls for it. A Tosk is often issued a simple suit that helps their memetic abilities as well as providing storage compartments for the protein mixes they are issued as a food supply. If a Tosk holds still, they can initiate their Shroud in the same manner as a Jem’Hadar soldier. ",
            "I Am Tosk",
            [TalentsHelper.getTalent("Survivor's Luck"), TalentsHelper.getTalent("Last Breath")],
            "Tosk possess no gender and often refer to themselves by their species name. Some rogues have been known to take on names that exemplify their physical skills, such as Cunning One or Everfree.",
            []),
        [Species.Wadi]: new SpeciesModel(
            Species.Wadi,
            "Wadi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.GammaQuadrant],
            ["The first species to formally introduce itself to the Alpha Quadrant and begin trade negotiations, the Wadi are a people obsessed with life and on mastering the many games it offers. They are a whimsical people, prone to bouts of rhyming and singing while at the same time demonstrating their technological superiority and intellectual mastery of multiple disciplines. Though they have yet to be absorbed by the Dominion, they are not considered a threat to its expansion, as they prefer to spend their days mastering pursuits that bring them pleasure then any kind of formal military endeavors. That does not mean they are not a significant power in the Gamma Quadrant, as their ships possess the ability to manipulate matter, covertly transport subjects without being detected, and develop complex holographic fields. Despite their achievements, they are viewed with distrust by other species who view their flighty and esoteric ways as a method of hiding their ruthlessly competitive intentions."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Presence],
            "Wadi",
            "The Wadi are mysterious, but at the same time very outgoing as a species. Prone to wearing bright colors and brilliant tattoos on their bodies, they attract attention but are experts at deflecting any real scrutiny. The Wadi are also competitive and when they feel they have been cheated, they must avenge their honor not only by crushing their opponents at whatever game or task they are at but they must teach them a lesson. Their obsession with the game of Allamaraine is used to teach both the innocent and the guilty of what it is like to cross a Wadi. ",
            "Allamaraine! Shall We Play Again?",
            [TalentsHelper.getTalent("Come With Me"), TalentsHelper.getTalent("Life is a Game")],
            "",
            [
                { type: "Masculine", suggestions: "Falow, Miranath" },
                { type: "Feminine", suggestions: "Shou'lu, Ecardra" },
                { type: "Gender-neutral", suggestions: "Kalyn, Peven" }
            ]),
        [Species.Ankari]: new SpeciesModel(
            Species.Ankari,
            "Ankari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["The Ankari are a reptilian-humanoid species native to the Delta Quadrant. While warp capable, they prefer to use a form of FTL drive, believed to phase their craft into a parallel realm – similar to, but distinct from, subspace. This realm is also home to a unique nucleogenic lifeform, whose bodies contain significant amounts of nucleogenic energy. Much like traditional subspace/warp-based civilizations, most forms of Ankari technology interface with this nucleogenic realm. As this technology is so rare, few species can accurately detect or track Ankari vessels. Despite this strategic advantage, the Ankari are not a warlike people. Their relationship with the interdimensional beings, whom the Ankari consider heralds of good fortune, has created a unique cultural dynamic. While technologically and scientifically advanced, the Ankari are traditionally a deeply spiritual people and the interdimensional beings factor heavily in that belief system. The Ankari are welcoming of strangers and are open to trade, often celebrating the conclusion of successful endeavors with a summoning to bid their new allies good fortune."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Presence],
            "Ankari",
            "Ankari are reptilian humanoids and possess many of the biological attributes common to those species. Their skin is coarse and thick, with light to dark brown coloring. Like most reptilian species, the Ankari do not possess body hair – though they do have soft spines that run along the back of their skulls. These, along with their brows, provide the Ankari with the ability to detect faint vibrations and act as a form of sixth sense. Their native, harmonic language likely developed due to this additional sense.",
            "Fortune Favors the Faithful",
            [TalentsHelper.getTalent("Favored by Fortune"), TalentsHelper.getTalent("Vibration Senses")],
            "Ankari names are generally single syllable and typically combinations of soft and hard sounds. Ankari do not use surnames or family names and instead trace their genetic lineage to a particularly important ancestor, usually one believed to be favored by the nucleogenic lifeforms called “spirits of good fortune.” There is no cultural requirement for offspring to assume the Ancestor name of their parents, though most tend to do so until they come into adulthood, at which point they can choose a new Ancestor to identify with, which is given after their personal name.",
            [
                { type: "Masculine", suggestions: "Rhal, Jrek, Kast, Hurn, Tolk, Byst, Lurr, Vurt, Pulc, Yrul" },
                { type: "Feminine", suggestions: "Lalri, Ghama, Yruki, Demre, Whagi, Sahme, Clema, Pulre, Tili, Ulua" },
                { type: "Gender-neutral", suggestions: "Atla, Fela, Nahl, Bole, Whet, Fila, Koste, Hirfa, Valit, Mal, Nulna" },
                { type: "Ancestor", suggestions: "Ohnyt, Amkut, Efna, Ursuk, Ahzur, Etol, Ofmat, Skaa, Ratka, Vulin" }
            ]),
        [Species.Jye]: new SpeciesModel(
            Species.Jye,
            "Jye",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["Across numerous sectors, the Jye are renowned for their superb administrative and organizational abilities – which they offer to other cultures for a price. Jye can be found throughout the quadrant, usually under the employ of a host species, struggling with some problem that is beyond their ability or desire to address. The Jye believe this to be the greatest export their species has to offer, and take great strides to ensure that any circumstance they’ve been retained on results in a satisfactory outcome for their employers. The Jye believe that they have a sworn duty to uphold the contracts they have been assigned to, and will work tirelessly to ensure that these business arrangements are properly governed and result in successful outcomes to the satisfaction of the employing government or culture. For the most part, the Jye are an unremarkable humanoid species, with pale skin sporting lavender spots and little to no facial hair. Due to their role as administrators and organizers, the Jye are not often exposed to manual labor or exercise."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Jye",
            "The Jye have developed a reputation for effective administration and coordination of large projects and organizations. Most are trained in this area of expertise professionally, and while Jye are capable of physical feats similar to those of Humans, they are not known for their physical attributes. Jye originate from a frigid Class-M planet at the very far edge of its star’s habitable zone. It is a world of dim solar light and cold, relentless winters, and the Jye have evolved with a resistance to the cold. Conversely, the Jye struggle more than other humanoids in hot temperatures",
            "Perfection by the Numbers",
            [TalentsHelper.getTalent("Maximized Efficiency"), TalentsHelper.getTalent("Natural Coordinator")],
            "Jye names most often follow a specific, structured pattern. Masculine names frequently utilize double consonants and are almost always two to three syllables in length. By tradition, feminine names are shorter and favor softer sounds and are rarely longer than two syllables. Due to their highly-organized society, there is very little overlap in names among genders. As is common with humanoid species, children inherit a family name from their parents, which follows the given name.",
            [
                { type: "Masculine", suggestions: "Chellick, Kollarn, Parett, Mattack, Wuttallet, Donnarrek, Sorretten, Garrek, Bennick, Charelenn" },
                { type: "Feminine", suggestions: " Jesal, Farna, Nalah, Bejal, Valona, Meris, Salah, Harena, Lalona, Jalya" },
                { type: "Gender-neutral", suggestions: " Bellah, Carru, Ettria, Gunnara, Jojjah, Moddi, Pallon, Ruddis, Urroin, Wefft" },
                { type: "Family", suggestions: "Kales, Hormal, Terrek, Questel, Corele, Volel, Foralen, Murcosta, Nertal, Ballek" }
            ]),
        [Species.LiberatedBorg]: new SpeciesModel(
            Species.LiberatedBorg,
            "Liberated Borg",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant, Source.Voyager, Source.CaptainsLog],
            ["The true power of the Borg comes from the nearly infinite number of drones that have been assimilated into the collective, like slaves of ancient civilizations. Thousands upon thousands of species have been forcibly pressed into service, their individuality stripped away in the most horrific way imaginable. For centuries, these poor souls had no hope of escape, condemned to a life of servitude aboard Borg ships, installations, and planets. Worse, once fully brought into the hive mind, they would seek out and visit the same fate upon anyone and everyone unfortunate enough to cross their path. However, in recent decades, more drones have been separated from the collective – either intentionally or by some twist of fate. Once removed from the grip of the cacophony of voices speaking as one, the identity of these lucky few can begin to resurface, allowing them an opportunity to regain the life that was taken from them. Liberated Borg, as they have become known, are as different and distinct from each other as any other individual member of a species. Some want only to return to the simplicity of existence that the collective offers, and will work tirelessly to become one with the Borg again. Others, invigorated by their release, embrace life with exuberant abandon. Regardless of their response to their new-found freedom, all must contend with the difficulties that their new life brings: rehabilitation, reintegration, and reintroduction to life as a solitary individual."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Liberated Borg",
            "As they come from many different species, Liberated Borg have little physically in common with each other, save for the remnants of their former lives. Each still retains at least some of the cybernetic implants so common to Borg drones, as not all the implants can be safely removed. The characteristics of their original species slowly begin to reassert their influence the longer the drone remains free of the collective. Borg are highly resistant to natural diseases and other ailments, but suffer a slight weakness to direct electrical shocks and exotic radiation. Those who still possess a significant number of Borg implants can even survive hard vacuum and other harsh environments, though they may still be susceptible to influence from the collective, and failing implants can be hazardous to a Liberated Borg’s health. In addition, while Liberated Borg do not sleep conventionally, they require routine access to a Borg regeneration alcove.",
            "What Does It Mean to be an Individual?",
            [TalentsHelper.getTalent("Borg Implants"), TalentsHelper.getTalent("Direct Neural Interface")],
            "Borg drones do not possess names and instead are assigned designations which represent their numerical place within their assigned section. Due to the limitation of their connectivity outside of a vinculum or other supporting network, most drones are organized into groups of about six. Because adjunct drones can increase this number to ten or more, sections which include them have higher numbers. These designations are neutral to gender and are always given as “Number-of-Number.” Liberated Borg may choose to retain their Borg designations – often because they feel disassociated from their former cultures and identities – or try to reclaim the names and lives they used to live.",
            [], [], false),
        [Species.Lokirrim]: new SpeciesModel(
            Species.Lokirrim,
            "Lokirrim",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["Few other species possess the technical acumen with holograms to match the Lokirrim. For centuries, they developed and utilized detailed holographic programs to perform countless tasks – effectively creating a taskspecific servitor race. As their holograms became increasing sophisticated, with ever evolving mental capacity, it was inevitable that a conflict would erupt. And so it did. For decades, the Lokirrim have been engaged in an ongoing civil war against their creations. The photonic insurgency has been devastating for the Lokirrim, which have become totally dependent on their creations to perform the numerous hazardous or menial tasks necessary for modern life. Unfortunately, Lokirrim photonics were not satisfied with escaping their circumstances. The insurgency has struck at Lokirrim society, using everything from civil disobedience to terror attacks to attempt to force the liberation of all photonics. The rebellion has left most Lokirrim resentful of photonic life, as they have watched their society teeter on the brink of disaster and seen many loved ones lost to the attacks carried out by their former servants. Many willingly joined the Lokirrim naval forces to track down and destroy not only those holograms that originated on Lokirr, but any independent holograms, as the Lokirrim view them as a danger to all organic life."],
            [Attribute.Daring, Attribute.Insight, Attribute.Reason],
            "Lokirrim",
            "Lokirrim are strikingly similar to Humans, save for the signature “v” shape ridge that runs from the bridge of their nose up toward their hairline. Their world is a temperate one, with mild seasons and fair weather. Unfortunately, it is also lacking in natural resources – which forced the Lokirrim to mine deep into the planet’s crust and eventually reach out into their solar system. While they may have used holograms to perform most manual labor, the Lokirrim retained their physical stature and endurance. Most Lokirrim have a deep distrust or outright aggressive response to holograms.",
            "Our Creations Will Submit",
            [TalentsHelper.getTalent("Hologram Taskmaster"), TalentsHelper.getTalent("Photonic Prosecutor")],
            "Lokirrim names are derived from a combination of syllables from their parent’s names, resulting in hybridization. Tradition provides suggestions on naming conventions; the father develops a list of various different combinations and the mother selects the one believed to most accurately reflect a child’s temperament. Various sounds often repeat generation to generation, and r’s, v’s, t’s, and k’s tend to reappear within certain geographic regions. As both parents’ names are combined, the Lokirrim have never felt the need to use a family name to denote heritage.",
            [
                { type: "Masculine", suggestions: "Artev, Vanar, Dennor, Sanak, Rusams, Junark, Gerhan, Vacten, Stesson, Elderk" },
                { type: "Feminine", suggestions: "Zeryn, Caran, Tatin, Talre, Minal, Sende, Leanden, Maydis, Shanel, Ellin" },
                { type: "Gender-neutral", suggestions: "Ramden, Nadir, Banlin, Anitel, Orlena, Karin, Cordel" },
            ]),
        [Species.Mari]: new SpeciesModel(
            Species.Mari,
            "Mari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["The Mari are a telepathic species that have only recently begun to explore the stars. While they are now known for being pacifists, the Mari were plagued by violent crime up until a few short decades ago. At that time, the Mari outlawed violent thought and introduced a procedural technique that allowed them to extract aggressive thoughts from their minds. This resulted in a drastic reduction in crime and now the Mari enjoy an almost crime-free society. Unfortunately, this technique is not always successful – and when it fails, they employ a much more invasive medical procedure that restructures the neural pathways in the brain. While many may consider this kind of “thought policing” to be a violation of basic sentient rights, the Mari believe that it is necessary to ensure the peaceful existence of their species. While welcoming to visitors, the Mari enforce their system of justice on outsiders as well as natives when such visitations result in impacts to the local populace. Aggressive species such as Klingons are likely to come into immediate conflict with the Mari who, despite their pacifistic nature, will respond if provoked."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Mari",
            "Mari are a gentle, telepathic species, who uphold a state of mental pacifism through the use of memory purging – not dissimilar to Vulcan mental conditioning. Physically they are nearly indistinguishable from Humans and possess similar physical characteristics. Their technological level is a century or more behind the Federation, though their medical techniques, especially those relating to the adjustment of thought patterns, is significantly advanced. The Mari homeworld is pleasantly temperate and, given their warm nature, could easily be a vacation spot in the quadrant – were it not for their justice system. While rare, it is not unheard of to encounter Mari off-world, though this is usually as a passenger on another species’ ship.",
            "Peace in Mind and Action",
            [TalentsHelper.getTalent("Empath"), TalentsHelper.getTalent("Passive Persuader")],
            "Mari names often include double l’s, n’s, or t’s. The birth of a child is attended by as many friends and family members as possible, and the parents name the baby after the person who provides the strongest thoughts of comfort and joy. This results in common names developing in communities and passing from generation to generation. Being telepathic, the Mari have no real need of family names as it is easy for them to pass on such information quickly with their thoughts.",
            [
                { type: "Masculine", suggestions: " Osiall, Tanel, Santill, Sharat, Trupill, Sebat, Pritt, Bennane, Meron, Maral" },
                { type: "Feminine", suggestions: " Nani, Rina, Edi, Nimira, Tirra, Katina, Minni, Talli, Ronzela, Amali, Elli" },
                { type: "Gender-neutral", suggestions: "Tonane, Norme, Ande, Sana, Nalde, Kline" },
            ]),
        [Species.Monean]: new SpeciesModel(
            Species.Monean,
            "Monean",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["Having lost their original homeworld, the Moneans were a nomadic people for generations. Centuries ago, however, they discovered a unique planetary body, an artificial world composed entirely of water. Upon this world, the Moneans settled and built an entire civilization in the shallow region near the planet’s surface. While they have created this underwater realm, most Moneans continue to live aboard their starships and only occasionally venture into the depths of their new home. Exploration of the Waters, the name the Moneans have given their adopted world, has been hampered by the crushing depths of the ocean. The Moneans only have the barest of understanding of the origin of this unique planetoid. Monean government reflects their aquatic origin, having been named the Maritime Supremacy. They maintain a reasonably powerful fleet of starships, though despite this, the Moneans have not ventured beyond more than a few hundred light-years. Ancient navigational charts have long since become outdated, and the Monean origin world has long since faded into myth."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Monean",
            "As their new world suggests, the Moneans likely evolved from an amphibioid-mammalian or other similar aquatic species. This theory is supported by their physical appearance. Monean skin coloration and markings all reflect an aquatic origin. As such, Moneans are capable swimmers and can hold their breath for an extended period. Despite this, however, Moneans require an atmosphere similar to Humans and are an air-breathing species.",
            "Space - The Greatest Ocean of All",
            [TalentsHelper.getTalent("Nomadic Heritage"), TalentsHelper.getTalent("Submariner")],
            "Moneans have always been tied to their aquatic origins. Despite centuries of life as a spacefaring civilization, Monean society remains deeply rooted in the seas. By tradition, Monean names are composed of syllables that mimic oceanic or watery sounds, as Moneans find these pleasing. Despite their nomadic nature, Moneans feel a strong bond within their close families, and family names are deeply revered, but carefully guarded. It is rare for a Monean to voluntarily give their family name, which follows their given name, to outsiders.",
            [
                { type: "Masculine", suggestions: "Hurgo, Korp, Baguk, Movok, Waguc, Berkus, Pumop, Jobol, Lalob, Burgo" },
                { type: "Feminine", suggestions: " Jula, Poho, Mamaw, Baloa, Wamah, Halola, Yahala, Kugla, Wola, Layha" },
                { type: "Gender-neutral", suggestions: "Muloh, Bahlo, Zerha, Kome, Jelah, Hurpa, Gaehe" },
                { type: "Family", suggestions: "Zulohu, Bahaho, Mowel, Ahlog, Unajal, Elgoha, Omol, Malom" }
            ]),
        [Species.Ocampa]: new SpeciesModel(
            Species.Ocampa,
            "Ocampa",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant, Source.CaptainsLog],
            ["An oddity for humanoid species, the Ocampa are an extremely short-lived people whose lifespan rarely exceeds a decade. For nearly all of Ocampan history, they have been under the protective watch of the Caretaker – a member of an extremely powerful extra-galactic civilization. At some point in the distant past, the Caretaker was responsible for rendering the Ocampan homeworld nearly uninhabitable. To attempt to atone for this act, the Caretaker then spent the following centuries ensuring the Ocampan people had everything they could need. This relationship continued until the Caretaker’s death – and as a final act, the powerful being provided the Ocampans with sufficient energy reserves to hold out for another half decade at best. While, physically, they are nearly identical to Humans, Ocampan physiology is radically different. The Ocampa only live to be roughly ten standard years old – though this can be extended significantly through advanced medical technologies. Much like insects, Ocampa development proceeds through a series of stages – alternating periods of stability and rapid aging. New-born Ocampans remain in a childlike stage for a brief year before rapidly aging and growing into pseudo-adulthood. Following this, they remain in this stage for another few years before reaching sexual maturity, a stage that lasts only a few months before fading. After this, Ocampans gradually continue to age through their adulthood before undergoing one final rapid development stage that marks their twilight. Once this occurs, Ocampa can expect to live for no more than a year or two before expiring."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Ocampa",
            "Ocampa are an interesting and unique humanoid species. Their development is more closely akin to that of insects than to Humans. Long-time support, provided by the enigmatic Caretaker, has left the species in somewhat of a socially stunted state, and their society has since become entirely dependent upon the services the Caretaker provided. When separated from this welfare state, Ocampa are curious and studious learners – voraciously devouring information with incredible speed.Further still, they are capable of truly astounding psychic feats.",
            "See All that Life has to Offer",
            [TalentsHelper.getTalent("Quick Learner"), TalentsHelper.getTalent("Telepath (Ocampa)")],
            "Ocampa tend towards one to three syllable names that use l’s, r’s, and s’s in consonant-vowel-consonant patterns. Due to their short lifespans and small population, Ocampa no longer need secondary names to denote lineage or family. As twins and triplets are fairly common, siblings often have similar-sounding names.",
            [
                { type: "Masculine", suggestions: "Ferel, Benil, Lorlaren, Dagis, Nornan, Foren, Jerden, Dulon, Kelonal, Keggis" },
                { type: "Feminine", suggestions: " Lesa, Morana, Ulona, Pala, Bella, Terres, Klaes, Rayal, Olona, Nahal" },
                { type: "Gender-neutral", suggestions: "Kelis, Das, Terel, Kalen, Talas, Fergas, Voralis, Retis, Nodas, Jonarel" }
            ]),
        [Species.Pendari]: new SpeciesModel(
            Species.Pendari,
            "Pendari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["When the crowd roars in anticipation of the next Tsunkatse match, they are usually roaring for a Pendari. Members of this species have remained the champions of this interplanetary competition due to their physical size and tenacity. The Pendari see this as a political and propaganda victory, and it propels their homeworld into a position of prominence. Pendari fighters are known for their immense physical stature and equally ill-tempered demeanor. This makes them incredibly effective combatants. Politically, the Pendari represent a minor power in their region of space, though they maintain excellent relations with many of the neighboring systems. These cultural alliances ensure that the Pendari have known extended periods of peace, and their feared warriors test themselves in the arena instead of the battlefield. While masculine Pendari are often the vision that others think of when picturing this species, other genders are equally effective in combat, though those with smaller statures focus more toward agility and finesse over raw physical power."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Pendari",
            "By their outward appearance, Pendari look to be a species of near-Humans – with hair and skin tones similar to those of Humans and other similar humanoids. They do possess strong bone and cartilage growth along the bridge of the nose and on their brows up to their hair line. The likeness, however, ends there. Physiologically, Pendari are significantly more robust, and possess redundant pulmonary and neurological systems that allow them to withstand tremendous physical punishment. This, combined with a nearly genetic predisposition to aggressive behavior, makes them natural born warriors.",
            "Victory or Death",
            [TalentsHelper.getTalent("Born to Fight"), TalentsHelper.getTalent("Robust Physiology")],
            "Pendari were once organized into feudal clans, which comprised several allied extended families. Though now outdated, the Pendari continue to identify with these historical groups and clan name always precedes a Pendari’s given name. Upon the birth of a new child, each member of the clan is allowed to propose a name and the entire clan then votes to decide on the name of their newest member. Because of this group naming method, it is common for names to be shared among the genders.",
            [
                { type: "Masculine", suggestions: "Jax, Den, Pet, Ris, Nik, Mar, Teo, Voy, Ton, Tek, Dri, Fen, Sok, Tum" },
                { type: "Feminine", suggestions: "Myral, Ancole, Elanme, Listah, Istana, Qulin, Reyge, Jestepe" },
                { type: "Gender-neutral", suggestions: "Rei, Eli, Dalvyo, Makal, Amsen, Rox, Vier" },
                { type: "Clan", suggestions: " Manu, Driras, Rettab, Chanom, Gridou, Nefic, Phinso, Menbe, Biusk" }
            ]),
        [Species.Sikarian]: new SpeciesModel(
            Species.Sikarian,
            "Sikarian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant, Source.CaptainsLog],
            ["One of the oldest and most technologically advanced species in the Delta Quadrant, the Sikarians have enjoyed hundreds of years of peace and prosperity. Warm and welcoming, the Sikarians are renowned through the region as one of the most hospitable civilizations, and deeply enjoy guests and visitors to their world. Despite their advanced capabilities, the Sikarians do not claim a large domain and instead can be found on a handful of colonies outside of their homeworld. While they maintain a small, yet powerful, fleet, they primarily rely on their advanced transporter technology, called a trajectory, to travel between destinations. Similar to the Federation, the Sikarians maintain strict rules regarding the sharing of technology and non-interference with other cultures. While this has served to cause some amount of friction between the Sikarians and their neighbors, technology like the spatial trajector relies exclusively on the unique characteristics of their homeworld and simply will not function elsewhere. Despite this, the Sikarians are a generous people, and will openly provide aid to those in need – so long as such aid remains within the provisions of the Sikarian Canon – the name given to Sikarian law."],
            [Attribute.Control, Attribute.Reason, Attribute.Presence],
            "Sikarian",
            "Physically, Sikarians are very similar to Humans and other near-Human species. They are of similar height and mass, with a similar range of skin tones and hair colors. Their utopian existence has nearly eliminated all forms of hard labor, and the Sikarians, by and large, enjoy lives of leisure. This can be seen in both their slight frames and their style of dress. Sikarians prefer loose, flowing robes and delicate wireframe headwear.",
            "Welcome All Travelers",
            [TalentsHelper.getTalent("Canonic Law"), TalentsHelper.getTalent("Riveting Storyteller"), TalentsHelper.getTalent("Well Regarded")],
            "Sikarians commonly name their children after important figures in shared stories. Because of this, the Sikarians have introduced many names from species they have encountered over the years. Traditional Sikarian names are usually composed of two syllables and favor a consonant-vowelconsonant pattern that is common in this region of space. Within the Sikarian language the sounds of “th,” “ch,” and “ll” are represented as their own letters, and thus do not break this pattern. Family names are passed down through the mother and follow a Sikarian’s given name.",
            [
                { type: "Masculine", suggestions: " Sinom, Rosar, Baret, Gathorel, Japenel, Seberal, Naderen, Kanel" },
                { type: "Feminine", suggestions: "Aldena, Halle, Kisteri, Jalelli, Corta, Suleila, Jodela, Carela, Diena" },
                { type: "Gender-neutral", suggestions: " Posel, Harge, Marce, Senel, Alanel" },
                { type: "Family", suggestions: "Otel, Labin, Solis, Tann, Almar, Miton, Moras, Goull, Mitlon, Donal" }
            ]),
        [Species.Talaxian]: new SpeciesModel(
            Species.Talaxian,
            "Talaxian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant, Source.CaptainsLog],
            ["Resilient and reliable, the Talaxians have become one of the most widely recognizable and dispersed species in the Delta Quadrant. Talaxians have been warp capable for millennia, and during this time they have encountered countless species and traveled to nearly all corners of the quadrant. Talaxians have a reputation for being sociable, good natured travelers who enjoy the company of others. Unlike other species that have been warp capable for such an extended time, Talaxians are not known for their technological capabilities – which can vary wildly from group to group. Like many species in the quadrant, Talaxians do not boast a significant military presence or large empire, though this may be due to the war between them and the Haakonian Order – a conflict that left both sides exhausted. Unfortunately, the war ended with the surrender of the Talaxian government following the detonation of a weapon of mass destruction on a Talaxian moon."],
            [Attribute.Control, Attribute.Presence, Attribute.Insight],
            "Talaxian",
            "While humanoid in most respects, Talaxians do have several interesting biological adaptations. First and foremost, Talaxians are capable of enduring heat well beyond what the average Human can comfortably tolerate and can go much longer without water. Talaxian skulls have much more pronounced ridges where the plates meet. Talaxian hair tends to be thin and wispy, and large portions of their heads are bald to allow for greater cooling. Talaxian sight is a touch less refined than that of a Human, though their senses of taste and smell are much keener.",
            "Only Fools take Risks",
            [TalentsHelper.getTalent("Being of Many Talents"), TalentsHelper.getTalent("Infectous Nature"), TalentsHelper.getTalent("Widely Traveled")],
            "Talaxian names, like all pronouns in their language, always include an “x.” Beyond this, there is no single tradition that dictates the naming of a child. Each extended family maintains its own convention on naming. Some families reuse a small number of names, generation after generation, while others refuse to use the name of someone still living. Talaxian names are often two to three syllables in length and typically favor a’s and i’s. Despite their strong family bonds, Talaxians are not known to use a family name.",
            [
                { type: "Masculine", suggestions: "Jirex, Titix, Spirox, Edix, Adax, Cantax, Maxon, Soxil, Maldaxet" },
                { type: "Feminine", suggestions: "Dexa, Palaxia, Naxie, Alaxa, Terexi, Millex, Lanexi, Axina, Emaxa, Jexa" },
                { type: "Gender-neutral", suggestions: "Xoma, Karixa, Palax, Graxe, Jonaxa, Mitxi, Adrinax" }
            ]),
        [Species.Turei]: new SpeciesModel(
            Species.Turei,
            "Turei",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["Long ago, the Vaadwaur were the undisputed masters of their region of space. But like all great empires, eventually those that they had dominated rose up and overthrew them. The foremost member of the alliance that defeated the dreaded Vaadwaur was the Turei. The Turei lost no time in filling the vacuum left by the Vaadwaur, and while they would never become as powerful or as feared, the Turei laid claim to the vast network of subspace corridors that had given their ancestral enemies their strategic edge – Underspace. For nearly a thousand years, the Turei have controlled this important territory, using it in a similar way to the Vaadwaur, with perhaps less conquest. Today, the Turei are an insular culture and protect the Underspace, and therefore their livelihood, with aggressiveness and determination. Their control of Underspace has provided them with prosperity and military supremacy on all worlds that connect to it and they jealously guard it. Vessels which stumble into Underspace through anomalies or by navigational mishaps can expect to be intercepted almost immediately and have all records of Underspace purged from their computers."],
            [Attribute.Control, Attribute.Daring, Attribute.Reason],
            "Turei",
            "The Turei are an ancient spacefaring species, once under the thrall of the Vaadwaur. The Turei are now the controlling power of the Underspace – a strange extradimensional realm. With their command of the Underspace, the Turei are powerful and feared. The Turei are a resilient species, both mentally and physically. Their skin is extremely thick and much of their body is covered with cartilage-like protrusions. Lacking a proper nose, the Turei instead possess the ability to “smell” the air through glands along their tongue, similar to a snake.",
            "No One Shall Be My Master",
            [TalentsHelper.getTalent("Deep Determination"), TalentsHelper.getTalent("Underdweller")],
            "Turei names are usually two to three syllables and frequently use double r’s and, less so, double l’s. It is commonly believed that this is in honor of Turrall, a Turei commander during the war against the Vaadwaur. While feminine Turei were traditionally given names that end with i’s or a’s, this has been falling out of favor over the last century, and unisex names are growing in popularity. Like many humanoid species, the Turei also use a familial name which follows their given name.",
            [
                { type: "Masculine", suggestions: "Bellas, Torral, Peral, Norrick, Relarr, Mariek, Berrel, Varrolik, Julear, Desteck" },
                { type: "Feminine", suggestions: "Pesta, Alerri, Estarra, Trelli, Errika, Rellen, Harrila, Jularri, Waseun, Donwani" },
                { type: "Gender-neutral", suggestions: "Busal, Derran, Warrek, Sarrvel, Kiran, Arrolen, Kenuer, Shilsen" },
                { type: "Family", suggestions: "Turell, Buhese, Kiralur, Wanoti, Kotathi, Hailova, Jailance, Madmika" }
            ]),
        [Species.Kobali]: new SpeciesModel(
            Species.Kobali,
            "Kobali",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["The Kobali are an interesting and unique species native to the Delta Quadrant. Unlike other species, the Kobali do not procreate or breed. Instead, the Kobali collect the corpses of other species and use an advanced from of genetic engineering to modify these deceased individuals, converting them into Kobali – and bringing them back to life. Culturally, Kobali are insular, though they are not openly hostile to those they encounter."],
            [],
            "Kobali",
            "The Kobali are humanoids with grayish skin and hairless heads. Their internal physiology is quite different from that of Humans. They also possess unusual tastes in food: for example, meals normally considered tasty by Humans and many humanoids are strongly disliked by Kobali. Similarly, Kobali physiology differs markedly from that of Humans. They have a six-lobed brain and a binary cardiovascular system. The effect of the genetic engineering is not reversable by Starfleet medical technology because there is not enough original DNA present after the alteration to do so.",
            "",
            [],
            "Kobali provide new names for those converted into Kobali once the reanimation process has created a new member of their species from whatever remains were used. The Kobali language is often abrupt and commonly joins words through the use of apostrophes, and this carries over to their names. As is common to many species in the Delta Quadrant, Kobali masculine names tend to be shorter than feminine names, with the former comprised of hard sounds and the latter softer. The Kobali are not known to utilize specific names to identify family units.",
            [
                { type: "Masculine", suggestions: "Q’han, T’run, Mal’ret, S’vun, A’kal, Kal’astin, Po’fel, Ta’hil, Su’lean, Ul’plat, Q’mai, Ca’ham" },
                { type: "Feminine", suggestions: "Blan’tane, Rae’theo, Pana’liode, Teuna’kaha, Elen’ilash, Clelimilia, Fion’ustina, Sawsava" },
                { type: "Gender-neutral", suggestions: "Flu’dari, Mik’tru, Ma’tee, Alda’nahi, Ora’cas, Jit’ade, Dra’ya, Ta’karhi, Aus’ashly" }
            ],
            [Attribute.Reason, Attribute.Fitness], false),
        [Species.Zahl]: new SpeciesModel(
            Species.Zahl,
            "Zahl",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DeltaQuadrant],
            ["The Zahl are well known for their friendly and welcoming natures. Amongst the Zahl there is very little hardship, as their technology has transformed their world into a paradise. While technologically advanced, the Zahl are non-combative and have no interest in aggressive expansion – but they will defend their territory if threatened by an outside force. Once, the Zahl and the Krenim were engaged in a series of conflicts that left both sides militarily exhausted. In recent decades, however, these conflicts have become nothing more than simply border disputes that rarely erupt into open hostilities. Given their technological capabilities, want amongst their people has been effectively eliminated – similar to Earth. With no desire for personal gain, the Zahl are welcoming to any peaceful species and will provide whatever aid or support they can, so long as it does not embroil them in someone else’s war. Their good nature, however, quickly fades when threatened, either personally or culturally. In these cases, the Zahl prefer to threaten retaliation before actually engaging in armed aggression, in hopes that their opponent will withdraw before the situation becomes violent."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Zahl",
            "The Zahl are advanced and enjoy the benefits of that technological capability. Having eliminated want throughout their territory, the Zahl are well known for their kind, welcoming nature and generosity. Before their world was climate regulated, the Zahl were no strangers to environmental extremes, and are capable of thriving in both extreme cold and heat. Their bodies are covered in dermal ridges that regulate their body temperature in a manner far superior to most species.",
            "Kindness Wins More Battles than Weapons",
            [TalentsHelper.getTalent("Thermal Regulation"), TalentsHelper.getTalent("Warm Welcome")],
            "Zahl children are always named after others. Mothers and fathers each contemplate someone of great influence in their lives and then name their child after them, with the child gaining two given names. As they grow into adulthood, the child then selects which name they will use as their common name. Due to this method, certain names often repeat within each Zahl family. These names are usually composed of two to three syllables and usually tend toward softer sounds, and it is very common for names to be shared among genders. A Zahl’s chosen common name is given first, then their second name, and finally the name of their family.",
            [
                { type: "Masculine", suggestions: "Degna, Ando, Tromo, Deon, Vanil, Darab, Leom, Gree, Gesur, Hanar, Lelsh" },
                { type: "Feminine", suggestions: "Persa, Halya, Dijah, Morna, Fani, Balwa, Fulna, Essa, Zare, Nalise, Pente" },
                { type: "Gender-neutral", suggestions: "Luren, Kley, Jori, Gabel, Bhana, Cirde, Amaro" },
                { type: "Family", suggestions: "Wikan, Tigh, Temb, Sami, Mahid, Remue, Dregor, Nacul, Sedet, Dalin, Ketpor" }
            ]),
        [Species.Hologram]: new SpeciesModel(
            Species.Hologram,
            "Hologram",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.Voyager, Source.CaptainsLog],
            ["Advances in holotechnology and computing in the 2370s allow for the creation of independent, virtually-intelligent holograms, far more sophisticated than the characters who populate holonovels and other recreations. Arguably, the first true example of this occurred accidentally in 2365, with the activation of a holographic James Moriarty, a simulation of a fictional character with a genuine emergent intellect. However, it took years before these advancements could be recreated deliberately. Doctor Lewis Zimmerman made the leaps that led to the creation of the Emergency Medical Hologram and its successors, the first widespread examples of this technology. Self-aware, independent holograms begin to become more common in both Starfleet and civilian contexts, though few of them seem to develop true individuality, and the matter of their legal personhood is hotly disputed in Federation courts."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Hologram",
            "Holograms can be programmed to any specification, though the nature of their holomatrix means that they are essentially impervious to direct physical harm – they can allow energy and objects to pass through them at will. However, they are unable to go anywhere that lacks holographic emitters that can project their image and forcefields, and those emitters can be damaged even if the holograms themselves cannot. Holograms also tend not to receive much respect or consideration from flesh-and-blood people, who see them as tools at best or annoyances at worst. Holograms may also have a second species trait, reflecting the species they were designed to emulate.",
            "Am I More Than My Programming?",
            [TalentsHelper.getTalent("Expanded Program"), TalentsHelper.getTalent("Mobile Emitter")],
            "",
            []),
        [Species.KlingonQuchHa]: new SpeciesModel(
            Species.KlingonQuchHa,
            "Klingon (QuchHa’)",
            [Era.Enterprise, Era.OriginalSeries],
            [Source.KlingonCore],
            ["In 2154, a lethal, metagenic strain of the Levodian flu ran rampant through the Klingon Empire, infecting vast numbers of Klingons. Though a cure was eventually devised, the combination of the plague’s metagenic effects and the cure itself led to numerous physiological and genetic changes in those afflicted, most notably the dissolution of their cranial ridges and a number of neurological alterations, to a point where they somewhat resemble Humans, with these changes passed onto the descendants of those afflicted. These altered Klingons came to be known as QuchHa’, \"the unhappy ones,\" for their seeming deformity, while those who escaped the plague's effects were commonly referred to as the HemQuch. Though still hardy and vigorous, the QuchHa’ tend to express the customary aggression of their culture as a ruthless cunning, and they are often regarded as less honorable and trustworthy. They join the armed forces and intelligence services in great numbers to prove their worth and gain glory as a result of this discrimination. By the early 2270s, almost all QuchHa’ had undergone corrective treatment to restore their Klingon physiology, and Klingons in later eras refuse to discuss the matter with outsiders."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Klingon and QuchHa’",
            "Those Klingons affected by this metagenic plague are frequently discriminated against or regarded as cowardly, shameful, or un-Klingon in nature, a stigma that they frequently strive to disprove, or which frees them to take actions that other Klingons may not regard as proper. Their altered genetics leave them less susceptible to a number of diseases and disorders that affect Klingons but allows them to contract a number of Human diseases that Klingons are normally immune to.",
            "",
            [TalentsHelper.getTalent("Cruel"), TalentsHelper.getTalent("Superior Ambition"), TalentsHelper.getTalent("To Battle!"), TalentsHelper.getTalent("R'uustai"), TalentsHelper.getTalent("Warrior's Spirit"), TalentsHelper.getTalent("Killer's Instinct")],
            "",
            [
                { type: "Male", suggestions: "Be'etor, Cheng, Mogh, Qeng, Torgh" },
                { type: "Female", suggestions: "a'Setbur, HuS, lurSa, Mara" }
            ]),
        [Species.Akaru]: new SpeciesModel(
            Species.Akaru,
            "Akaru",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ShackletonExpanse],
            ["A sentient humanoid species indigenous to the planet Setu within the Shackleton Expanse, the Akaru are relative newcomers in developing warp technology and are only just starting to explore nearby systems and the interior of the Expanse. They are a highly competent and curious species, and are eager to meet and trade with beings from other cultures and worlds. Their global leader and religious icon, Iryax Nedaon, actively encourages technological development oriented toward space travel and stellar exploration, and regional universities have increased the number of degree programs in related fields of study.",
            "While a population of 1.3 billion generally should not be described by one word, a common note through all Akaru society is that of efficiency. Their cities, vessels, farms, and processes are all designed toward maximizing resources, space, and personnel. That dedication to communal efficiency permeates Akaru relationships as well, sometimes to a given relationship’s potential detriment. If a family determines that the whole would be rendered more efficient by adding or removing specific individuals, adjustments are carried out, often with the assistance of trained counselors, in order to mitigate potential complications and ensure a successful and efficient family unit."],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Akaru",
            "The Akaru are a bipedal, mammalian species that resembles Romulans and Vulcans to some extent – possessing copper-based blood and slightly pointed ears – but as a whole have more widely-set eyes, more robust physical frames, and generational instances of digital fusion or vestigial webbing between fingers and toes. Their mindset is something of a blend of Romulan and Vulcan perspectives – Akaru are an enthusiastic and passionate species who embrace efficiency of thought and operation, with a keen focus on the betterment of all, be it the individual, the family, or the entire Akaru culture.",
            "Never Knowingly Engage in Inefficiency",
            [TalentsHelper.getTalent("A Better Path"), TalentsHelper.getTalent("Charming Demeanor")],
            "Akaru tend to have a proper name and a secondary name that represents one of their parents or a beloved member of their extended family; the individual’s profession; or perhaps a location relevant to the individual, whether it is a specific continent, region, island, or city.",
            [{ type: "Sample Names", suggestions: "Curate Belar, Dajala of the Mallan Valley, Postulant Herikhet, Gravek ir’Loval, Mediator Ruia, First Engineer Wallea" }]),
        [Species.CalMirran]: new SpeciesModel(
            Species.CalMirran,
            "Cal-Mirran",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ShackletonExpanse],
            ["A race of peacemakers birthed by lightning on an oceanic world, the Cal-Mirran people have evolved to seek balance in the midst of extremes. They are crystalline, water-based life-forms held together by a bio-electric charge, able to shift their state of matter at will. Cal-Mirrans are a deeply spiritual people who are known for analytical theorizing, meticulous ethics, and abstract art. While unity is a core value of Cal-Mirran society, a small minority choose to reside away from civilization in the planet’s harshest climes. This division, and the unrest it occasionally sows, tests the equity-focused civil system on which Cal-Mirrans pride themselves."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Cal-Mirran",
            "Cal-Mirrans are graceful, adaptive, persistent, and highly analytical. They have strong logic skills and excel at long-term problem solving. Because their bodies can shift states, they can tolerate extremes – heat, cold, pressure, vacuum – but are sensitive to vibration and certain types of radiation, which can disrupt the cohesion of their consciousness. Since their physiology is crystalline, physical injuries (separation of body mass) reduce dexterity and speed.",
            "Peaceful Persistence",
            [TalentsHelper.getTalent("Water Glassing"), TalentsHelper.getTalent("Time Refraction")],
            "Cal-Mirran names tend to sound smooth and flowing, like water. Hyphens are often used to splice together imagery, as in Hal-yorith, meaning “coldest light.” Cal-Mirrans will typically adopt a color word surname corresponding to the hue of the sky they saw when they first awoke.",
            [{ type: "Sample Names", suggestions: "Alodon Ray (awoke at the Ray), Tin-darinel Red (awoke in the Twilight Band), Sorma-cue Prism (awoke under an aurora sky), Dal-tivoran Grey (awoke during a storm)" }]),
        [Species.Qofuari]: new SpeciesModel(
            Species.Qofuari,
            "Qofuari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ShackletonExpanse],
            ["These egalitarian people from the planet Lilafas are generally unassuming and content, happy to do whatever chores are necessary to support their modest tribal lifestyles while keeping ample time free to be alone in quiet philosophical reflection or to pursue recreational activities with family and friends. Many devote their free time to pure research, imagining technology far in advance of what they use in real life. This is not merely the wishful thinking of science fiction, however, but the detailed mental imaging, down to the tiniest detail, of fully realizable apparatuses; from tricorders to warp engines, they carry three-dimensional blueprints and schematics in their minds as easily as other species recall what they ate for breakfast.",
            "Members of the Future Builders faction, most of whom are part of the younger generations of Qofuari, are more outgoing and wish to construct the high-tech devices not allowed by tradition. Once the Qofuari encounter the Federation, some Future Builders request leave from their homeworld to explore the Beta Quadrant and beyond."],
            [Attribute.Fitness, Attribute.Insight, Attribute.Reason],
            "Qufuari",
            "Qofuari tend to live in harmony with each other and their environment. They are natural swimmers and nimble climbers. Their mental capacity is huge, allowing them to think through complicated problems in their minds before taking action.",
            "Everyone is Equal",
            [TalentsHelper.getTalent("Mental Imaging"), TalentsHelper.getTalent("Nimble")],
            "Qofuari names are not strictly gendered. They eschew surnames, but multiple names are common, consisting of a parentally given name followed by a personally chosen name and, sometimes, a name given by friends. These secondary and tertiary names can change throughout a Qofuari’s life, usually accompanied by a ceremony. If an identifier beyond such names is necessary, tribal affiliation serves the purpose, and is often geographical in origin, resulting in full names like Liloo Shining of the Quiet Sea.",
            [
                { type: "Parental or Chosen Names", suggestions: "Lilong, Shileth, Falloo, Grithal" },
                { type: "Friend Names", suggestions: "Shining, Louder, Quiet Laugh" },
                { type: "Tribal Names", suggestions: "Green Isle, Quiet Sea, Broken Mountains" }
            ]),
        [Species.VinShari]: new SpeciesModel(
            Species.VinShari,
            "VinShari",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ShackletonExpanse],
            ["The VinShari are the dominant humanoid species in their system within the Shackleton Expanse – and they are spreading out. Highly adaptable, utilizing the spaceborne Ha’kiv beings as an energy resource, the VinShari saved themselves from self-annihilation and went from their first space flight to warp speed in under a century. Organic technology is woven into every part of VinShari life as is their artistry and history. The VinShari have the capacity to be friendly or brutal, but everything they do is from a position of strength, and with an innate desire to dominate.",
            "The Order of the Midajah-Ka believe in power through knowledge and information rather than brute force, and only resort to violence when necessary.",
            "Members of the Ar-Ka-Se faction are unlike other VinShari: they believe harvesting Ha’kiv is morally wrong, and they actively resist the VinShari government. They also believe the VinShari mandate of dominance and power will ultimately lead to the destruction of their species. The Ar-Ka-Se see cooperation and peaceful coexistence as the only viable options in a growing galactic community."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "VinShari",
            "HuntedaspreyintheirearlyhistorycausedtheVinSharitobecomeevolutionary survivors. Psychologically, they learned to thrive and adapt in stressful situations. Physically, the VinShari have bone collars they use for self-defense. They are resistant to most forms of radiation, have a robust immune system, can see into various visual spectrums, and have perfect night vision. Traditional VinShari see the Galaxy through their evolutionary lens and believe they must dominate to survive. Other VinShari, like the Ar-Ka-Se, believe in equal coexistence.",
            "Power is Our Birthright!",
            [TalentsHelper.getTalent("Silent Scream"), TalentsHelper.getTalent("Vocal Gymnastics")],
            "VinShari names incorporate a given name bestowed by their mother and the continent of their birth. The given name usually has three syllables, and the surname is made up of the first two letters of their continent of origin. The VinShari assign masculine, feminine, and gender neutral names according to the family pod.",
            [
                { type: "Continents", suggestions: "Argia, Kasai, Sema" },
                { type: "Sample Names", suggestions: "Jolias-Ar, Kameko-Ka, Ellian-Se" }
            ]),
        [Species.IQosa]: new SpeciesModel(
            Species.IQosa,
            "I’Qosa",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.IdwYearFive],
            ["The I’Qosa are an aquatic species native to the planet I’Qos. They are humanoid but also possess some physical features reminiscent of Earth’s aquatic species. I’Qos is an oxygen-rich M-Class world with high humidity. The chemical makeup of its atmosphere renders communications and transporter technology ineffective. The crew of the U.S.S. Enterprise made first contact with the I’Qosa near the end of the Enterprise’s five-year exploratory mission under the command of Captain James T. Kirk. First contact unfolded when a Tholian web ensnared both the Enterprise and an I’Qosa ship, requiring the Enterprise crew to work with Ayal, the lone I’Qosa survivor, to escape.",
            "I’Qosa live in the seas of their home planet, and they share a deep, almost spiritual relationship with the waters, which grant the I’Qosa powerful healing abilities. I’Qosa society centers around the Crest, a living ecosystem at the bottom of the ocean that can be summoned as a powerful protector during times of peril. The concept of fluidity forms the cornerstone of I’Qosa culture. Individuals routinely change various aspects of their identities, including their genders and their roles in larger I’Qosa society. The idea of remaining a single gender for an entire lifetime puzzles I’Qosa, and their understanding of freedom revolves around their ability to change identities, or “flow” from one identity into another.",
            "Not all I’Qosa subscribe to this philosophy, however. Some believe fluidity causes disorder and leave the waters to live permanently on the dry land of I’Qos. These I’Qosa gradually lose their ability to change their identities, instead becoming “calcified” in a single state of being. These I’Qosa are called Lo’Kari.",
            "I’Qosa and Lo’Kari leaders have managed to share the planet in relative peace, but tensions between the two factions ignited into a crisis shortly after the Enterprise returned Ayal to their home planet. The Enterprise crew attempted to mediate negotiations between the two parties, but the talks descended into chaos. Open war broke out on I’Qos. The Lo’Kari unleashed war machines called sea burners in an attempt to dry out the I’Qosa. The I’Qosa retaliated by attacking with the full power of the Crest. The war raged on as the Enterprise was forced to leave orbit."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "I’Qosa",
            "I’Qosa are an aquatic species. They can spend limited amounts of time in dry environments, though they prefer to do so wearing specialized EV suits containing water. The I’Qosa embrace the concept of fluidity in all facets of their identities. They can change their name, gender, and – to some extent – their appearance at will. This ability depends on recent contact with the renewing waters of their homeworld. If an I’Qosa spends an extended period away from the waters of their homeworld, they take on the trait Calcified. This trait locks the character into their current identity and prevents them from flowing into new ones. The trait can be removed if a character returns to the waters of I’Qos in time, but the trait can become permanent if the character spends too long outside the water. The Lo’Kari are a faction of I’Qosa who choose to live permanently calcified on land.",
            "",
            [TalentsHelper.getTalent("Looking for a Fight"), TalentsHelper.getTalent("Waters of Renewal"), TalentsHelper.getTalent("Zero-G Swimmer")],
            "",
            [{ type: "Sample Names", suggestions: "Ayal, Balatera, Bryni, Talaha, Prizah, Phelina, Urchalar, Vorcani" }]),
        [Species.Iotian]: new SpeciesModel(
            Species.Iotian,
            "Iotian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.IdwYearFive],
            ["Iotians are a humanoid species native to the planet Sigma Iotia II. Their physical features resemble those of Humans in most respects. The starship Horizon made first contact with the Iotians in 2168. At that time, the Iotians were a pre-warp society, but they demonstrated great intelligence and a talent for imitation. The Horizon’s crew left behind a number of books, including a volume on the history of organized crime in Chicago. This book became a formative document for Iotian society. The Iotian people modeled their entire way of life on Chicago’s mobster underworld, and endless gang wars erupted across the planet.",
            "The U.S.S. Enterprise visited Sigma Iotia II in 2268, and several members of the Enterprise crew became entangled in gangland plots and power plays. Dr. Leonard McCoy mistakenly left his communicator on the planet when the Enterprise departed the system, unleashing an entirely new wave of cultural contamination among the planet’s populace.",
            "This time, the Iotians accessed data files contained in the communicator to learn about Federation and Earth history, and they reverse engineered the communicator’s transtator technology. These experiments allowed the Iotians to make enormous technological leaps. They began experiments with warp technology, though they achieved only limited success. The Iotians also remade their society yet again, this time using Earth’s representational democracies as their guide. Just as the Iotians did with mobster culture, they exaggerated certain key elements of Earth’s representational democracies. For instance, the Iotians held presidential elections every six weeks, leading to discontinuity and dysfunction in the planet’s governance.",
            "The Iotians thought of the Enterprise crew as founding fathers of their democratic movement as a result of the Starfleet officers’ role in introducing these political concepts to Iotian society. Upon returning to Sigma Iotia II near the end of the Enterprise’s five-year mission, Spock decided to run for the Iotian presidency to defuse a sudden political crisis on the planet. Upon winning the election, Spock immediately abdicated the office after suggesting several reforms to stabilize the Iotian government."],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Iotian",
            "Sigma Iotians largely resemble Humans in appearance. They possess keen intellects and a natural proclivity for imitation.",
            "",
            [TalentsHelper.getTalent("Campaign Fatigue"), TalentsHelper.getTalent("Imitative")],
            "",
            [{ type: "Sample Names", suggestions: "Grak, Jamek, Krako, Marcon, Mose, Okmyx, Pocks, Tocsty, Vapel" }]),
        [Species.Tholian]: new SpeciesModel(
            Species.Tholian,
            "Tholian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.IdwYearFive, Source.CaptainsLog],
            ["Tholians are a nonhumanoid, crystalline-based species with six thin legs and a dome-like head atop the torso. Tholians evolved in a high-temperature, methane-rich atmosphere and their life-support requirements differ widely from those of most humanoid species. Accordingly, Tholian characters must wear protective EV suits if they intend to spend lengthy periods of time on a Federation starship or space station. Exposure to cooler environments causes their exoskeletons to crack and eventually shatter. Their language, composed of high-frequency chirps and squeals, can render the Universal Translator unreliable. Tholians possess a high level of technology, and their use of Tholian webs, or high-energy nets that can entrap vessels, are formidable weapons.",
            "The Tholians played a central role in Aegis’s plot to plunge the Galaxy into permanent stasis in order to prevent further expansion of the United Federation of Planets. The crew of the U.S.S. Enterprise rescued a Tholian child from the rubble of an abandoned outpost on the planet Lloyd Zeta- 9, setting off a volatile diplomatic crisis."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness],
            "Tholian",
            "Tholians possess crystalline exoskeletons that grant them 2 resistance and allow them to withstand vacuum for extended, though not unlimited, periods of time. Tholian exoskeletons also transmit radiation that can be modulated, or sensed, by other Tholians. This can act as a form of communication, similar to telepathy, though the full extent of this ability varies by individual.",
            "",
            [TalentsHelper.getTalent("Crystalline Telepathy"), TalentsHelper.getTalent("Immune to Vacuum"), TalentsHelper.getTalent("Radiation Burst")],
            "Tholian names are usually unpronounceable by non-Tholians.",
            []),
        [Species.Kelpien]: new SpeciesModel(
            Species.Kelpien,
            "Kelpien",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryS1S2, Source.DiscoveryCampaign, Source.CaptainsLog],
            ["A sentient humanoid species indigenous to the planet Kaminar, Kelpiens live in an agrarian society. Elders are the leaders of the Kelpien culture, passing down knowledge and history through stories. One of these stories speaks of The Great Balance, a belief that by culling members of their species, the Kelpiens would have peace with the Ba’ul; a powerful species that would hunt their people to extinction if the Kaminar population got out of hand. This meant that when a Kelpien started going through their physiological change known as Vahar’ai, they would be brought in front of the All-Seeing Eye and culled, releasing them from the pain and threat of mental instability, as well as keeping the Great Balance in check.",
            "Commander Saru discovered that the Vahar’ai was actually a natural physical change that made his people expert hunters. The culling and the Great Balance were both lies forced unto the Kelpiens by the Ba’ul. Eventually, the crew of U.S.S. Discovery helped the Kelpiens rise up against the Ba’ul and break free of the lies they had been told for generations."],
            [Attribute.Control, Attribute.Fitness, Attribute.Insight],
            "Kelpien",
            "The Kelpiens are a bipedal species that are adapted to living on land and in the water. Kelpiens are able to run at considerable speeds for short bursts and can see into the ultraviolet and infrared spectrums of light. Pre-Vahar’ai / Post-Vahar’ai. When created, choose one of these two traits. If Pre-Vahar’ai is chosen, and your character ever experiences the changes that come with Vahar’ai, the trait is replaced by the Post-Vahar’ai trait.",
            "The Great Balance Must Be Achieved",
            [TalentsHelper.getTalent("Threat Ganglia"), TalentsHelper.getTalent("On All Fours")],
            "Kelpiens tend to have just a single name.",
            [{ type: "Sample Names", suggestions: "Brinna, Dor’na, Kaladar, Lin’lev, Su’Vyn, Trialla, Tuvu, Vilara" }]),
        [Species.Barzan]: new SpeciesModel(
            Species.Barzan,
            "Barzan",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign, Source.CaptainsLog],
            ["Hailing from a resource-poor world, the Barzan are a species known for their stubbornness and their ability to accomplish great things despite the advantages other species may have. Their homeworld’s atmosphere is considered toxic to other species and the Barzan require specialized breathing apparatus to exist in different environments. Despite their homeworld’s lack of resources, the Barzan are diligent in carrying out their duties, believing that their greatest natural resource will always be their determination. This has made them respected by some civilizations for their hard work and their ingenuity with accomplishing tasks. Barzan are especially focused on their families, and believe that it is the duty of each Barzan family to take each other’s burdens upon themselves in order for the group to succeed. The Barzan have a keen mind toward acquiring resources that they believe will benefit their family and their people, and are constantly looking for lucrative trade deals or scientific advancements that may help uplift their people as a whole."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Barzan",
            "The Barzan have long struggled to make do without some of the advantages other species benefit from, but this has turned into one of their greatest strengths. A Barzan takes on each task with their full focus and determination while keeping a keen eye for not only how to accomplish the task but to do so with as few resources as possible. To the Barzan, any resources not spent in this way can be used in the future to help benefit their family or crew. The Barzan also form close bonds with their crewmates, and are willing to sacrifice their own needs if it benefits the group as a whole.",
            "My Greatest Resource Is Myself, and I Will Use It Wisely",
            [TalentsHelper.getTalent("Expert Quartermaster"), TalentsHelper.getTalent("Unyielding Resolve")],
            "Barzan tend to have a given name and surname, though often use only their given name.",
            [{ type: "Sample Names", suggestions: "Amma, Attis, Bhavani, Nhan, Ryess, Servu, Tolpra" }]),
        [Species.Osnullus]: new SpeciesModel(
            Species.Osnullus,
            "Osnullus",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign, Source.CaptainsLog],
            ["The Osnullus hail from a homeworld that has only recently begun to shed their caste-based society. Once beholden biologically to queens who governed their individual colonies, Osnullus have evolved to a stage where they are more independent minded and are capable of breaking away from their colonies. Though some still prefer to cling to the castes of their births, the Osnullus have embraced independence and the concept of the individual. Since joining Starfleet, the Osnullus can now be seen across the Alpha Quadrant where they embrace the close communities of their starships as new colonies for them to live in. Some species find the Osnullus method of eating to be disturbing, as their lack of mouths means they absorb their food through specialized feeding ports within their fingers."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Osnullus",
            "The Osnullus exemplify being at peace with themselves as much as they do coexisting with others. They are able to notice changes in the behavior of their friends and crewmates while also being able to exist on their own. The Osnullus prize their independence and there is nothing more abhorrent to them than the subjugation of others against their will. They see working toward the same goal as something that others should strive for, but being coerced into doing so makes them want to rebel against it.",
            "I Am as Strong Apart as I Am with Others",
            [TalentsHelper.getTalent("Born to a Task"), TalentsHelper.getTalent("Unreadable Face")],
            "Osnullus tend to have just a single name.",
            [{ type: "Sample Names", suggestions: "Aemmo, Hivfa, Rahma, Srwell" }]),
        [Species.Xahean]: new SpeciesModel(
            Species.Xahean,
            "Xahean",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign, Source.CaptainsLog],
            ["Believing themselves to have been created at the exact moment their world was, the Xaheans are a species who have achieved a great level of technological advancement in a short amount of time. Capable of manipulating technology instinctively and possessing numerous self-defense mechanisms such as spines and the ability to render themselves almost invisible, the Xaheans have recently begun to experiment with dilithium crystals and warp technology. Their culture is currently at odds with their most principal beliefs ever sincethey discovered the power of dilithium; once dedicated to the belief of balance in all things, they now have become obsessed with advancing themselves technologically and commercially to the point of inflicting damage upon their homeworld. The appointment of their new queen may bring hope that balance can be restored to the Xahean way of life."],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Xahean",
            "The Xaheans are technologically gifted as a species, to the point that they often appear smug in the face of technological advancements by other species. When they encounter a technology unfamiliar to them, they adapt quickly to its uses and seek out ways to construct devices of their own. Their innate ability to manipulate energy fields allows them to activate many different types of machinery in their proximity, and their ability to shroud themselves in a field that obscures their appearance allows them to remain undetected from pursuers.",
            "Balance Between Oneself and the World Around You.",
            [TalentsHelper.getTalent("Discerning Scientific Mind"), TalentsHelper.getTalent("Camouflage Field")],
            "Xaheans tend to have names consisting of several short names, and often allow non-Xaheans to refer to them by one of them.",
            [{ type: "Sample Names", suggestions: "Caler No Fi Dafili, Drex Dar Mala So Lesk, Foto Mri Ka Se Wachi, Me Hani Ika Hali Ka Po, Vinters Saba Ra Ke Fa Nobi" }]),
        [Species.Saurian]: new SpeciesModel(
            Species.Saurian,
            "Saurian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign, Source.CaptainsLog],
            ["The Saurians are new members of the Federation and are still taking time adjusting to the norms of being aboard Federation starships. With their native language being a series of clicks, chirps, and growls, the universal translator sometimes has problems translating Saurian speech into Federation Standard. They are a physically imposing species, with large eyes capable of seeing long distances and an advanced sense of smell. They are welcome additions to landing parties and away teams because of their ability to be resourceful in almost any environment. Their culture stresses prudence and consideration in all things, though if a Saurian is pushed into conflict, they will respond ferociously. Saurians are omnivores, and frequently enjoy meals consisting of bamboo, fish, and dried insect casings."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Saurian",
            "Saurians possess enhanced senses that are often superior to their colleagues. With six nasal canals, they can pick up scents from kilometers away and their sharp fangs and claws make them imposing. As a civilization, they respect strength and decisiveness but prefer to avoid aggression if at all possible. Saurians also possess a high tolerance for alcohol, and Saurian brandy is prized throughout the Alpha and Beta Quadrants.",
            "Consider Carefully, Then Act Decisively.",
            [TalentsHelper.getTalent("Enhanced Metabolism"), TalentsHelper.getTalent("Hunter’s Senses")],
            "Due to the shape of their mouths and how their native tongue is spoken, Saurians often pick a name in Federation Standard that they like and do not mind being referred to as. They often choose their favorite historical figure or a name that sounds pleasing to them. Saying a Saurian’s proper name correctly will always be endearing to them but they understand if other species struggle to do so.",
            [{ type: "Sample Names", suggestions: "Vk’chk’tk (Victoria), Sh’larlst (Shae), Gr’hsk-ha’sha (Gaius), Lss’t-kel’sar (Linus)" }]),
        [Species.CyberneticallyEnhanced]: new SpeciesModel(
            Species.CyberneticallyEnhanced,
            "Cybernetically Enhanced",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign, Source.CaptainsLog],
            ["These individuals are not a species unto themselves but a classification. The Federation possesses advanced technology that can be used to repair or improve the bodies of those who have become injured or been devastated by disease. These augmentations are often very risky, as not every species is capable of undergoing the process of having portions of their anatomy replaced with machinery. Other species are not able to adjust to the process, with their own bodies rejecting the machinery over time. These augmentations go beyond replacing a missing limb and involve large-scale replacement of the epidermis, musculature, and even portions of the nervous system with state-of-the-art computers and electronics that adapt to the individual’s physiology and replace their natural function. Though these cybernetics do their best to compensate for the loss of their organic components, some among the augmented would prefer to retain their original body parts.",
            "Cybernetically-enhanced characters are always mixed-species characters – their original species, and their new status as a cybernetically-enhanced individual."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Cybernetically Enhanced",
            "Though most cyborgs still consider themselves to be members of their original species, there are some who cannot help but face the reality that every day they are alive is thanks to the machinery installed in their bodies. They embrace their reality with stoicism and with determination to prove to others that they are more than just a combination of organic and cybernetic parts but are living beings in their own rights. Some even come to fully embrace the advantages their new components can offer them and use it to leverage an advantage over others.",
            "Artificial but Still Alive.",
            [TalentsHelper.getTalent("Synthetic Physiology"), TalentsHelper.getTalent("Analytical Recall")],
            "Based on the name conventions of the original species.",
            [], [], false),
        [Species.Baul]: new SpeciesModel(
            Species.Baul,
            "Ba'ul",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.DiscoveryCampaign],
            [],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Ba'ul",
            "",
            "We Will Never Again Be Food for Kelpiens",
            [],
            "",
            [], [], false),
        [Species.Romulan]: new SpeciesModel(
            Species.Romulan,
            "Romulan",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.PicardS1, Source.CaptainsLog, Source.Core2ndEdition],
            ["The Romulans are a cultural offshoot of Vulcans, descended from a faction of early Vulcans who left their original homeworld millennia ago. These ancestors, who “marched beneath the Raptor’s wings”, did not adopt the stoicism and logic espoused by the Vulcan leader Surak, and would later settle the twin worlds of Romulus and Remus. The Romulans’ prevailing culture is one of secrecy; anyone could be an enemy, so concealing motives, actions, and vulnerabilities are central to survival. A Romulan only trusts their closest kin, with increasing layers of secrecy, obfuscation, and misdirection as relationships grow more distant. The Romulan Star Empire was long regarded as paranoid, even isolationist, for non-Romulans are trusted less than even the most suspect Romulans.",
            "Physically, Romulans are like Vulcans, differing in numerous small ways, and while many Romulans demonstrate a V-shaped ridge on their foreheads, this is far from a universal trait. The specifics of these differences aren’t well-known by non-Romulans; Romulans do not share information if it can be helped, and the Federation didn’t know the shared origin of Vulcans and Romulans until over a century after first contact between Humans and Romulans."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Romulan",
            "Romulan physiology is not meaningfully different from that of Vulcans, though a portion of the Romulan species exhibits a V-shaped forehead ridge not evident in Vulcans. The largest differences are that most Romulans lack the intense mental discipline common to Vulcans, and do not develop their psychic abilities. Psychologically and culturally, Romulans prize cunning and strength of will, and are distrustful of other species: this opinion is reciprocated, as Romulans have a reputation for manipulation, deception, and betrayal.",
            "To Die in The Service of my People",
            [TalentsHelper.getTalent("Guile and Cunning"), TalentsHelper.getTalent("Wary")],
            "Romulan names are personal and wrapped up in secrecy. Romulans tend to have a single name they use openly, a private name they use amongst family, and a true name used only with those they give their hearts to.",
            [{ type: "Sample Names", suggestions: "Alidar, Ayel, Bidran, Bochra, Chulak, D’Tan, Donatra, Hiren, Kabath, Karina, Kimara, Koval, Laris, Letant, Lovok, M’ret, Mendak, Mirok, N’Raj, N’Vek, Neral, Pardek, Rakal, Rekar, Setal, Sirol, T’Rul, Taibak, Tal, Tal’aura, Taris, Telek, Tenqem, Tokath, Toreth, Valdore, Vrax, Zhaban"}], [], false),
        [Species.Apergosian]: new SpeciesModel(
            Species.Apergosian,
            "Apergosian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["Apergosians are bipedal humanoids with orange skin and hair. They also have rectangular pupils that grant them greater depth perception and focus with their peripheral vision.",
            "The species treats numbers with reverence and respect, always looking to find perfect numbers that future generations could be proud of. This passion for numbers leads many Apergosians to pursue mathematics and the philosophical impact of number sense.",
            "Before the Apergosians inherited their planet, it was inhabited by a people they refer to  as the Ancient Ones. These deific creatures used something the Apergosians refer to as “strange energies” to build cities, create art, and manipulate physics. Some Apergosians have combined the idea of the Ancient Ones and the concept of numbers into a faith many Apergosians prescribe to."],
            [Attribute.Control, Attribute.Presence, Attribute.Reason],
            "Apergosian",
            "Apergosians have great peripheral vision due to their rectangular pupils. Because of this trait, Apergosians reduce the Difficulty of opposed tasks that rely on sight by 1.",
            "Numbers are More than a Quantity",
            [TalentsHelper.getTalent("Residual Strange Energies"), TalentsHelper.getTalent("Number Sense")],
            "All Apergosians use names similar to those found on Earth, with first names identifying an individual and surnames representing their family.",
            [{ type: "Sample Names", suggestions: "Jenza Furth, Mighal Lamtur, Ezzery Vath, Borba Grondo"}]),
        [Species.Cetacean]: new SpeciesModel(
            Species.Cetacean,
            "Cetacean",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["Native to Earth, the cetaceans are one of numerous species indigenous to the planet. For much of the species’ history, they lacked means of verbal communication with land-dwelling life-forms on the planet, a situation which may have continued perpetually if humanity had not developed universal translator technology. As one of the first species to benefit from the advent of extra-species communication, cetaceans were able to foster a better working relationship with the land-dwelling Humans.",
            "Cetaceans are somewhat rare in the Federation, in no small part due to much of the Academy’s facilities still being tailored for terrestrial species, often lacking aquatic capabilities. Despite this, cetacean species have found themselves valued contributors to starships; their sensory capabilities and instinctive understanding of navigating three-dimensional locations often finds their contributions to both navigation and communications vital. Despite this, few cetacean species ever care to leave the comfort of their environmental chambers — when a cetacean lives their entire life in three dimensions, trying to move in two can cause excessive nausea even in the most adventurous-minded."],
            [Attribute.Daring, Attribute.Insight, Attribute.Reason],
            "Cetacean",
            "This cetacean species possesses fins and a tail, a smooth skin which reduces friction while swimming, and a layer of blubber which regulates internal temperature in cold liquid environments. Although quick and agile in water, cetaceans are generally lacking in hind legs, requiring adaptive suits to navigate outside of liquid- based environments. Although they typically dwell in water, they require air to breathe and circulate oxygen through their body before expelling it from a nostril-like blowhole located on their back.",
            "Our Work Can be Fun and Rewarding if We Have the Right Attitude",
            [TalentsHelper.getTalent("Three-Dimensional Thinking"), TalentsHelper.getTalent("Song of the Ocean")],
            "Cetaceans tend to possess two names; one which is transmitted to other cetacean species via sonar communication and is therefore unpronounceable by most terrestrial species, and a ‘given name’ which is typically given by their closest non-cetacean friends.",
            [{ type: "Sample Names", suggestions: "Kimolu, Matt, Regis, Jogani, Nickie"}]),
        [Species.Clicket]: new SpeciesModel(
            Species.Clicket,
            "Clicket",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["Formally a member of the Klingon Star Empire, Clickets are an insectoid race who despise gratitude. In fact, the species often see gratitude as an insult and even as an act of war.",
            "After decades of being insulted when the Klingons called them “Honorable,” the Clickets formulated a plan to leave their disrespectful masters. The Clickets used the distractions of the Klingon and Dominion Wars to build ships and find a suitable home elsewhere. Knowing how stubborn the Clickets were, the Klingons decided to let them leave without interfering so they didn’t have to deal with the exhausting war declarations that came every time the species was complimented."],
            [Attribute.Insight, Attribute.Fitness, Attribute.Presence],
            "Clicket",
            "Clickets live together in colonies on ships which they refer to as nests. Their exoskeleton is resilient and must be shed once a year. The gamemaster may rule that this means a Clicket has Resistance 1, or avoids dangers that would pierce a softer-skinned creature’s flesh.",
            "Gratitude Shows Us We Can’t be Successful on our Own",
            [TalentsHelper.getTalent("Thickened Carapace"), TalentsHelper.getTalent("Communication Pheromones")],
            "Clicket names are usual a series of clicks and chirps. The initial clicks represent the individual’s nest and the chirps that follow are associated with each individual Clicket. Starfleet’s universal translator has converted the clicks and chirps into letters and syllables.",
            [{ type: "Sample Names", suggestions: "Chk-trall, Krv-lill, Vrv-Jykk, Brk-Chuun, Mrd-Vikk"}]),
        [Species.Exocomp]: new SpeciesModel(
            Species.Exocomp,
            "Exocomp",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["Originally designed as self-directing maintenance workers, Exocomps eventually evolved to sentience by rewriting their own codes to become more efficient. The process of recognizing the Exocomps’ sentience took a while, but it eventually became clear that they were making logical choices to survive and eventually even developed personalities.",
            "Exocomps come prefabricated with micro- replicators which they use to create the tools and attachments they need to complete a job. A by-product of this system is the ability to create new circuit pathways that effectively give Exocomps the ability to create memories and learn new skills.",
            "Through interactions with Starfleet, Exocomps were eventually recognized as sentient artificial life-forms who were even able to create and understand both family structures and friendship. Though they are still trying to understand the concept of humanoid emotions, some have formed a bond with other Exocomps that are so strong, they create the parts for new Exocomps together and assemble it as a new life-form. Many engineers and scientists believe this is how the Exocomps solved the problem of reproduction and breeding, moving them even closer to true living organisms."],
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            "Exocomp",
            "Exocomps are technological life-forms who can crawl across the ground or hover for short periods of time. They are experts at repairing damage. With a built-in micro-replicator, Exocomps are rarely caught without a tool they need. The gamemaster may rule that this means an Exocomp never suffers a penalty for lacking the right tools, or may waive the Opportunity cost of specialized equipment.",
            "Always Use a Sufficiently Adequate Tool",
            [TalentsHelper.getTalent("Enhanced Thrusters"), TalentsHelper.getTalent("Extra Power Supply")],
            "",
            []),
        [Species.Gorn]: new SpeciesModel(
            Species.Gorn,
            "Gorn",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign, Source.CaptainsLog],
            ["A race of bipedal reptiloids with faceted eyes, the Gorn are organized under a Hegemony ruled by a king or a queen. Gorn are extremely durable due to their rubbery skin and thick bone structure. Equipped with claws and a mouth filled with backwards-curved teeth, Gorn are a formidable adversary on the field of battle."],
            // Jim Johnson confirmed that the Lower Decks book has a typo: whereas it says that the third attribute
            // is "Insight", it should be "Reason", to be consistent with the Beta Quadrant and Captain's Log books.
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Gorn",
            "Gorn are tall, powerfully- muscled, and can often overpower members of other humanoid species. They are believed to be obligate carnivores, and many species tend to react to the presence of Gorn with an instinctive fear or revulsion which is difficult to overcome. For their part, Gorn tend to have little regard for how others react to them.",
            " I Will Protect My Crew as though They are My Family",
            [TalentsHelper.getTalent("Carnivorous Reptilian Physiology"), TalentsHelper.getTalent("Throw Anything"), TalentsHelper.getTalent("Gorn Royal Bloodline")],
            "Gorn typically use single names that are hard and raspy. Usually using multiple of the same letter in a row, these names are given to a Gorn shortly after their clutch hatches.",
            [{ type: "Sample Names", suggestions: "Ssar, Kraassk, S’tazzan, Trrusk, V’karrn"}]),
        [Species.Kaelon]: new SpeciesModel(
            Species.Kaelon,
            "Kaelon",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["The Kaelons are a bipedal, humanoid species hailing from Kaelon II. Appearing Human but having dark lines on the sides of their heads, Kaelons were also immune to telepathic and empathic intrusions. Primarily isolationists, Kaelons knew little about surrounding space and cultures.",
            "Most Kaelons participated in a social practice known as The Resolution. This practice required Kaelons to ritualistically end their lives when they reached the age of sixty. This practice was designed to keep their society going as caring for the elderly became a tremendous burden. Those that do not partake in The Resolution are usually ostracized along with their family."],
            [Attribute.Daring, Attribute.Insight, Attribute.Reason],
            "Kaelon",
            "Kaelons possess an organ called a telebellum attached to their brains that makes them immune to telekinetic and empathic reading. This structure manifests as dark lines beneath their skin on both sides of their head.",
            "I Must Complete My Work Before The Resolution",
            [TalentsHelper.getTalent("Resolution-Bound"), TalentsHelper.getTalent("Evolved Telebellum")],
            "Masculine Kaelon names usually use a consonant followed by an apostrophe and the rest of the name. This naming convention is related to their family name and the consonant is often removed forever if the male is ostracized. Feminine names are often two syllables and short, typically ending with a vowel.",
            [{ type: "Sample Names", suggestions: "Sara, Tara, Colo, Rina, Bulu, B’trist, T’shin, R’Lars, Trist, Shin, Lars"}]),
        [Species.Pakled]: new SpeciesModel(
            Species.Pakled,
            "Pakled",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign, Source.CaptainsLog],
            ["Pakleds are a corpulent, bipedal species who have eyebrows that swoop up their foreheads and skin flaps beneath their eyes. There is still much being learned about Pakled physiology which somehow allows them to survive the vacuum of space. A Pakled is adept at processing information, though this can take extended periods of time and multiple inputs before the information is fully processed.",
            "Pakleds seek to make themselves strong and powerful, typically adapting and combining the technologies of other species together to help them do so. Adapting the technology takes many attempts and failures before it works, but once these adaptations work, they are surprisingly successful."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Insight],
            "Pakled",
            "For reasons unknown to themselves or the Federation, Pakleds are immune to the effects of vacuum. The medical mystery still baffles the greatest xenobiologists.",
            "Pakleds are Strong",
            [TalentsHelper.getTalent("Make It Go"), TalentsHelper.getTalent("Too Stubborn to Die")],
            "Pakleds take short, aggressive names that represent their power.",
            [{ type: "Sample Names", suggestions: "Grunog, Trendur, Morgug, Rangorg, Dendinor, Frondog"}]),
        [Species.Tamarian]: new SpeciesModel(
            Species.Tamarian,
            "Tamarian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign, Source.CaptainsLog],
            ["Tamarians are bipedal humanoids with long nostrils and ear holes on the sides of their heads. A bony ridge runs from the top of their nose and over the top of their heads. Two smaller ridges usually run along the side of their heads, over their ear holes. Tamarians are hairless and have thick, milky-white blood. Their thumbs are long in proportion to the rest of their fingers and have a sucker-like tip on the end.",
            "Tamarians have a complex language that uses historical and mythological metaphors to describe their feelings and to explain their actions. This language shows a tremendous connection to the stories and actions of their ancestors. In addition, Tamarians participate in sleeping rituals and death rituals that pay homage to their ancestors. These rituals include objects that Tamarians carry with them, including a ceremonial dagger."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "Tamarian",
            "The tips of Tamarian thumbs act like a sucker and helps to maintain a tight grip on objects, especially their ritual daggers. Unless they choose otherwise, Tamarians cannot be disarmed.",
            "Kazi’s Children, Their Faces Wet",
            [TalentsHelper.getTalent("Learn From the Past"), TalentsHelper.getTalent("Storyteller")],
            "Because of their attachments to names and events, no two Tamarians have ever had the same name. This practice ensures that there isn’t confusion about whose actions are referenced in their language. Typically, a Tamarian’s name is two syllables though there have been three and four syllable names throughout their history and mythology.",
            [{ type: "Sample Names", suggestions: "Varlok, Trayshun, Rinduk, Shileez, Grandor, Norak"}]),
        [Species.Kzinti]: new SpeciesModel(
            Species.Kzinti,
            "Kzinti",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign, Source.CaptainsLog, Source.AnimatedSeries],
            ["Kzinti are bipedal felines who typically have orange fur and yellow eyes. With sharp fangs and claws along with ears that resemble the structure of bat wings, Kzinti are amazing hunters and eat only meat.",
            "After centuries of battle against the Caitians, the Klingons, and even the Federation, the Kzinti were crippled by the Dominion during the war. With no other options, the Kzinti signed truces with their former enemies, allowing their people to join Starfleet and even the Klingon Defense Force. During this time, the Kzinti also began a female rights movement where their women were no longer thought of as “dumb animals” and were elevated to both political and military positions."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Kzinti",
            "Kzinti physiology is designed to make them expert predators. In addition, Kzinti possess superior hearing and balance compared to many other species.",
            "",
            [TalentsHelper.getTalent("Hyper Agile"), TalentsHelper.getTalent("Pathfinder"), TalentsHelper.getTalent("Cat-Like Reflexes"), TalentsHelper.getTalent("Applied Force"), TalentsHelper.getTalent("Telepath (Kzinti)")],
            "",
            [{ type: "Examples", suggestions: "Chuft-Captain, Chuft-Warrior, Flyer, Healer, Mechanic, Taylor, Telepath Srith, Gunner, Fth-Captain, Arm-of-the-Hamstringer"}]),
        [Species.Anabaj]: new SpeciesModel(
            Species.Anabaj,
            "Anabaj",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.LowerDecksCampaign],
            ["This lizard-like species has reptilian eyes and a frilled membrane that pops up from around its neck. It also has pointy teeth and a forked tongue which allows them to smell with a modified Jacobson organ.",
            "Anabaj often seek humanoid hosts to lay their eggs in and can make people think that they look humanoid in order to gain their trust. Some Anabaj have even developed telepathic abilities which makes them dangerous enemies for a weak- minded individual."],
            [Attribute.Control, Attribute.Fitness, Attribute.Insight],
            "Anabaj",
            "Anabaj have sticky pads on their feet and hands that allow them to climb vertical surfaces without needing a task to do so. This trait only works if the Anabaj isn’t wearing hand and feet coverings.",
            "",
            [TalentsHelper.getTalent("Telepathy (Anabaj)"), TalentsHelper.getTalent("Embed Egg"), TalentsHelper.getTalent("Alluring Vision")],
            "",
            []),
        [Species.Aenar]: new SpeciesModel(
            Species.Aenar,
            "Aenar",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog, Source.ContinuingMissions, Source.FederationKlingonWar, Source.Core2ndEdition],
            ["The Aenar were a subspecies of Andorians who were on the verge of extinction by the mid-22nd century. They had two antennae and no skin or hair pigmentation. Their most distinctive trait was their telepathic abilities, which included reading minds and psychically projecting themselves into the minds of other humanoids."],
            [Attribute.Control, Attribute.Insight, Attribute.Presence],
            "",
            "",
            "",
            [TalentsHelper.getTalent("Telepathic Interference"), TalentsHelper.getTalent("Telepath"), TalentsHelper.getTalent("Empath"), TalentsHelper.getTalent("Acute Senses"), TalentsHelper.getTalent("Chosen Speaker")],
            "",
            [{type: "Sample Names", suggestions: "Ataria, Hemmer, Dhaleb, Jhamel, Gareb, Zuonna, Mehen"}]),
        [Species.Bynar]: new SpeciesModel(
            Species.Bynar,
            "Bynar",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog, Source.ContinuingMissions],
            ["Over time their interconnection with their world’s master computer has grown to the point that their language and thought patterns have become as close to binary as is possible for organic beings. In fact, their very lives depend on this interaction with their master computer, as well as with one another. They are shorter in height than most humanoids, genderless with lilac skin and enlarged skulls, and usually operate in pairs."],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Bynar",
            "Despite their small size, Bynars are physical robust and durable. Their augmentations allow them to communicate instantaneously with their twin while in the same system, sharing all sensory input. However, they are vulnerable to electromagnetic pulses, which can disable or destroy their implants, leaving them disoriented or even disabled.",
            "There are only ever two choices",
            [TalentsHelper.getTalent("Networked"), TalentsHelper.getTalent("Paired"), TalentsHelper.getTalent("Unpaired")],
            "",
            []),
        [Species.Doopler]: new SpeciesModel(
            Species.Doopler,
            "Doopler",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog],
            ["A humanoid species known for involuntarily duplicating themselves (dooplercating) as a defense mechanism against uncomfortable emotions such as embarrassment. Once a Doopler gains control of their emotions, they can re-merge back into one being (de-dooplercating)."],
            [Attribute.Fitness, Attribute.Presence, Attribute.Insight],
            "Doopler",
            "",
            "",
            [],
            "",
            []),
        [Species.Horta]: new SpeciesModel(
            Species.Horta,
            "Horta",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog],
            ["The Horta is a highly intelligent, silicon-based species capable of tunneling through solid rock."],
            [Attribute.Fitness, Attribute.Presence, Attribute.Reason],
            "Horta",
            "",
            "",
            [],
            "",
            []),
        [Species.Illyrian]: new SpeciesModel(
            Species.Illyrian,
            "Illyrian",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog],
            ["A spacefaring humanoid species that utilizes genetic engineering to adapt their bodies to the new planets they settle, rather than changing the planet to suit themselves."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Illyrian",
            "",
            "",
            [],
            "",
            []),
        [Species.Kazon]: new SpeciesModel(
            Species.Kazon,
            "Kazon",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog],
            ["An aggressive warrior species from the Delta Quadrant divided into eighteen different sects that war over resources. They have intricate head ridges and thick, coral-shaped hair."],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Kazon",
            "",
            "",
            [],
            "",
            []),
        [Species.Suliban]: new SpeciesModel(
            Species.Suliban,
            "Suliban",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.CaptainsLog],
            ["The Sulibans’ distinguishing physical characteristic is their mottled, greenish-tinted skin. Most of them are nomadic. One faction of Suliban are members of the Cabal and can alter their DNA and restructure their skeletons, giving them unique chameleon-like, shapeshifting abilities and enhanced senses."],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness],
            "Suliban",
            "",
            "",
            [],
            "",
            []),
        [Species.Aquan]: new SpeciesModel(
            Species.Aquan,
            "Aquan",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AnimatedSeries],
            [],
            [Attribute.Control, Attribute.Daring, Attribute.Reason],
            "Aquan",
            "",
            "",
            [TalentsHelper.getTalent("Underwater Acrobat"), TalentsHelper.getTalent("Aquatic Mutation")],
            "",
            [{ type: "Examples", suggestions: "Bala, Cadmar, Ceros, Domar, Inida, Platan, Rila, Tyda"}]),
        [Species.Pandronian]: new SpeciesModel(
            Species.Pandronian,
            "Pandronian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AnimatedSeries],
            [],
            [Attribute.Control, Attribute.Fitness, Attribute.Insight],
            "Pandronian",
            "",
            "",
            [TalentsHelper.getTalent("Triple Threat"), TalentsHelper.getTalent("Colony Creature")],
            "",
            [{ type: "Examples", suggestions: "Ari bn Bem, Cala vn Rem, Hari yn Elm, Shari yn Yem, Tesa bn Ray, Pami en Fel, Vara yn Hal, Lura bn Zel, Dav on Hon, Edre bn Zed"}]),
        [Species.Phylosian]: new SpeciesModel(
            Species.Phylosian,
            "Phylosian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AnimatedSeries],
            [],
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            "Phylosian",
            "",
            "",
            [TalentsHelper.getTalent("Toxic Familiarity"), TalentsHelper.getTalent("Omnidirectional Vision")],
            "",
            [{ type: "Examples", suggestions: "Agmar, Bragan, Buxus, Cedrus, Dianth, Ilex, Nanthen, Rudbek, Wortek, Zala"}]),
        [Species.Skorr]: new SpeciesModel(
            Species.Skorr,
            "Skorr",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.AnimatedSeries],
            [],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness],
            "Skorr",
            "",
            "",
            [TalentsHelper.getTalent("Reconnaissance Flight"), TalentsHelper.getTalent("Talons")],
            "",
            [{ type: "Examples", suggestions: "Alar, Eeklah, Perecik, Ral, Scithaal, Tchar, Vicith, DesYog"}]),

        [Species.Arcadian]: new SpeciesModel(
            Species.Arcadian,
            "Arcadian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.FederationKlingonWar],
            [],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Arcadian",
            "",
            "",
            [TalentsHelper.getTalent("Immense Self-Discipline"), TalentsHelper.getTalent("Rapid Data Assimilation")],
            "",
            [{ type: "Sample Names", suggestions: "Tryoll Curr, Shaesonn, Fweel Kohl, Jen-Jen Jorr, Hyul Vonb"}]),
        [Species.Ariolo]: new SpeciesModel(
            Species.Ariolo,
            "Ariolo",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.FederationKlingonWar],
            [],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Ariolo",
            "",
            "",
            [TalentsHelper.getTalent("Powerful Frame"), TalentsHelper.getTalent("All in Due Time")],
            "",
            [{ type: "Sample Names", suggestions: "Zerkes, Cliatta, Ostomo, Jennio, Coltebatta"}]),
        [Species.Betelgeusian]: new SpeciesModel(
            Species.Betelgeusian,
            "Betelgeusian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.FederationKlingonWar],
            [],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Betelgeusian",
            "",
            "",
            [TalentsHelper.getTalent("Verbal Warfare"), TalentsHelper.getTalent("Strength of the Elders")],
            "",
            [{ type: "Sample Names", suggestions: "Cosmo Traitt, Yor, Jelfrit, Badakar, Shor Malkune"}]),
        [Species.Coridanite]: new SpeciesModel(
            Species.Coridanite,
            "Coridanite",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.FederationKlingonWar],
            [],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Coridanite",
            "",
            "",
            [TalentsHelper.getTalent("Intention Detector"), TalentsHelper.getTalent("Radiation Resistant Anatomy")],
            "",
            [{ type: "Sample Names", suggestions: "Os’ir, Kal, Kalev, Traeg, Pachangara, Se’khet"}]),
        [Species.Megarite]: new SpeciesModel(
            Species.Megarite,
            "Megarite",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.FederationKlingonWar],
            [],
            [Attribute.Control, Attribute.Fitness, Attribute.Presence],
            "Megarite",
            "",
            "",
            [TalentsHelper.getTalent("Thick Skin"), TalentsHelper.getTalent("Master of Aquatic Engineering")],
            "",
            [{ type: "Sample Names", suggestions: "Vroo er Shuul, Hwuel yal Etuu, Waa vo Wahr, Ayees Etarr, Mehirn Vwaa"}]),

        [Species.ElAurian]: new SpeciesModel(
            Species.ElAurian,
            "El-Aurian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Fitness, Attribute.Insight, Attribute.Presence],
            "El-Aurian",
            "",
            "",
            [TalentsHelper.getTalent("Listener"), TalentsHelper.getTalent("Wisdom of Years"), TalentsHelper.getTalent("The Long View"), TalentsHelper.getTalent("Temporal Awareness"), TalentsHelper.getTalent("Cultural Flexibility")],
            "",
            []),
        [Species.Yridian]: new SpeciesModel(
            Species.Yridian,
            "Yridian",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Yridian",
            "",
            "",
            [TalentsHelper.getTalent("Listener"), TalentsHelper.getTalent("Wisdom of Years")],
            "",
            []),
        [Species.Hupyrian]: new SpeciesModel(
            Species.Hupyrian,
            "Hupyrian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Hupyrian",
            "",
            "",
            [TalentsHelper.getTalent("Vow of Silence"), TalentsHelper.getTalent("Dolbargy Healing Trance")],
            "",
            []),
        [Species.Talarian]: new SpeciesModel(
            Species.Talarian,
            "Talarian",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Control, Attribute.Daring, Attribute.Fitness],
            "Talarian",
            "",
            "",
            [TalentsHelper.getTalent("Trained from Birth"), TalentsHelper.getTalent("Talarian Cruelty"), TalentsHelper.getTalent("The B'Nar")],
            "",
            []),
        [Species.Tzenkethi]: new SpeciesModel(
            Species.Tzenkethi,
            "Tzenkethi",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Daring, Attribute.Fitness, Attribute.Reason],
            "Tzenkethi",
            "",
            "",
            [TalentsHelper.getTalent("Extra Arms")],
            "",
            []),
        [Species.Tiburonian]: new SpeciesModel(
            Species.Tiburonian,
            "Tiburonian",
            [Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Insight, Attribute.Presence, Attribute.Reason],
            "Tiburonian",
            "",
            "",
            [TalentsHelper.getTalent("Technological Savvy"), TalentsHelper.getTalent("Tiburonian Charm")],
            "",
            []),
        [Species.Napean]: new SpeciesModel(
            Species.Napean,
            "Napean",
            [Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.ContinuingMissions],
            [],
            [Attribute.Control, Attribute.Insight, Attribute.Insight, Attribute.Reason, Attribute.Reason],
            "Napean",
            "",
            "",
            [TalentsHelper.getTalent("Engineering/Science Affinity (Unofficial)")],
            "",
            []),



        [Species.Nausicaan]: new SpeciesModel(
            Species.Nausicaan,
            "Nausicaan",
            [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
            [Source.None],
            [],
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            "Nausicaan",
            "",
            "",
            [TalentsHelper.getTalent("Listener"), TalentsHelper.getTalent("Wisdom of Years")],
            "",
            []),



        //[Species.Romulan]: new SpeciesModel(
        //    "",
        //    [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32],
        //    Source.,
        //    "",
        //    [Attribute., Attribute., Attribute.],
        //    "",
        //    "",
        //    "",
        //    [],
        //    "",
        //    []),
    };

    getAllSpecies() {
        let result = [];
        for (let archetype in this._species) {
            let spec = this._species[archetype];
            result.push(spec);
        }
        return result;
    }

    getSpecies(characterType: CharacterType) {
        let species: SpeciesModel[] = [];
        for (let archetype in this._species) {
            let spec = this._species[archetype];

            const hasEra = (spec.eras.indexOf(store.getState().context.era) > -1) || (spec.id === Species.Klingon && characterType === CharacterType.KlingonWarrior);
            const isSourceAvailable = hasAnySource(spec.sources);

            if (hasEra && isSourceAvailable && !this.ignoreSpecies(spec.id)) {
                species.push(spec);
            }
        }

        return species.sort((a, b) => {
            return a.localizedName.localeCompare(b.localizedName);
        });
    }

    getPrimarySpecies(type: CharacterType, excludeSpeciesBasedOnOtherSpecies: boolean, character: Character) {
        if (type === CharacterType.KlingonWarrior) {
            var species: SpeciesModel[] = [];

            var klingonSpecies = store.getState().context.era === Era.NextGeneration ? [
                Species.Klingon
            ] : [
                Species.Klingon, Species.KlingonQuchHa
            ];
            for (var archetype of klingonSpecies) {
                var spec = this._species[archetype];

                const hasSource = hasAnySource(spec.sources);

                if (hasSource && !this.ignoreSpecies(archetype)) {
                    species.push(spec);
                }
            }

            return species.sort((a, b) => {
                return a.localizedName.localeCompare(b.localizedName);
            });
        } else if (type !== CharacterType.Starfleet && Character.isSpeciesListLimited(character) && character.typeDetails != null) {
            let alliedMilitary = (character.typeDetails as AlliedMilitaryDetails).alliedMilitary;
            let species = alliedMilitary.species.map(s => this._species[s]).filter(s => hasAnySource(s.sources) && !this.ignoreSpecies(s.id));
            return species.sort((a, b) => {
                return a.localizedName.localeCompare(b.localizedName);
            });
        } else {
            let candidates = this.getSpecies(character.type);
            return excludeSpeciesBasedOnOtherSpecies ? candidates.filter(s => s.isMixedSpeciesAllowed) : candidates;
        }
    }

    getSpeciesByType(species: Species): SpeciesModel {
        let model = this._species[species];
        return model;
    }

    getSpeciesByName(name: string) {
        for (var sp in this._species) {
            var spec = this._species[sp];

            if (spec.name === name) {
                return spec.id;
            }
        }
        return undefined;
    }

    getSpeciesTypeByName(name: string) {
        let result = undefined;
        for (let species in this._species) {
            if (name === Species[species]) {
                let speciesModel = this._species[species];
                result = speciesModel.id;
                break;
            }
        }
        if (result === undefined && name === Species[Species.Custom]) {
            result = Species.Custom;
        }
        if (result === undefined && name === "Kelpian") { // backward compatibility for spelling mistake
            result = Species.Kelpien;
        }
        return result;
    }

    generateSpecies(characterType: CharacterType = CharacterType.Starfleet): Species {
        if (characterType === CharacterType.KlingonWarrior && store.getState().context.era === Era.NextGeneration) {
            return Species.Klingon;
        } else if (characterType === CharacterType.KlingonWarrior) {
            let roll = Math.floor(Math.random() * 20) + 1;
            // it doesn't appear that there are any real rules for this.
            return roll <= 5 ? Species.KlingonQuchHa : Species.Klingon;
        } else {
            let roll = Math.floor(Math.random() * 20) + 1;
            let species = Species.Human;

            switch (store.getState().context.era) {
                case Era.Enterprise: {
                    switch (roll) {
                        case 1:
                        case 2:
                            species = Species.Andorian;
                            break;
                        case 3:
                        case 4:
                            species = Species.Denobulan;
                            break;
                        case 17:
                        case 18:
                            species = Species.Tellarite;
                            break;
                        case 19:
                        case 20:
                            species = Species.Vulcan;
                            break;
                        default:
                            species = Species.Human;
                            break;
                    }
                    break;
                }
                case Era.OriginalSeries: {
                    switch (roll) {
                        case 1:
                        case 2:
                            species = Species.Andorian;
                            break;
                        case 3:
                        case 4:
                            species = Species.Denobulan;
                            break;
                        case 15:
                        case 16:
                            species = Species.Tellarite;
                            break;
                        case 17:
                        case 18:
                            species = Species.Trill;
                            break;
                        case 19:
                        case 20:
                            species = Species.Vulcan;
                            break;
                        default:
                            species = Species.Human;
                            break;
                    }
                    break;
                }
                case Era.NextGeneration: {
                    switch (roll) {
                        case 1:
                        case 2:
                            species = Species.Andorian;
                            break;
                        case 3:
                        case 4:
                            species = Species.Bajoran;
                            break;
                        case 5:
                        case 6:
                            species = Species.Betazoid;
                            break;
                        case 7:
                        case 8:
                            species = Species.Denobulan;
                            break;
                        case 15:
                        case 16:
                            species = Species.Tellarite;
                            break;
                        case 17:
                        case 18:
                            species = Species.Trill;
                            break;
                        case 19:
                        case 20:
                            species = Species.Vulcan;
                            break;
                        default:
                            species = Species.Human;
                            break;
                    }
                    break;
                }
            }

            return species;
        }
    }

    private ignoreSpecies(species: Species) {
        if (hasAnySource([Source.BetaQuadrant, Source.KlingonCore, Source.Core2ndEdition])) {
            if (species === Species.KlingonExt) {
                return true;
            }
        }

        if (hasAnySource([Source.DS9, Source.AlphaQuadrant, Source.Core2ndEdition])) {
            if (species === Species.FerengiExt) {
                return true;
            }
        }

        if (hasAnySource([Source.LowerDecksCampaign])) {
            if (species === Species.GornExt) {
                return true;
            }
        }

        if (hasSource(Source.AlphaQuadrant)) {
            if (species === Species.Ferengi && !hasSource(Source.Core2ndEdition)) { // supercede by FerengiAlpha
                return true;
            }
        }

        if (hasSource(Source.AlphaQuadrant) || hasSource(Source.Core2ndEdition)) {
            if (species === Species.CardassianExt) {
                return true;
            }
        }

        if (hasSource(Source.Core2ndEdition)) {
            if (species === Species.FerengiAlpha) { // supercede by Ferengi
                return true;
            }
        }

        if (hasSource(Source.GammaQuadrant)) {
            if (species === Species.Changeling) {
                return true;
            }
        }

        if (hasSource(Source.PicardS1) || hasSource(Source.Core2ndEdition)) {
            if (species === Species.RomulanExt) {
                return true;
            }
        }

        return false;
    }

    generateFromAlphaQuadrantTable(): Species {
        var roll = Math.floor(Math.random() * 20) + 1;
        var species = Species.Human;

        switch (store.getState().context.era) {
            case Era.Enterprise: {
                switch (roll) {
                    case 1:
                    case 2:
                        species = Species.Andorian;
                        break;
                    case 3:
                    case 4:
                        species = Species.Arbazan;
                        break;
                    case 5:
                    case 6:
                        species = Species.Denobulan;
                        break;
                    case 17:
                    case 18:
                        species = Species.Tellarite;
                        break;
                    case 19:
                    case 20:
                        species = Species.Vulcan;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
            case Era.OriginalSeries: {
                switch (roll) {
                    case 1:
                    case 2:
                        species = Species.Andorian;
                        break;
                    case 3:
                    case 4:
                        species = Species.Arbazan;
                        break;
                    case 5:
                        species = Species.Caitian;
                        break;
                    case 6:
                    case 7:
                        species = Species.Denobulan;
                        break;
                    case 8:
                        species = Species.Edosian;
                        break;
                    case 15:
                    case 16:
                        species = Species.Tellarite;
                        break;
                    case 17:
                        species = Species.Trill;
                        break;
                    case 18:
                    case 19:
                        species = Species.Vulcan;
                        break;
                    case 20:
                        species = Species.Zaranite;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
            case Era.NextGeneration: {
                switch (roll) {
                    case 1:
                        species = Species.Andorian;
                        break;
                    case 2:
                        species = Species.Arbazan;
                        break;
                    case 3:
                    case 4:
                        species = Species.Bajoran;
                        break;
                    case 5:
                    case 6:
                        species = Species.Betazoid;
                        break;
                    case 7:
                        species = Species.Caitian;
                        break;
                    case 8:
                        species = Species.Denobulan;
                        break;
                    case 9:
                        species = Species.Edosian;
                        break;
                    case 16:
                        species = Species.Tellarite;
                        break;
                    case 17:
                        species = Species.Trill;
                        break;
                    case 18:
                    case 19:
                        species = Species.Vulcan;
                        break;
                    case 20:
                        species = Species.Zaranite;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
        }

        return species;
    }

    generateFromBetaQuadrantTable(): Species {
        var roll = Math.floor(Math.random() * 20) + 1;
        var species = Species.Human;

        switch (store.getState().context.era) {
            case Era.Enterprise: {
                switch (roll) {
                    case 1:
                    case 2:
                        species = Species.Andorian;
                        break;
                    case 3:
                    case 4:
                        species = Species.Denobulan;
                        break;
                    case 17:
                    case 18:
                        species = Species.Tellarite;
                        break;
                    case 19:
                    case 20:
                        species = Species.Vulcan;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
            case Era.OriginalSeries: {
                switch (roll) {
                    case 1:
                    case 2:
                        species = Species.Andorian;
                        break;
                    case 3:
                    case 4:
                        species = Species.Denobulan;
                        break;
                    case 5:
                    case 6:
                        species = Species.Efrosian;
                        break;
                    case 15:
                    case 16:
                        species = Species.Tellarite;
                        break;
                    case 17:
                        species = Species.Trill;
                        break;
                    case 18:
                    case 19:
                        species = Species.Vulcan;
                        break;
                    case 20:
                        species = Species.Zakdorn;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
            case Era.NextGeneration: {
                switch (roll) {
                    case 1:
                        species = Species.Andorian;
                        break;
                    case 2:
                    case 3:
                        species = Species.Bajoran;
                        break;
                    case 4:
                        species = Species.Benzite;
                        break;
                    case 5:
                    case 6:
                        species = Species.Betazoid;
                        break;
                    case 7:
                        species = Species.Bolian;
                        break;
                    case 8:
                        species = Species.Denobulan;
                        break;
                    case 9:
                        species = Species.Efrosian;
                        break;
                    case 16:
                        species = Species.Tellarite;
                        break;
                    case 17:
                        species = Species.Trill;
                        break;
                    case 18:
                    case 19:
                        species = Species.Vulcan;
                        break;
                    case 20:
                        species = Species.Zakdorn;
                        break;
                    default:
                        species = Species.Human;
                        break;
                }
                break;
            }
        }

        return species;
    }

    generateFromGammaQuadrantTable(): Species|null {
        return this.generateRandomSpeciesForQuadrant(Source.GammaQuadrant);
    }

    generateFromDeltaQuadrantTable(): Species|null {
        return this.generateRandomSpeciesForQuadrant(Source.DeltaQuadrant);
    }

    generateRandomSpeciesForQuadrant(source: Source) : Species|null {
        let quadrantSpecies = this.getSpecies(CharacterType.Starfleet).filter(s => s.sources.indexOf(source) >=0);
        if (quadrantSpecies.length === 0) {
            return null;
        } else {
            let roll = Math.floor(Math.random() * quadrantSpecies.length);
            return quadrantSpecies[roll].id;
        }
    }

    getCaptainsLogSpecies() {
        let result: SpeciesModel[] = [];
        for (let id in this._species) {
            const species = this._species[id];
            if (species.sources.indexOf(Source.CaptainsLog) >= 0) {
                result.push(species);
            }
        }
        return result.sort((a, b) => {
            return a.localizedName.localeCompare(b.localizedName);
        });
    }
}

export const SpeciesHelper = new _Species();
