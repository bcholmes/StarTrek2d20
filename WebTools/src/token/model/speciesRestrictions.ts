import { SimpleColor } from '../../common/colour';
import { Species } from '../../helpers/speciesEnum';
import { ExtraType } from './extrasTypeEnum';
import { HairType, allHairTypes, isTallForeheadHair } from './hairTypeEnum';
import { HeadType } from './headTypeEnum';
import { MouthType } from './mouthTypeEnum';
import { NoseType, allNoseTypes } from './noseTypeEnum';
import { SpeciesOption } from './speciesOptionEnum';
import { UniformEra, allUniformEras } from './uniformEra';

export class SpeciesRestrictions {
  // default in the sense that "the drawing was originally created using this skin colour"
  static DEFAULT_SKIN_COLOR = '#cd976d';
  static DEFAULT_SKIN_COLOR_REGEX = /#cd976d/g;

  static DEFAULT_HAIR_COLOR = '#383838';
  static DEFAULT_HAIR_COLOR_REGEX = /#383838/g;

  static DEFAULT_LIPSTICK_COLOR = '#a9777a';

  static DEFAULT_EYE_COLOR_REGEX = /#754324/g;

  static readonly LIP_COLOUR = SimpleColor.from('#f4b39b');
  static readonly DARK_LIP_COLOUR = SimpleColor.from('#aa6778');

  static getUniformTypes(species: Species) {
    if (species === Species.Cetacean) {
      return [UniformEra.DominionWar, UniformEra.LowerDecks];
    } else if (species === Species.Edosian) {
      return [
        UniformEra.DominionWar,
        UniformEra.Picard25,
        UniformEra.OriginalSeries,
      ];
    } else if (species === Species.Tholian) {
      return [UniformEra.None];
    } else if (species === Species.Tzenkethi) {
      return [UniformEra.None, UniformEra.Tzenkethi];
    } else {
      return allUniformEras().filter(
        (e) => e !== UniformEra.None && e !== UniformEra.Tzenkethi,
      );
    }
  }

  static getSkinColors(species: Species) {
    if (species === Species.Orion) {
      return [
        '#a2b152',
        '#8e932f',
        '#8f8f0b',
        '#838218',
        '#7a863a',
        '#6f7f36',
        '#6b764c',
        '#697543',
        '#5d6937',
        '#5a6135',
        '#4c4c1a',
        '#414b26',
      ];
    } else if (species === Species.Aenar) {
      return ['#F1F0F4', '#E4E2E9', '#DDDBE3', '#bcbcc4', '#bbb6c7'];
    } else if (species === Species.Andorian) {
      return [
        '#bbb6c7',
        '#b0c2cc',
        '#a9d8f4',
        '#7ca9e0',
        '#919bd5',
        '#6e87bf',
        '#3e8fb8',
        '#0068a5',
      ];
    } else if (species === Species.Ariolo) {
      return ['#7c6a61', '#626163', '#603f31'];
    } else if (species === Species.Aurelian) {
      return [
        '#fbebb7',
        '#f7d66f',
        '#e0c167',
        '#b7d562',
        '#b6b456',
        '#b49249',
        '#87622a',
      ];
    } else if (species === Species.Benzite) {
      return ['#b0c2cc', '#a9d8f4', '#7ca9e0', '#919bd5', '#6e87bf', '#3e8fb8'];
    } else if (species === Species.BlueOrion) {
      return [
        '#b0c2cc',
        '#a8dad1',
        '#a9d8f4',
        '#6ed8ce',
        '#7ca9e0',
        '#919bd5',
        '#6e87bf',
        '#3e8fb8',
        '#03a6a1',
      ];
    } else if (species === Species.Bynar) {
      return ['#cda3ce'];
    } else if (species === Species.Cardassian) {
      return ['#dcd5d0', '#c4bab1', '#b4a8a8', '#998679', '#a88872'];
    } else if (species === Species.Bolian) {
      return ['#97c3f2', '#87acda', '#5883a6', '#5772b7', '#0665b3', '#385f8d']; // "#597986",
    } else if (species === Species.Edosian) {
      return ['#d18352'];
    } else if (species === Species.Ferengi) {
      return ['#d18352'];
    } else if (species === Species.Caitian) {
      return [
        '#fdf2dc',
        '#fae9b5',
        '#f0c882',
        '#f9c861',
        '#e9a63d',
        '#e38732',
        '#913c13',
        '#430c05',
        '#4e0300',
        '#811002',
        '#391201',
        '#722707',
        SpeciesRestrictions.DEFAULT_HAIR_COLOR,
        '#37261e',
        '#706f74',
        '#a78c6f',
        '#f1eae4',
        '#f4f3f1',
        '#e1ddda',
      ];
    } else if (species === Species.Efrosian) {
      return [
        '#ffd9c6',
        '#d8b092',
        '#e1ad88',
        '#d69972',
        '#d18352',
        '#b06e46',
        '#9e603b',
        '#834b2b',
        '#70432c',
      ];
    } else if (species === Species.Jelna) {
      return ['#f5e5d3', '#f0dcca', '#decbbe', '#d5cbd4', '#756352'];
    } else if (species === Species.JemHadar) {
      return ['#b7b7b1', '#a59f95', '#86828a', '#7c7972'];
    } else if (species === Species.Reman) {
      return ['#ccc9be', '#c8d9d6', '#b4bdb8', '#96a09c'];
    } else if (species === Species.Saurian) {
      return [
        '#de898a',
        '#ca7882',
        '#b6677a',
        '#a77e86',
        '#989591',
        '#626163',
        '#7c6a61',
        '#603f31',
      ];
    } else if (species === Species.Suliban) {
      return ['#c7b799', '#d1ba77', '#bea55f', '#c6b923'];
    } else if (species === Species.Tzenkethi) {
      return [
        '#6d5830',
        '#7b4344',
        '#344453',
        '#504c74',
        '#777398',
        '#524035',
        '#594a3d',
        '#6ca4ab',
      ];
    } else if (species === Species.XindiReptilian) {
      return ['#bbb895', '#aea433', '#bba326', '#898558'];
    } else {
      return [
        '#F8E0DE',
        '#F4D5CA',
        '#F2C8B8',
        '#E1BA93',
        '#dcbda1',
        '#CEB29C',
        '#CAA18B',
        SpeciesRestrictions.DEFAULT_SKIN_COLOR,
        '#AB7D5C',
        '#9B7A57',
        '#9b6b43',
        '#8C644A',
        '#704A35',
        '#53382D',
        '#473028',
      ];
    }
  }

  static getHeadTypes(species: Species) {
    if (species === Species.Caitian) {
      return [
        HeadType.SquareJawed,
        HeadType.RoundedAverage,
        HeadType.PointedDelicate,
      ];
    } else if (species === Species.Kelpien) {
      return [HeadType.SquareJawed, HeadType.RoundedAverage];
    } else if (species === Species.Suliban) {
      return [HeadType.SquareJawed, HeadType.RoundedAverage];
    } else if (species === Species.Jelna) {
      return [HeadType.SquareJawed, HeadType.RoundedAverage];
    } else if (this.isRubberHeaded(species) && species !== Species.Benzite) {
      return [HeadType.RoundedAverage];
    } else if (species === Species.Zakdorn) {
      return [
        HeadType.RoundedNarrow,
        HeadType.SofterNarrow,
        HeadType.PointedDelicate,
        HeadType.Elfin,
      ];
    } else {
      return [
        HeadType.AverageAngular,
        HeadType.SquareJawed,
        HeadType.RoundedNarrow,
        HeadType.RoundedAverage,
        HeadType.SofterNarrow,
        HeadType.PointedDelicate,
        HeadType.Rectangular,
        HeadType.Elfin,
        HeadType.PillShaped,
        HeadType.RoundedHeavy,
      ];
    }
  }

  static getEyeColors(species: Species) {
    if (species === Species.Betazoid || species === Species.Saurian) {
      return ['#111111'];
    } else if (species === Species.Aenar) {
      return ['#dddddd'];
    } else {
      return [
        '#dddddd',
        '#e1bbc3',
        '#8bb5db',
        '#4079c0',
        '#b4b8b9',
        '#8e9796',
        '#758a9d',
        '#88967d',
        '#6e9d4d',
        '#fdd089',
        '#fbb03b',
        '#aa6925',
        '#863603',
        '#56220c',
        '#3f0c08',
        '#280000',
      ];
    }
  }

  static getMouthTypes(species: Species) {
    if (species === Species.Pakled) {
      return [
        MouthType.Mouth1,
        MouthType.Mouth2,
        MouthType.Mouth3,
        MouthType.Mouth4,
        MouthType.Mouth5,
        MouthType.Mouth6,
        MouthType.Mouth7,
        MouthType.Mouth8,
        MouthType.Mouth1Lipstick,
        MouthType.Mouth2Lipstick,
        MouthType.Mouth3Lipstick,
        MouthType.Mouth4Lipstick,
        MouthType.Mouth5Lipstick,
        MouthType.Mouth6Lipstick,
      ];
    } else if (species === Species.Zakdorn) {
      return [MouthType.Mouth1];
    } else {
      return [
        MouthType.Mouth1,
        MouthType.Mouth2,
        MouthType.Mouth3,
        MouthType.Mouth4,
        MouthType.Mouth5,
        MouthType.Mouth6,
        MouthType.Mouth1Lipstick,
        MouthType.Mouth2Lipstick,
        MouthType.Mouth3Lipstick,
        MouthType.Mouth4Lipstick,
        MouthType.Mouth5Lipstick,
        MouthType.Mouth6Lipstick,
      ];
    }
  }

  static getDefaultEyeColor(species: Species) {
    const colours = SpeciesRestrictions.getEyeColors(species);
    return colours[Math.floor(colours.length / 2)];
  }

  static getHairColors(species: Species) {
    if (
      species === Species.Aenar ||
      species === Species.Andorian ||
      species === Species.Efrosian
    ) {
      return ['#fdf2dc', '#f8edf3', '#bbbbbb', '#dddddd'];
    } else {
      return [
        '#fdf2dc',
        '#fae9b5',
        '#f0c882',
        '#f9c861',
        '#e9a63d',
        '#e38732',
        '#913c13',
        '#430c05',
        '#4e0300',
        '#811002',
        '#ba260a',
        '#230703',
        '#391201',
        '#722707',
        '#202020',
        '#2a2a2a',
        SpeciesRestrictions.DEFAULT_HAIR_COLOR,
        '#37261e',
        '#706f74',
        '#a78c6f',
        '#c7b799',
        '#f1eae4',
        '#f4f3f1',
        '#e1ddda',

        '#d0c7e2',
        '#bcb8db',
        '#8180bc',
        '#6d6aaf',
        '#514fa3',
        '#352f8f',
        '#3d387a',
        '#f8edf3',
        '#f2d7e0',
        '#e8c2cf',
        '#dea9bb',
        '#dca7b9',
        '#d6a1b3',
        '#a67a89',
        '#c9df8a',
        '#77ab59',
        '#11823b',
        '#36802d',
        '#234d20',
        '#004d25',
        '#02231c',
      ];
    }
  }

  static getLipstickColors(species: Species) {
    return [
      '#a9777a',
      '#8f575a',
      '#783d53',
      '#852d67',
      '#81152b',
      '#e1272a',
      '#c5232e',
      '#e02d40',
      '#9e2632',
      '#95242a',
      '#c77f70',
      '#e45e69',
      '#ce5c56',
      '#c24853',
      '#e92154',
      '#e595bf',
      '#ef4b8c',
      '#e856bb',
      '#ac4f7e',
      '#be2d70',
      '#c36f93',
      '#ca6a85',
      '#cd5d89',
      '#a63f5c',
      '#ad4f5d',
      '#de928f',
      '#ec909b',
      '#e2889e',
      '#d67788',
      '#c89898',
    ];
  }

  static getHairTypes(species: Species): HairType[] {
    if (
      species !== Species.Jelna &&
      (this.isBald(species) || SpeciesRestrictions.isRubberHeaded(species))
    ) {
      return [HairType.Bald];
    } else if (species === Species.Andorian) {
      // the corn rows don't look right with the Antennae
      return allHairTypes().filter((h) => h !== HairType.CornRows);
    } else if (species === Species.Cardassian) {
      return allHairTypes().filter(
        (h) =>
          ![
            HairType.CornRows,
            HairType.ChinLengthCombBack,
            HairType.RomulanPeakedHair,
            HairType.ShoulderLengthBob,
          ].includes(h),
      );
    } else if (this.isTallForeheaded(species)) {
      return allHairTypes().filter((h) => isTallForeheadHair(h));
    } else {
      return allHairTypes();
    }
  }

  static getDefaultHairType(species: Species) {
    if (species === Species.Efrosian) {
      return HairType.HighForeheadEfrosianStyle;
    } else if (species === Species.Cardassian) {
      return HairType.StraightCombedBackShort;
    } else {
      return this.getHairTypes(species)[0];
    }
  }

  static isFacialHairSupportedFor(species: Species) {
    return !this.isBald(species) && !this.isRubberHeaded(species);
  }

  static isHairCoveringForehead(hair: HairType) {
    switch (hair) {
      case HairType.BowlCutHair:
      case HairType.TousledSidePart:
      case HairType.MediumLengthFemaleSidePart:
      case HairType.ShoulderLengthBob:
      case HairType.ShortTeasedOverEyeStyle:
      case HairType.FeminineDreadStyle:
      case HairType.RomulanPeakedHair:
        return true;
      default:
        return false;
    }
  }

  static isOptionsSupportedFor(species: Species) {
    return this.getSpeciesOptions(species).length > 1;
  }

  static isExtraAvailableFor(
    extra: ExtraType,
    primarySpecies: Species,
    secondarySpecies: Species,
    uniformEra: UniformEra,
  ) {
    let species = primarySpecies;
    if (primarySpecies === Species.LiberatedBorg) {
      species = secondarySpecies;
    }

    if (extra === ExtraType.BajoranEarring) {
      return species === Species.Bajoran;
    } else if (
      extra === ExtraType.BynarHeadpiece1 ||
      extra === ExtraType.BynarHeadpiece2
    ) {
      return species === Species.Bynar;
    } else if (
      extra === ExtraType.SimpleEarring ||
      extra === ExtraType.HoopEarring
    ) {
      return (
        species !== Species.Bolian &&
        !this.isRubberHeaded(species) &&
        species !== Species.Ferengi
      ); // Bolians have weird ears
    } else if (extra === ExtraType.RisanSymbol) {
      return species === Species.Risian;
    } else if (
      extra === ExtraType.SmallBindi ||
      extra === ExtraType.InuitTattoo
    ) {
      return species === Species.Human;
    } else if (extra === ExtraType.FerengiHeadFlap) {
      return species === Species.Ferengi;
    } else if (extra === ExtraType.FerengiRankTattoo) {
      return species === Species.Ferengi && uniformEra === UniformEra.Ferengi;
    } else if (
      extra === ExtraType.OrionPiece1 ||
      extra === ExtraType.OrionPiece2 ||
      extra === ExtraType.OrionPiece3
    ) {
      return species === Species.Orion;
    } else if (extra === ExtraType.VulcanHeaddress) {
      return species === Species.Vulcan && uniformEra === UniformEra.Civilian;
    } else if (extra === ExtraType.ZaraniteMask) {
      return species === Species.Zaranite;
    } else if (extra === ExtraType.Freckles) {
      return [Species.Human, Species.Haliian, Species.Ardanan].includes(
        species,
      );
    } else if (extra === ExtraType.SecurityHelmet) {
      return (
        uniformEra === UniformEra.MonsterMaroon &&
        !SpeciesRestrictions.isRubberHeaded(species)
      );
    } else if (extra === ExtraType.Visor) {
      return (
        species !== Species.Cetacean &&
        species !== Species.Tholian &&
        species !== Species.Tzenkethi &&
        primarySpecies !== Species.LiberatedBorg
      );
    } else if (
      [
        ExtraType.BorgCheekImplant1,
        ExtraType.BorgJawImplant2,
        ExtraType.BorgEyebrowImplant3,
        ExtraType.BorgEyeImplant4,
        ExtraType.BorgEyeImplant5,
        ExtraType.BorgEyeImplant6,
      ].includes(extra)
    ) {
      return primarySpecies === Species.LiberatedBorg;
    } else {
      return true;
    }
  }

  static isBald(species: Species) {
    return (
      species === Species.Benzite ||
      species === Species.Bolian ||
      species === Species.Deltan ||
      species === Species.Ferengi ||
      species === Species.Saurian ||
      species === Species.Talaxian ||
      species === Species.XindiReptilian
    );
  }

  static isTallForeheaded(species: Species) {
    return (
      species === Species.Efrosian ||
      species === Species.Klingon ||
      species === Species.Ktarian ||
      species === Species.Napean ||
      species === Species.Tellarite ||
      species === Species.XindiPrimate
    );
  }

  static isRubberHeaded(species: Species) {
    return (
      species === Species.Ariolo ||
      species === Species.Aurelian ||
      species === Species.Bynar ||
      species === Species.Benzite ||
      species === Species.Caitian ||
      species === Species.Cetacean ||
      species === Species.Edosian ||
      species === Species.Grazerite ||
      species === Species.Jelna ||
      species === Species.JemHadar ||
      species === Species.Kelpien ||
      species === Species.Reman ||
      species === Species.Saurian ||
      species === Species.Suliban ||
      species === Species.Tholian ||
      species === Species.Tzenkethi ||
      species === Species.XindiArboreal ||
      species === Species.XindiReptilian ||
      species === Species.Yridian ||
      species === Species.Zaranite
    );
  }

  static getSpeciesOptions(species: Species) {
    if (species === Species.Bolian) {
      return [SpeciesOption.Option1, SpeciesOption.Option2];
    } else if (species === Species.Ferengi) {
      return [
        SpeciesOption.Option1,
        SpeciesOption.Option2,
        SpeciesOption.Option3,
      ];
    } else if (species === Species.Klingon) {
      return [
        SpeciesOption.Option1,
        SpeciesOption.Option2,
        SpeciesOption.Option3,
        SpeciesOption.Option4,
        SpeciesOption.Option5,
        SpeciesOption.Option6,
        SpeciesOption.Option7,
      ];
    } else if (species === Species.Romulan) {
      return [SpeciesOption.Option1, SpeciesOption.Option2];
    } else if (species === Species.Talaxian) {
      return [SpeciesOption.Option1, SpeciesOption.Option2];
    } else if (species === Species.Tellarite) {
      return [SpeciesOption.Option1, SpeciesOption.Option2];
    } else {
      return [SpeciesOption.Option1];
    }
  }

  static getNoseTypes(species: Species) {
    if (
      species === Species.Cardassian ||
      species === Species.Ferengi ||
      species === Species.Talaxian ||
      species === Species.Tellarite ||
      species === Species.Zakdorn
    ) {
      return [NoseType.StraightBasic];
    } else {
      return allNoseTypes();
    }
  }

  static isHumanLikeSkinColouring(species: Species) {
    const colours = SpeciesRestrictions.getSkinColors(species);
    const humanSkinColours = SpeciesRestrictions.getSkinColors(Species.Human);
    let result = colours.length === humanSkinColours.length;
    if (result) {
      colours.forEach((c, i) => (result = result && c === humanSkinColours[i]));
    }
    return result;
  }

  static isDarkSkinned(species: Species, skinColor: string) {
    if (this.isHumanLikeSkinColouring(species)) {
      const skinColours = SpeciesRestrictions.getSkinColors(species);
      const index = skinColours.indexOf(skinColor);
      return index >= Math.floor(skinColours.length / 2);
    } else {
      return false;
    }
  }
}
