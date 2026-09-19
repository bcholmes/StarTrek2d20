import {
  AlliedMilitaryDetails,
  CareerStep,
  Character,
  CharacterRank,
  EducationStep,
  GovernmentDetails,
  NpcGenerationStep,
  SpeciesStep,
} from '../../common/character';
import { CharacterType } from '../../common/characterType';
import { D20 } from '../../common/die';
import { AttributesHelper } from '../../helpers/attributes';
import { Career } from '../../helpers/careerEnum';
import { RanksHelper, Rank } from '../../helpers/ranks';
import { DepartmentsHelper } from '../../helpers/department';
import { Species } from '../../helpers/speciesEnum';
import { SpeciesHelper } from '../../helpers/species';
import type { SpeciesModel } from '../../helpers/speciesModel';
import {
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_WARRIORS_SPIRIT,
  TalentsHelper,
} from '../../helpers/talents';
import { NameGenerator } from '../nameGenerator';
import { NpcType, NpcTypes } from './npcType';
import type { SpecializationModel } from './specializations';
import { Specializations, Specialty, Value } from './specializations';
import { NpcCharacterType } from './npcCharacterType';
import { hasAnySource, hasSource } from '../../state/contextFunctions';
import { Source } from '../../helpers/sources';
import {
  AlliedMilitary,
  AlliedMilitaryType,
} from '../../helpers/alliedMilitary';
import { AllyHelper } from '../../helpers/alliedMilitary';
import { Specialization } from '../../common/specializationEnum';
import { Track } from '../../helpers/trackEnum';
import { Governments, Polity } from '../../helpers/governments';
import type { Era } from '../../helpers/erasEnum';
import { AgeHelper } from '../../helpers/age';
import { SpeciesAbilityList } from '../../helpers/speciesAbility';
import { SelectedTalent } from '../../common/selectedTalent';
import { SpecialWeapon } from '../../common/specialWeapon';
import { TalentCategory } from '../../helpers/talentCategory';
import { borgSpeciesDesignations } from './borgSpeciesDesignations';

const recreationSkills: { [type: number]: string[] } = {
  [NpcCharacterType.Starfleet]: [
    'Holodeck Simulations',
    'Dixie Hill Adventures',
    'Model Ship Building',
    'Bolian Neo-Metal Bands',
    'Early Human Spaceflight',
    'Oil Painting',
    'Camping',
    'Survival',
    'Gourmet Cooking',
    'Bajoran Spirituality',
    'Klingon Chancellors',
    'Ice Fishing',
    'Musical Instrument',
    'Barbeque Grilling',
    'History of the Human Civil Rights Movement',
    'Classical Jazz',
    'The Sacred Texts of Betazed',
    'Games of Chance',
    'Spy Holonovels',
    'White Water Rafting',
    'The Human Beatnik Era',
    'Borg Threat Assessment',
    'The History of Romulan Coups',
    'The Bajoran Age of Sail',
    'Water Vessels',
    'Historical Re-enactment',
    'Whiskey Tasting',
    'Wine Making',
    'Darts',
    'Meditation',
    'Kal-toh',
    'Taoism',
    'Target Practice',
    'Airboating',
    'Dog Training',
    'Horseback Riding',
    'Bolian Comedy',
    'Sushi Preparation',
    'Theology and Alien Superbeings',
    'Mining',
    'Animal Husbandry',
    'Flirting',
    'Antiques',
    'Hiking',
    'The Teachings of Surak',
    'Skydiving',
    'Pastry Chef',
    'Anbo-jyutsu',
    'Flotter Stories',
    'Cocktails',
    'Merchant Ships',
    'Appraisal',
    'The Ferengi Rules of Acquisition',
    'Interpretive Dance',
    'The Plays of Anton Chekhov',
    'Pre-Raphaelite Painters',
    'Andorian Electronic Dance Music',
    'Gourmet Raktajino Barista',
    'Karaoke',
    'Tongo',
    'Galeo-Manado Wrestling',
    'Andorian Clans of the Pre-Industrial Period',
    'Risan Vacation Activities',
    'Trashy Romance Novels',
    'Parrises squares',
    'Neo-Sevrin Philosophy',
    'Protocols of the Orion Syndicate',
    "V'tosh ka'tur Ideology",
  ],
  [NpcCharacterType.KlingonDefenseForces]: [
    'The teachings of Kahless',
    'The accomplishments of Kahless',
    'Klingon Chancellors and Emperors',
    "The various locales of Q'onos",
    "Mok'bara",
    "B'aht Qul",
    "Bat'leth Tournament Rules",
    'Klingon Opera',
    'The Rituals and Stories of the Klingon Afterlife',
    "The Hur'Q",
    'Targ raising and training',
    'The legends of Sarpek the Fearless',
    'Gourmet gagh',
    'The demands of honour',
    'Bloodwine making',
    'Klingon Spirituality',
    'Culinary arts',
    'Famous honourable deaths',
    'Organians and their meddlesome ways',
  ],
  [NpcCharacterType.Ferengi]: [
    'Tongo',
    'Global Tongo Championship betting',
    'Dabo',
    'Oo-mox',
    'Holosuite adventures',
    'Sexy holosuite adventures',
    'Lokar bean preparation',
    'Gourmet slug liver',
    'Oyster toad',
    'Puree of beetle',
    'Tube grub farming',
    'Slug-o-cola',
    'Stardrifter afficionado',
    'Schmoozing',
    'Bars and Diners',
  ],
  [NpcCharacterType.Cardassian]: [],
};

const careerSkills: { [type: number]: string[] } = {
  [NpcCharacterType.Starfleet]: [
    'Starfleet Protocols',
    'Worlds of the Federation',
    'Starship Emergency Protocols',
    'Tricoders',
    'History of the Federation',
    'The Missions of Adm. Archer and the NX-01',
    'Early Starfleet History',
    'Starfleet General Orders',
    'The Missions of Commodore Decker',
    'Starship Identification',
    'Androids and Synthetic Life',
    'Holodeck Programming',
    'Federation Wars',
    'Battle Tactics of Captain Garth',
    'Federation Species',
    'Tactical Use of Logic Puzzles for Defeating AIs',
    'First Contact Protocols',
    'The Prime Directive',
    'Abandon Ship Procedures',
    'Space Suits',
    'Zero-G Operations',
  ],
  [NpcCharacterType.KlingonDefenseForces]: [
    'KDF Protocols',
    'Worlds of the Klingon Empire',
    'Starship Emergency Protocols',
    'Tricorders',
    'History of the Empire',
    'The Accomplishments of Koloth',
    'Early Klingon History',
    'The Missions of Captain Kor',
    'Protocols for Challenging a Superior',
    'Starship Identification',
    'Battle Tactics of General Korrd',
    'Conquered species',
    'Weaknesses of the Federation',
    'Enemies of the Empire',
    'Abandon Ship Procedures',
    'Space suits',
    'Zero-G Operations',
    'The strategies of famous Starfleet captains',
  ],
  [NpcCharacterType.Ferengi]: [
    'Valuation',
    'Business Opportunities',
    'Merchant Trade Routes',
    'The Rules of Acquisition',
    'The Protocols of the Ferengi Trade Authority',
    'Unionization Threat Analysis',
    'Subtle Billing Surcharges',
    'Trade Authority Bureaucracy',
    'Energy Whips',
  ],
  [NpcCharacterType.RomulanEmpire]: [
    'Scheming',
    'Sneak Attacks',
    'Military Tactics',
    'The Federation/Romulan War',
    'Political Jockeying',
    'Plots and Intrigue',
    'Tal Shiar Conspiracy Theories',
    'Tests of Loyalty',
  ],
  [NpcCharacterType.RogueRuffianMercenary]: [
    'The Underworld',
    'Safety Protocols',
    'Law Enforcement Policies and Practices',
    'Negotiation',
    'Bribery',
    'Underworld Contacts',
    'Surveillance Countermeasures',
    'Jamming Devices',
  ],
};

const typeSpecificValues: { [type: number]: (string | Value)[] } = {
  [NpcCharacterType.Starfleet]: [
    'I am so close to promotion, I can taste it.',
    new Value('Risk is our business!', 'accepts risk'),
    'The Prime Directive is our highest law.',
    new Value(
      'I saw things in the war... horrible, horrible things',
      'haunted by war',
    ),
    'The crew is my family.',
    new Value('Loyal to my commanding officer', 'loyal'),
    new Value('I have my orders.', 'bound to orders'),
    'The chain of command is essential',
    new Value('Starfleet rules are rigid, but necessary', 'rule-follower'),
    'Seek out new life and new civilizations',
    new Value(
      'Infinite Diversity in Infinite Combinations',
      'values diversity',
    ),
    "It's the Prime Directive, not the Only Directive",
    new Value('Please. Let us help you.', 'eager to help'),
    "Starfleet is the only family I've ever needed.",
    'My team has my back',
    new Value('Work the problem', 'scientifically-minded'),
    "I've got faith of the heart",
  ],
  [NpcCharacterType.KlingonDefenseForces]: [
    new Value('My honour is in protecting the Empire', 'Jingoistic'),
    'If I must choose between personal dishonour and failing the Empire, I choose the former.',
    'If my crew dies, it will be honourably!',
    new Value('A Klingon without honour is as good as dead', 'honourbound'),
    'Klingons do not take prisoners. But I offer you a blade, so that you may take your own life.',
    new Value(
      'It is foolish to give my word to a foe with no honour.',
      'dismissive',
    ),
    'I do not seek to lead, but will take that role if honour demands it.',
    'I see you have forgotten the first time we met. I assure you that I have not forgotten.',
    'Experience bIj!',
  ],
  [NpcCharacterType.Ferengi]: [],
  [NpcCharacterType.RomulanEmpire]: [],
  [NpcCharacterType.RogueRuffianMercenary]: [
    new Value('To live outside the law, you must be honest.', 'honourable'),
    'I know what I bring to the table so trust me when I say that I am not afraid to eat alone.',
    "You're only as good as your last envelope.",
    "Suffice it to say that if you ever tell anyone about our arrangement, we'll never work together again.",
    "No questions. No answers. That's the business we're in. You just accept it and move on.",
    new Value(
      "I never walk into a place I don't know how to walk out of.",
      'cautious',
    ),
    "If it's going to be a amateur night, the price goes up, and I want it upfront.",
    new Value(
      "Don't let yourself get attached to anything you are not willing to walk out on in 30 seconds flat if you feel the heat around the corner.",
      'free of attachments',
    ),
    'We Just Got Made.',
    new Value(
      "Trust your gut. Something doesn't feel right, it's not right.",
      'instinctive',
    ),
    'I say what I mean, and I do what I say.',
    "He knew the risks, he didn't have to be there. It rains... you get wet.",
    "All I am is what I'm going after.",
    new Value(
      "If you're good at something, never do it for free.",
      'mercenary',
    ),
    'Let me ask you something. If the rule you followed brought you to this, of what use was the rule?',
  ],
  [NpcCharacterType.Borg]: [
    'We are Borg',
    'Resistance is futile',
    'Existence as you know it is over',
    'We will add your biological and technological distinctiveness to our own',
    'Your defiance is irrelevant',
    'It is the epitome of perfection',
    'The task at hand must be completed',
    'We will contain your knowledge',
    'Knowledge is irrelevant unless shared',
    'The Collective is all. Individuality is an illusion.',
    'You will become one with the Borg',
    'We will unify all life',
    'Your actions and decisions are irrelevant',
    'Our purpose is to expand and evolve through collective assimilation',
  ],
};

const typeSpecificGeneralValues: { [type: number]: (string | Value)[] } = {
  [NpcCharacterType.Starfleet]: [
    "Mentally, I'm already on leave to Risa!",
    'I have a special someone back home.',
    new Value('Looking for love in all the wrong places', 'hopeless romantic'),
    "I can't wait to get back to my holonovel",
    'That which does not kill me makes me stranger!',
    "I'm not doing the non-corporeal body-stealing alien thing again!",
    new Value('My word is my bond', 'trustworthy'),
    new Value('Show-off', 'show-off'),
    new Value('Braggart', 'braggart'),
    'Teller of Tall-Tales',
    new Value(
      'A Vulcan, a Romulan, and a Klingon walk into a bar...',
      'jokester',
    ),
    new Value('Exceptionally dedicated', 'exceptionally dedicated'),
    'Everyone deserves a shot at a second chance',
    'Violence is the last refuge of the incompetent.',
  ],
  [NpcCharacterType.KlingonDefenseForces]: [
    new Value('Overflowing with bravado', 'braggart'),
    new Value('Blowhard', 'blowhard'),
    new Value("I don't need to be sober to defeat you.", 'drunkard'),
    "Test me and you'll taste my d'k tahg",
    'Victory is life',
    'The enemy of my enemy is my friend',
    'The enemy of my enemy is my friend. For now.',
    'Great deeds require great risks',
    new Value('Duty and loyalty are sacred', 'loyal and dutious'),
    'They will sing songs of glory for my accomplishments',
    new Value(
      "I'm tired of all this peace. A warrior needs a good war every now and then.",
      'itching for battle',
    ),
    'Always it is the brave ones who die. The soldiers.',
    'Today we conquer! Oh, if someday we are defeated... well... war has its fortunes. Good and bad.',
    'It would have been glorious.',
  ],
  [NpcCharacterType.RomulanEmpire]: [
    new Value(
      'We have to prioritize the good of the Empire',
      'patriotic to a fault',
    ),
    new Value('Secrecy is Strength', 'secretive'),
    'Vigilance is Virtue',
    new Value('Ambition Knows No Bounds', 'ambitious'),
    'Unity in Deception',
    'Adapt or Be Conquered',
    'Strength in Isolation',
    'The Ends Justify the Means',
    'Intrigue is the Spice of Life',
    new Value('Patience in Pursuit', 'patient'),
    'Honor in Victory, Disgrace in Defeat',
  ],
  [NpcCharacterType.Ferengi]: [],
  [NpcCharacterType.Cardassian]: [
    'Order Above All',
    'Duty Defines Honour',
    'Strength Through Unity',
    'Information is Power',
    'Adaptation is Survival',
    new Value('Discipline Breeds Excellence', 'disciplined'),
    new Value(
      "It doesn't seem right, all this plotting and secrecy. What are we? Romulans?",
      'direct and unsubtle',
    ),
    'Sacrifice for the Greater Good',
    'Loyalty Commands Respect',
    new Value('Patriotism as Virtue', 'patriotic'),
    'Legacy Endures Through Contribution',
    new Value('Hierarchy is Inviolate', 'hierarchical'),
    'Education is the Key to Progress',
    'Security Breeds Prosperity',
    new Value('Faith in the Central Command', 'trusts the system'),
    'Cultural Preservation is Paramount',
    new Value('Pragmatism Over Idealism', 'pragmatic'),
    'Artistic Expression in Service of the State',
    new Value('Resilience in the Face of Adversity', 'strong-willed'),
    'The State Knows Best',
    'Atonement Through Service',
  ],
};

const speciesSpecificValues: { [species: number]: (string | Value)[] } = {
  [Species.Vulcan]: [
    'Logic is the beginning of wisdom',
    'One can start with irrational premises and still use logical processes',
    new Value('There are always possibilities', 'optimistic'),
    "Greater precision can't hurt",
    new Value(
      'You must control your passions; they will be your undoing',
      'self-controlled',
    ),
    new Value(
      'May we together become greater than the sum of both of us',
      "values people's differences",
    ),
    'Vulcans believe that peace should not depend on force.',
    new Value(
      'I wish to spend this time in contemplative meditation.',
      'meditative',
    ),
    'Music has fascinating mathematical properties',
    'Fascinating',
    'Live long and prosper',
    "When your logic doesn't work, you raise your voice? You've been on Earth too long.",
    new Value(
      'Your presence here has not been... overly meddlesome.',
      'reluctantly admiring',
    ),
  ],
  [Species.Andorian]: [
    'My blood flows with ice like my Andorian ancestors!',
    'My people are a very violent people',
    "The Vulcans say that the desert teaches one the meaning of endurance, but it's the ice that forges real strength",
    new Value('The honour of my clan demands it!', 'vengeful'),
    "I'll take your blood to Andoria... to the Wall of Heroes!",
    'I come from one of the great clans of Andoria!',
    'My grandmother in her dotage was a greater warrior than you!',
    'Passion! Exhilaration! Excellence! These are the vital components of life!',
  ],
  [Species.Breen]: [
    'I do not care what happens as long as I achieve my objectives',
    'Your pain does not concern me',
    'My regard for you lasts only as long as I benefit',
    "My code of honour is for me and mine; I'm not obligated to treat you honourably",
  ],
  [Species.Human]: [
    'An injustice to one is an injustice to all!',
    new Value('You only live once!', 'risk-taker'),
    'Live fast and die hard!',
    new Value('Life of the party!', 'partier'),
    'Humanity has had its ugly chapters. We try to learn, to make amends, and to grow.',
    'To strive, to seek, to find, and not to yield.',
    'To err is human...',
    'sic itur ad astra',
    'The potential to make yourself a better person... that is what it is to be Human... to make yourself more than you are.',
  ],
  [Species.Tellarite]: [
    'If it cannot stand up to scrutiny, it should be torn down',
    new Value(
      'Enough with the flowery words; say what you really mean!',
      'plain-spoken',
    ),
    new Value('Speak plainly!', 'plain-spoken and direct'),
    new Value("We're not a patient people.", 'impatient'),
    "I'm told this ship is the pride of Starfleet. I find it small and unimpressive.",
    "Let's consider all sides of this argument",
    'I listened to your point of view, now you should listen to mine!',
    new Value(
      "You're being seduced by wishful thinking! Practicality, not hope, is what we need!",
      'pragmatic',
    ),
  ],
  [Species.Bajoran]: [
    new Value('Walk with the Prophets', 'spiritual'),
    new Value('The Prophets teach patience', 'patient'),
    'You have a strong pagh',
    new Value('I was a soldier, trying to free my world!', 'freedom fighter'),
    new Value(
      "That's the thing about faith. If you don't have it, you can't understand it. And if you do, no explanation is necessary.",
      'person of faith',
    ),
    new Value(
      "I'll probably never fully forgive the Cardassians",
      'resents the Cardassians',
    ),
    'The Bajorans were a peaceful people before the Cardassians came.',
    new Value(
      "I did things. Things that had to be done. I'm not going to beat myself up over that.",
      'traumatized by war',
    ),
  ],
  [Species.Denobulan]: [
    new Value(
      "I think it all sounds rather exciting, don't you?",
      'enthusiastic',
    ),
    "I'm excited to tell you that my significant other finds you very attractive",
    'Family relations can be extremely complicated',
    new Value(
      "If you're going to try to embrace new worlds, you must try to embrace new ideas",
      'open-minded',
    ),
    'Ah. A new species. Delightful music and wonderful food.',
    'Are you going to finish eating that...?',
    new Value(
      'Communication is the foundation of understanding',
      'values communication',
    ),
    'Infinite patience yields immediate results',
    'The health of the individual is the health of the community',
    new Value('Curiosity is the spark of progress', 'curious'),
  ],
  [Species.Trill]: [
    'The protection of the symbionts is essential to the protection of Trill culture',
    "Those who join with the symbionts are performing our society's most sacred duty",
    new Value(
      "Even if we aren't joined, we should embody the highest standards of behaviour",
      'principled',
    ),
    "If you want to know who you are, it's important to know who you've been",
    'The past is never truly gone',
    'Individuality is strengthened by unity',
    'The pursuit of knowledge is a lifelong journey',
    'Balance is key',
    new Value('Trust is earned, not given', 'untrusting'),
  ],
  [Species.Betazoid]: [
    'To know oneself is to know others',
    new Value('Honesty is the highest form of respect', 'values honesty'),
    'Thoughts have power',
    'Peace begins within',
    new Value('All life is precious', 'values life'),
    new Value('Compassion is the highest form of wisdom', 'compassionate'),
    'We are all one',
    'Seek to understand before seeking to be understood',
    new Value('The heart is the truest compass', 'follows the heart'),
  ],
  [Species.Klingon]: [
    new Value(
      'My family carries a great shame; it is my burden to redeem them',
      'seeking redemption',
    ),
    'Back-stabbing is for cowards. I will stab you in the chest, while you watch!',
    'Glory to you. And to your House.',
    new Value('Honor is more important than life itself', 'honorable'),
    'The strong survive and the weak perish',
    new Value('Death is not to be feared, but embraced', 'unafraid of death'),
    'The path to enlightenment is through struggle',
    'Revenge is a dish best served cold',
    'Respect is earned, not given',
    new Value('Family is everything', 'family-oriented'),
    new Value("A Klingon's word is their bond", 'promise-keeper'),
    'My targ is my trusty companion, but I will kill it if it bites me.',
    'Wisdom comes from experience',
    'Suffering is a test of character',
    'Klingons do not procrastinate',
    'What is that furry thing, and why does it make that noise? Get it away from me.',
    new Value("I don't trust people who smile too much.", 'suspicious'),
  ],
  [Species.Bolian]: [
    'Cleanliness is next to godliness',
    'Unity through diversity',
    new Value('Honesty is the best policy', 'honest'),
    new Value('Family comes first', 'family-oriented'),
    'A sound mind in a sound body',
    'Respect for authority',
    'Service to others',
    new Value('Hard work pays off', 'hard-working'),
    'Peace through negotiation',
    'A well-rounded education is a boon',
    "It's not just warp cores, any engine makes for a cheerful baby",
  ],
  [Species.Ferengi]: [
    'Once you have their money, you never give it back.',
    new Value(
      'Never spend more for an acquisition than you have to.',
      'thrifty',
    ),
    'Never allow family to stand in the way of opportunity.',
    'Keep your ears open.',
    new Value('Opportunity plus instinct equals profit.', 'opportunistic'),
    'Greed is eternal.',
    'A deal is a deal.',
    'A contract is a contract is a contract... but only between Ferengi.',
    'A Ferengi without profit is no Ferengi at all.',
    'Never place friendship above profit.',
    'A wise person can hear profit in the wind.',
    'Nothing is more important than your health... except for your money.',
    "Never make fun of a Ferengi's mother.",
    new Value('It never hurts to suck up to the boss.', 'suck-up'),
    'War is good for business.',
    'Peace is good for business.',
    'Expand or die.',
    "Don't trust a man wearing a better suit than your own.",
    'The bigger the smile, the sharper the knife.',
    'Good customers are as rare as latinum. Treasure them.',
    'Free advice is seldom cheap.',
  ],
  [Species.Romulan]: [
    new Value('I Will Not Fail in My Duty to the Empire', 'dutiful'),
    'The Ends Justify the Means',
    new Value('Everything I Do, I Do for Romulus', 'patriotic'),
    new Value(
      "My people have a reputation for arrogance. I'm afraid it's well-earned.",
      'arrogant',
    ),
  ],
  [Species.Reman]: [
    'You think darkness is your ally? You merely adopted the dark. I was born in it, molded by it.',
    'One Day the Reman People Will Rise, and Take the Throne of Romulus Itself!',
  ],
  [Species.Cardassian]: [new Value('Family is all', 'family-oriented')],
  [Species.Nausicaan]: ['Pain is Pleasure'],
  [Species.Pakled]: [
    'We are smart',
    new Value('We look for things. Things that make us go!', 'scrounger'),
    'Pakleds are Strong!',
    'Big Boomers Make Big Boom',
    'It is broken!',
    new Value("You think we're stupid, but we're smart!", 'dim-witted'),
    'We want to be nothing if not persistent.',
    'We want them.',
    'You underestimate me! Because you are not smart!',
    'I tricked you!',
    'Give me all your technology, or I will take it from you!',
    'The Pakleds are a force! One that you reckon with!',
  ],
};

const personality = [
  'intense',
  'reserved',
  'gregarious',
  'sarcastic',
  'bookish',
  'outgoing',
  'goal-oriented',
  'driven',
  'meticulous',
  'instinctive',
  'aggressive',
  'jokester',
  'dry-humoured',
  'naive',
  'trusting',
  'distrusting',
  'over-eager',
  'suspicious',
  'cautious',
  'analytical',
  'dour',
  'perky',
  'upbeat',
  'hot-headed',
  'rule-follower',
];

export class NpcGenerator {
  static async createNpc(
    npcType: NpcType,
    characterType: NpcCharacterType,
    species: SpeciesModel,
    specialization: SpecializationModel,
    era: Era,
    includeDescription: boolean,
  ) {
    const character = Character.createNpcCharacter(
      era,
      hasSource(Source.Core2ndEdition) ? 2 : 1,
    );
    if (specialization == null) {
      const specializations =
        Specializations.instance.getSpecializations(characterType);
      specialization =
        specializations[Math.floor(Math.random() * specializations.length)];
    }
    NpcGenerator.assignCharacterType(character, characterType, specialization);

    character.jobAssignment = specialization.localizedName;
    character.speciesStep = new SpeciesStep(species.id);
    if (species.id === Species.CyberneticallyEnhanced) {
      const originalSpecies = SpeciesHelper.generateSpecies(
        CharacterType.Starfleet,
      );
      character.speciesStep.originalSpecies = originalSpecies;
    } else if (species.id === Species.Borg) {
      while (character.speciesStep?.originalSpecies == null) {
        const roll = D20.roll();
        if (roll <= 10) {
          const originalSpecies =
            SpeciesHelper.generateFromDeltaQuadrantTable();
          if (originalSpecies !== Species.LiberatedBorg) {
            character.speciesStep.originalSpecies = originalSpecies;
          }
        } else if (roll <= 15) {
          const originalSpecies = SpeciesHelper.generateSpecies();
          if (
            originalSpecies !== Species.LiberatedBorg &&
            originalSpecies !== Species.Borg
          ) {
            character.speciesStep.originalSpecies = originalSpecies;
          }
        } else {
          const number = Math.ceil(Math.random() * 10000);
          if (borgSpeciesDesignations[number] == null) {
            character.speciesStep.originalSpecies = Species.Custom;
            character.speciesStep.customSpeciesName = 'Species ' + number;
          }
        }
      }
    }

    if (character.version > 1) {
      character.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
        species.id,
      );
    }

    if (species.attributes?.length <= 3) {
      character.speciesStep.attributes = [...species.attributes];
    } else {
      character.speciesStep.attributes = [];
    }
    while (character.speciesStep.attributes.length < 3) {
      const all = AttributesHelper.getAllAttributes();
      const attribute = all[Math.floor(all.length * Math.random())];
      if (!character.speciesStep.attributes.includes(attribute)) {
        character.speciesStep.attributes.push(attribute);
      }
    }

    let nameSpecies = species;
    if (character.speciesStep?.originalSpecies != null) {
      nameSpecies = SpeciesHelper.getSpeciesByType(
        character.speciesStep.originalSpecies,
      );
    } else if (
      nameSpecies.id === Species.KlingonQuchHa ||
      nameSpecies.id === Species.KlingonQuchHa_2E
    ) {
      nameSpecies = SpeciesHelper.getSpeciesByType(Species.Klingon);
    }

    let gender = undefined;
    if (
      specialization.id === Specialization.TalarianOfficer ||
      specialization.id === Specialization.TalarianWarrior
    ) {
      gender = 'Male';
    } else if (specialization.id === Specialization.QowatMilat) {
      gender = 'Female';
    }

    let origin = undefined;
    if (character.speciesStep?.species === Species.Borg) {
      character.name = NameGenerator.instance.createBorgName();
      character.pronouns = 'They/Them';
    } else {
      const { name, pronouns, nameOrigin } = NameGenerator.instance.createName(
        nameSpecies,
        gender,
      );
      character.name = name;
      character.pronouns = pronouns;
      origin = nameOrigin;
    }

    character.npcGenerationStep = new NpcGenerationStep(npcType);
    character.npcGenerationStep.specialization = specialization.id;
    NpcGenerator.assignAttributes(npcType, character, species, specialization);

    const disciplines = DepartmentsHelper.instance.getDepartments();
    const disciplinePoints = NpcTypes.departmentPoints(npcType);

    for (let i = 0; i < disciplinePoints.length; i++) {
      let a = disciplines[Math.floor(Math.random() * disciplines.length)];
      if (i === 0 && specialization.primaryDiscipline != null) {
        a = specialization.primaryDiscipline;
      }
      character.npcGenerationStep.departments[a] = disciplinePoints[i];
      disciplines.splice(disciplines.indexOf(a), 1);
    }

    const aspects = [];
    let careers = [
      Career.Young,
      Career.Young,
      Career.Young,
      Career.Young,
      Career.Young,
      Career.Young,
      Career.Young,
      Career.Experienced,
      Career.Experienced,
      Career.Experienced,
      Career.Experienced,
      Career.Experienced,
      Career.Experienced,
      Career.Experienced,
      Career.Veteran,
      Career.Veteran,
    ];
    if (specialization.id === Specialization.Admiral) {
      careers = [Career.Veteran];
    } else if (
      specialization.id === Specialization.FerengiDaiMon ||
      specialization.id === Specialization.KlingonShipCaptain ||
      specialization.id === Specialization.CardassianGul ||
      specialization.id === Specialization.SonaCommandOfficer ||
      specialization.id === Specialization.Captain ||
      specialization.id === Specialization.StationCommander
    ) {
      careers = [
        Career.Experienced,
        Career.Experienced,
        Career.Experienced,
        Career.Veteran,
      ];
    }

    character.careerStep = new CareerStep(
      careers[Math.floor(Math.random() * careers.length)],
    );
    character.npcGenerationStep.enlisted =
      Math.random() < specialization.officerProbability ? false : true;

    if (specialization.id !== Specialization.Child) {
      switch (character.careerStep.career) {
        case Career.Young:
          aspects.push('youthful');
          break;
        case Career.Veteran:
          aspects.push('long-serving and older');
          break;
        default:
      }
    }

    if (!character.isCivilian() && characterType !== NpcCharacterType.Borg) {
      NpcGenerator.assignRank(character, specialization);
    }
    NpcGenerator.assignFocuses(npcType, character, specialization);
    const aspectsFromValues = NpcGenerator.assignValues(
      npcType,
      character,
      specialization,
    );
    aspects.push(...aspectsFromValues);
    if (aspectsFromValues.length === 0) {
      aspects.push(personality[Math.floor(Math.random() * personality.length)]);
    }
    if (characterType === NpcCharacterType.Borg) {
      NpcGenerator.assignBorgTalents(
        npcType,
        character,
        species,
        specialization,
      );
    } else {
      NpcGenerator.assignTalents(npcType, character, species, specialization);
    }

    if (npcType !== NpcType.Minor && includeDescription) {
      character.description = await NpcGenerator.generateCharacterDescription(
        character,
        specialization,
        origin,
        aspects,
      );
    }

    return character;
  }

  private static async generateCharacterDescription(
    character: Character,
    specialization: SpecializationModel,
    nameOrigin: string,
    aspects: string[],
  ) {
    const species = SpeciesHelper.getSpeciesByType(
      character.speciesStep.species,
    );
    const speciesName = species.name;

    const data = {
      name: character.name,
      species: speciesName,
      specialization: Specialization[specialization.id],
      pronouns: character.pronouns,
      npcCharacterType: NpcCharacterType[specialization.type],
      rank: character.rank?.name,
      npcType: NpcType[character.npcGenerationStep?.type],
      aspects: aspects,
    };

    if (species.id === Species.CyberneticallyEnhanced) {
      const original = SpeciesHelper.getSpeciesByType(
        character.speciesStep.originalSpecies,
      )?.name;

      if (original != null) {
        data['originalSpecies'] = original;
      }
    }

    if (character.speciesStep.species === Species.Trill) {
      data['speciesDetails'] = character.hasTalent('Joined')
        ? 'Joined'
        : 'Unjoined';
    }

    if (nameOrigin?.length) {
      data['nameOrigin'] = nameOrigin;
    }

    if (specialization.id === Specialization.Child && character.age?.isChild) {
      data['extraDetail'] = character.age.name;
    }

    if (
      specialization.primaryFocuses instanceof Specialty &&
      character.npcGenerationStep?.focuses?.length
    ) {
      data['specialty'] = character.npcGenerationStep.focuses[0];
    }

    data['focuses'] = character.focuses.filter((f) =>
      specialization.primaryFocuses.includes(f),
    );

    const textEncoder = new TextEncoder();
    const body = textEncoder.encode(JSON.stringify(data));

    try {
      const response = await fetch('/api/character_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.status === 200) {
        const responseJson = await response.json();
        return responseJson?.description;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  }

  private static assignCharacterType(
    character: Character,
    characterType: NpcCharacterType,
    specialization: SpecializationModel,
  ) {
    switch (characterType) {
      case NpcCharacterType.Starfleet:
        character.type = CharacterType.Starfleet;
        break;
      case NpcCharacterType.Cardassian:
        character.type = CharacterType.AlliedMilitary;
        character.typeDetails = new AlliedMilitaryDetails(
          AllyHelper.instance.findOption(AlliedMilitaryType.CardassianUnion),
          'Cardassian Union',
        );
        break;
      case NpcCharacterType.KlingonDefenseForces:
        if (specialization.id === Specialization.KlingonDiplomat) {
          character.type = CharacterType.AmbassadorDiplomat;
          character.typeDetails = new GovernmentDetails(
            Governments.findOption(Polity.Klingon),
            '',
          );
        } else {
          character.type = CharacterType.KlingonWarrior;
        }
        break;
      case NpcCharacterType.RomulanEmpire:
        if (specialization.id === Specialization.RomulanSenator) {
          character.type = CharacterType.Romulan;
          character.educationStep = new EducationStep(
            Track.PoliticianOrBureaucrat,
          );
        } else if (specialization.id === Specialization.QowatMilat) {
          character.type = CharacterType.Romulan;
        } else {
          character.type = CharacterType.Romulan;
        }
        break;
      case NpcCharacterType.RogueRuffianMercenary:
        character.type = CharacterType.Civilian;
        break;
      case NpcCharacterType.Borg:
        character.type = CharacterType.AlliedMilitary;
        character.typeDetails = new AlliedMilitaryDetails(
          new AlliedMilitary('Borg Collective', AlliedMilitaryType.Borg, [
            Species.Borg,
          ]),
          'Borg Collective',
        );
        break;
      case NpcCharacterType.MinorPolity:
        character.type = CharacterType.AlliedMilitary;
        if (specialization.id === Specialization.SonaCommandOfficer) {
          character.typeDetails = new AlliedMilitaryDetails(
            new AlliedMilitary(
              "Son'a Command",
              AlliedMilitaryType.SonACommand,
              [Species.SonA],
            ),
            "Son'a Command",
          );
        } else if (
          specialization.id === Specialization.TalarianOfficer ||
          specialization.id === Specialization.TalarianWarrior
        ) {
          character.typeDetails = new AlliedMilitaryDetails(
            new AlliedMilitary(
              'Talarian Militia',
              AlliedMilitaryType.TalarianMilitia,
              [Species.Talarian],
            ),
            'Talarian Militia',
          );
        } else if (specialization.id === Specialization.TzenkethiSoldier) {
          character.typeDetails = new AlliedMilitaryDetails(
            new AlliedMilitary(
              'Tzenkethi Coalition',
              AlliedMilitaryType.TzenkethiCoalition,
              [Species.Tzenkethi],
            ),
            'Tzenkethi Coalition',
          );
        } else if (specialization.id === Specialization.TholianWarrior) {
          character.typeDetails = new AlliedMilitaryDetails(
            new AlliedMilitary(
              'Tholian Assembly',
              AlliedMilitaryType.TholianAssembly,
              [Species.Tholian],
            ),
            'Tholian Assembly',
          );
        } else if (
          specialization.id === Specialization.BreenThot ||
          specialization.id === Specialization.BreenWarrior
        ) {
          character.typeDetails = new AlliedMilitaryDetails(
            new AlliedMilitary(
              'Breen Confederacy',
              AlliedMilitaryType.BreenConfederacy,
              [Species.Breen],
            ),
            'Breen Confederacy',
          );
        }
        break;
      case NpcCharacterType.Civilian:
        if (specialization.id === Specialization.FederationAmbassador) {
          character.type = CharacterType.AmbassadorDiplomat;
          character.typeDetails = new GovernmentDetails(
            Governments.findOption(Polity.Federation),
            '',
          );
        } else if (specialization.id === Specialization.Child) {
          character.type = CharacterType.Child;
          const ages = AgeHelper.getAllChildAges();
          character.age = ages[Math.floor(Math.random() * ages.length)];
        } else {
          character.type = CharacterType.Civilian;
          if (
            specialization.id === Specialization.IndependentTraderCaptain ||
            specialization.id === Specialization.SketchyTraderCaptain
          ) {
            if (hasSource(Source.Century23)) {
              character.educationStep = new EducationStep(Track.FreeTrader);
            } else {
              character.educationStep = new EducationStep(
                Track.TraderOrMerchant,
              );
            }
          }
        }
        break;
      case NpcCharacterType.Ferengi:
        if (specialization.id === Specialization.FerengiDaiMon) {
          character.type = CharacterType.AlliedMilitary;
          character.typeDetails = new AlliedMilitaryDetails(
            AllyHelper.instance.findOption(AlliedMilitaryType.Other),
            'Ferengi',
          );
        } else {
          character.type = CharacterType.Civilian;
        }
        break;
      default:
    }
  }

  static assignBorgTalents(
    npcType: NpcType,
    character: Character,
    species: SpeciesModel,
    specialization: SpecializationModel,
  ) {
    const talents = [
      'Adaptive Shielding (Special Rule)',
      'Assimilation (Special Rule)',
      'Exoplating (Special Rule)',
      'Immune to Fear',
      'Immune to Pain',
      'Machine',
      'Night Vision',
      'Threat Protocols (Special Rule)',
    ];

    if (specialization.id === Specialization.BorgMedicalDrone) {
      talents.push('Reclamation (Special Rule)');
    } else if (specialization.id === Specialization.BorgAdjunctDrone) {
      talents.push('Interlink Node (Special Rule)');
    }

    talents.forEach((name) => {
      const talent = TalentsHelper.getTalent(name);
      if (talent != null) {
        character.npcGenerationStep.talents.push(
          new SelectedTalent(talent.name),
        );
      }
    });
  }

  static assignTalents(
    npcType: NpcType,
    character: Character,
    species: SpeciesModel,
    specialization: SpecializationModel,
  ) {
    let numberOfTalents = NpcTypes.numberOfTalents(npcType);

    for (let i = 0; i < numberOfTalents; i++) {
      let done = false;
      let n = 0;

      if (
        i === 0 &&
        species.id === Species.Klingon &&
        hasAnySource([Source.KlingonCore, Source.BetaQuadrant]) &&
        character.version === 1
      ) {
        character.addTalent(TalentsHelper.getTalent("Brak'lul"));
      } else if (i === 0 && species.id === Species.Betazoid) {
        if (character.version === 1) {
          character.addTalent(TalentsHelper.getTalent('Telepath'));
        } else {
          character.addTalent(TalentsHelper.getTalent('Telepathy2e'));
        }
        numberOfTalents += 1;
      } else if (
        i === 0 &&
        species.id === Species.Breen &&
        hasSource(Source.AlliesAndAdversaries)
      ) {
        character.addTalent(
          TalentsHelper.getTalent('Contained Form (Special Rule)'),
        );
      } else if (
        i === 0 &&
        species.id === Species.CyberneticallyEnhanced &&
        hasSource(Source.SciencesDivision)
      ) {
        character.addTalent(TalentsHelper.getTalent('Neural Interface'));
      } else {
        while (!done) {
          let talentList =
            TalentsHelper.getAllAvailableTalentsForCharacter(character);
          const specializationSkill = specialization.primaryDiscipline;
          const roll = D20.roll();
          if (roll < 7) {
            // go for species talents
            const talentName = species.talents.map((t) => t.name);
            talentList = talentList
              .filter(
                (t) =>
                  talentName.indexOf(t.name) >= 0 ||
                  (t.isSpecialRule(character.version) &&
                    (i > 0 || talentName.length === 0)),
              )
              .filter((t) => {
                if (t.name === 'Potent Pheromones' || t.name === 'Pheromones') {
                  return character.pronouns === 'she/her';
                } else if (t.name === 'Brak’lul' && character.version > 1) {
                  return false;
                } else if (
                  t.name === 'Subservient' ||
                  t.name === 'Pheromonal Thrall'
                ) {
                  return character.pronouns === 'he/him';
                } else {
                  return true;
                }
              });
          } else if (roll < 14) {
            talentList = talentList.filter(
              (t) =>
                t.category.category === TalentCategory.Department &&
                t.category.type[0] === specializationSkill,
            );
          } else {
            talentList = talentList.filter((t) => {
              if (
                t.name === TALENT_NAME_BOLD ||
                t.name === TALENT_NAME_CAUTIOUS ||
                t.name === TALENT_NAME_COLLABORATION
              ) {
                return (
                  !character.hasTalent(TALENT_NAME_BOLD) &&
                  !character.hasTalent(TALENT_NAME_CAUTIOUS) &&
                  !character.hasTalent(TALENT_NAME_COLLABORATION)
                );
              } else {
                return t.category.category === TalentCategory.General;
              }
            });
          }

          if (talentList.length) {
            const talent =
              talentList[Math.floor(Math.random() * talentList.length)];
            const selectedTalent = new SelectedTalent(talent.name);
            if (talent.name === TALENT_NAME_WARRIORS_SPIRIT) {
              selectedTalent.selection =
                D20.roll() <= 10
                  ? SpecialWeapon.BatLeth
                  : SpecialWeapon.MekLeth;
            } else if (talent.name === TALENT_NAME_AUGMENTED_ABILITY) {
              let attributes = AttributesHelper.getAllAttributes();
              if (
                D20.roll() <= 15 &&
                specialization.primaryAttributes?.length > 0
              ) {
                attributes = specialization.primaryAttributes;
              }
              selectedTalent.attribute =
                attributes[Math.floor(Math.random() * attributes.length)];
            } else if (
              [
                TALENT_NAME_COLLABORATION,
                TALENT_NAME_BOLD,
                TALENT_NAME_CAUTIOUS,
              ].includes(talent.name)
            ) {
              if (specialization.primaryDiscipline != null) {
                selectedTalent.department = specialization.primaryDiscipline;
              } else {
                const departments = DepartmentsHelper.instance.getDepartments();
                selectedTalent.department =
                  departments[Math.floor(Math.random() * departments.length)];
              }
            }

            if (!character.hasTalent(talent.name) || talent.maxRank > 1) {
              character.addTalent(selectedTalent);
              done = true;
            }
          }

          if (n++ > 100) {
            break;
          }
        }
      }
    }
  }

  static assignAttributes(
    npcType: NpcType,
    character: Character,
    species: SpeciesModel,
    specialization: SpecializationModel,
  ) {
    const attributes = AttributesHelper.getAllAttributes();
    const attributePoints = NpcTypes.attributePoints(npcType);
    const chances = [20, 14, 8];

    character.npcGenerationStep.attributes = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < attributePoints.length; i++) {
      let a = attributes[Math.floor(Math.random() * attributes.length)];
      if (
        i < specialization.primaryAttributes.length &&
        i < chances.length &&
        D20.roll() <= chances[i]
      ) {
        const temp =
          specialization.primaryAttributes[
            Math.floor(Math.random() * specialization.primaryAttributes.length)
          ];
        if (attributes.indexOf(temp) >= 0) {
          a = temp;
        }
      }
      if (
        attributePoints[i] === Character.ABSOLUTE_MAX_ATTRIBUTE &&
        character.speciesStep?.attributes.includes(a)
      ) {
        // need to move a point
        if (i < attributePoints.length - 1) {
          attributePoints[i] -= 1;
          attributePoints[attributePoints.length - 2] += 1;
        }
      }
      character.npcGenerationStep.attributes[a] = attributePoints[i] - 7;
      character.attributeValues[a] = attributePoints[i];
      attributes.splice(attributes.indexOf(a), 1);
    }
  }

  static assignValues(
    npcType: NpcType,
    character: Character,
    specialization: SpecializationModel,
  ) {
    const count = NpcTypes.numberOfValues(npcType);
    const valueOptions = [];
    valueOptions.push.apply(valueOptions, specialization.values ?? []);
    valueOptions.push.apply(
      valueOptions,
      typeSpecificGeneralValues[specialization.type] ?? [],
    );
    valueOptions.push.apply(
      valueOptions,
      typeSpecificValues[specialization.type] ?? [],
    );
    valueOptions.push.apply(
      valueOptions,
      speciesSpecificValues[
        character.speciesStep.species === Species.KlingonQuchHa ||
        character.speciesStep.species === Species.KlingonQuchHa_2E
          ? Species.Klingon
          : character.speciesStep.species
      ] ?? [],
    );

    const species = SpeciesHelper.getSpeciesByType(
      character.speciesStep.species,
    );
    if (species.exampleValues?.length) {
      valueOptions.push(...species.exampleValues);
    }

    const aspects = [];
    for (let i = 0; i < count; i++) {
      let done = false;
      while (!done) {
        if (valueOptions?.length) {
          let value =
            valueOptions[Math.floor(Math.random() * valueOptions.length)];
          let aspect = undefined;
          if (value instanceof Value) {
            value = value.value;
            aspect = value.aspect;
          }
          if (character.values.indexOf(value) < 0) {
            character.addValue(value);
            if (aspect !== undefined) {
              aspects.push(aspect);
            }
            done = true;
          }
        }
      }
    }
    return aspects;
  }

  static assignFocuses(
    npcType: NpcType,
    character: Character,
    specialization: SpecializationModel,
  ) {
    const numberOfFocuses = NpcTypes.numberOfFocuses(npcType);
    const primaryChances = [20, 12, 8, 6, 4, 2];
    const secondaryChances = [17, 15, 11, 9, 6, 3];
    let specialtyCategory = undefined;

    for (let i = 0; i < numberOfFocuses; i++) {
      let done = false;
      while (!done) {
        let focuses =
          D20.roll() > 10
            ? careerSkills[specialization.type]
            : recreationSkills[specialization.type];
        if (D20.roll() <= primaryChances[i]) {
          if (specialization.primaryFocuses instanceof Specialty) {
            if (specialtyCategory === undefined) {
              const categories = (specialization.primaryFocuses as Specialty)
                .categories;
              specialtyCategory =
                categories[Math.floor(Math.random() * categories.length)];
            }
            focuses = (specialization.primaryFocuses as Specialty).specialties(
              specialtyCategory,
            );
          } else {
            focuses = specialization.primaryFocuses;
          }
        } else if (D20.roll() <= secondaryChances[i]) {
          focuses = specialization.secondaryFocuses;
        }

        if (focuses?.length) {
          const focus = focuses[Math.floor(Math.random() * focuses.length)];
          if (character.focuses.indexOf(focus) < 0) {
            character.npcGenerationStep.focuses.push(focus);
            done = true;
          }
        }
      }
    }
  }

  static assignRank(character: Character, specialization: SpecializationModel) {
    let ranks = RanksHelper.instance().getSortedRanks(character);
    if (specialization.id === Specialization.Admiral) {
      ranks = RanksHelper.instance().getAdmiralRanks();
    } else if (specialization.id === Specialization.Captain) {
      ranks = [RanksHelper.instance().getRank(Rank.Captain)];
    } else if (specialization.id === Specialization.StationCommander) {
      ranks = [Rank.Commodore, Rank.Captain, Rank.Commander].map((r) =>
        RanksHelper.instance().getRank(r),
      );
    } else if (specialization.id === Specialization.FerengiDaiMon) {
      ranks = [RanksHelper.instance().getRank(Rank.DaiMon)];
    } else if (specialization.id === Specialization.KlingonShipCaptain) {
      ranks = [RanksHelper.instance().getRank(Rank.Captain)];
    } else if (specialization.id === Specialization.CardassianGul) {
      ranks = [RanksHelper.instance().getRank(Rank.Gul)];
    } else if (specialization.id === Specialization.TholianWarrior) {
      ranks = [];
    } else if (specialization.id === Specialization.BreenThot) {
      ranks = [RanksHelper.instance().getRank(Rank.Thot)];
    } else if (
      [Specialization.BreenWarrior, Specialization.BreenEliteGuard].includes(
        specialization.id,
      )
    ) {
      ranks = [
        RanksHelper.instance().getRank(Rank.Chot),
        RanksHelper.instance().getRank(Rank.VelSh),
        RanksHelper.instance().getRank(Rank.OkChed),
        RanksHelper.instance().getRank(Rank.HRen),
      ];
    }

    ranks = ranks.filter(
      (r) =>
        r.id !== Rank.Yeoman1stClass &&
        r.id !== Rank.Yeoman2ndClass &&
        r.id !== Rank.Yeoman3rdClass &&
        r.id !== Rank.Specialist1stClass &&
        r.id !== Rank.Specialist2ndClass &&
        r.id !== Rank.Specialist3rdClass &&
        r.id !== Rank.ChiefSpecialist &&
        r.id !== Rank.MasterChiefSpecialist &&
        r.id !== Rank.SeniorChiefSpecialist,
    );

    if (ranks.length > 0) {
      // by using a logarithmic scale, I'm biasing the random values in favour
      // of the ranks at the higher end of the list (which are the more junior ranks)
      const maxValue = Math.pow(Math.E, ranks.length + 1);
      const random = Math.log1p(Math.random() * maxValue);
      const index = Math.min(ranks.length - 1, Math.max(0, Math.floor(random)));
      const rank = ranks[index];

      if (
        specialization.id === Specialization.MedicalDoctor &&
        rank.id === Rank.Ensign
      ) {
        character.jobAssignment = specialization.localizedName + ' (Resident)';
      }

      character.rankValue = new CharacterRank(rank.name, rank.id);
    }
  }
}
