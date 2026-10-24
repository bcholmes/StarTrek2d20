import i18next from 'i18next';
import { Division } from '../../common/character';
import { NamedColor } from './namedColour';
import { UniformEra } from './uniformEra';
import type { Rank } from '../../helpers/ranks';
import { isCadetRank } from './rankHelper';

export class DivisionColors {
  static getColors(era: UniformEra, rank?: Rank) {
    if (era === UniformEra.OriginalSeries) {
      return [
        new NamedColor(i18next.t('Division.command'), '#d1bd7f'),
        new NamedColor(i18next.t('Division.science'), '#718aa3'),
        new NamedColor(i18next.t('Division.operations'), '#cf1f35'),
      ];
    } else if (era === UniformEra.MonsterMaroon) {
      return [
        new NamedColor(i18next.t('Division.monsterMaroon.command'), '#f9f9f9'),
        new NamedColor(i18next.t('Division.monsterMaroon.science'), '#819bc9'),
        new NamedColor(
          i18next.t('Division.monsterMaroon.helmEngineering'),
          '#e8a232',
        ),
        new NamedColor(i18next.t('Division.monsterMaroon.medical'), '#85a774'),
        new NamedColor(i18next.t('Division.monsterMaroon.security'), '#2e4a22'),
        new NamedColor(
          i18next.t('Division.monsterMaroon.specialServices'),
          '#9eceff',
        ),
        new NamedColor(i18next.t('Division.monsterMaroon.trainee'), '#cf130b'),
      ];
    } else if (era === UniformEra.Enterprise) {
      return [
        new NamedColor(i18next.t('Division.command'), '#D5934C'),
        new NamedColor(i18next.t('Division.science'), '#30787E'),
        new NamedColor(i18next.t('Division.operations'), '#B12542'),
      ];
    } else if (era === UniformEra.Discovery23) {
      return [
        new NamedColor(i18next.t('Division.command'), '#c7a24a'),
        new NamedColor(i18next.t('Division.science'), '#aba7a8'),
        new NamedColor(i18next.t('Division.operations'), '#d69771'),
        new NamedColor(i18next.t('Division.discovery23.medical'), '#ffffff'),
      ];
    } else if (
      [UniformEra.Discovery32, UniformEra.StarfleetAcademy].includes(era)
    ) {
      const result = [
        new NamedColor(i18next.t('Division.command'), '#821217'),
        new NamedColor(i18next.t('Division.science'), '#174b89'),
        new NamedColor(i18next.t('Division.operations'), '#d8a91e'),
        new NamedColor(i18next.t('Division.discovery23.medical'), '#ffffff'),
      ];
      if (isCadetRank(rank)) {
        result.push(
          new NamedColor(i18next.t('Division.academy.undeclared'), '#5c6771'),
        );
      }
      return result;
    } else if (era === UniformEra.LowerDecks) {
      return [
        new NamedColor(i18next.t('Division.command'), '#e23d41'),
        new NamedColor(i18next.t('Division.science'), '#2d8ad7'),
        new NamedColor(i18next.t('Division.operations'), '#ecbf28'),
      ];
    } else if (era === UniformEra.VoyagerDS9) {
      return [
        new NamedColor(i18next.t('Division.command'), '#d01c2f'),
        new NamedColor(i18next.t('Division.science'), '#30787E'),
        new NamedColor(i18next.t('Division.operations'), '#eb9e3c'),
      ];
    } else if (era === UniformEra.NextGeneration) {
      return [
        new NamedColor(i18next.t('Division.command'), '#d01c2f'),
        new NamedColor(i18next.t('Division.science'), '#0070b8'),
        new NamedColor(i18next.t('Division.operations'), '#eb9e3c'),
      ];
    } else if (era === UniformEra.Prodigy) {
      return [
        new NamedColor(i18next.t('Division.command'), '#951d45'),
        new NamedColor(i18next.t('Division.science'), '#356fb1'),
        new NamedColor(i18next.t('Division.operations'), '#d28a1a'),
      ];
    } else if (era === UniformEra.Picard25) {
      return [
        new NamedColor(i18next.t('Division.command'), '#7b0304'),
        new NamedColor(i18next.t('Division.science'), '#156482'),
        new NamedColor(i18next.t('Division.operations'), '#d28a1a'),
      ];
    } else if (era === UniformEra.PicardRomulanEvacuation) {
      return [
        new NamedColor(i18next.t('Division.command'), '#7b0303'),
        new NamedColor(i18next.t('Division.science'), '#146482'),
        new NamedColor(i18next.t('Division.operations'), '#d28a1a'),
      ];
    } else if (era === UniformEra.StarTrekOnline) {
      return [
        new NamedColor(i18next.t('Division.command'), '#6b0007'),
        new NamedColor(i18next.t('Division.science'), '#0e6b86'),
        new NamedColor(i18next.t('Division.operations'), '#a06e0c'),
      ];
    } else if (era === UniformEra.TheMotionPicture) {
      return [
        new NamedColor(i18next.t('Division.command'), '#ffffff'),
        new NamedColor(i18next.t('Division.science'), '#f4802a'),
        new NamedColor(i18next.t('Division.tmp.medical'), '#86e299'),
        new NamedColor(i18next.t('Division.tmp.engineering'), '#ff0000'),
        new NamedColor(i18next.t('Division.operations'), '#ffee50'),
        new NamedColor(i18next.t('Division.tmp.security'), '#bbbaba'),
      ];
    } else if (era === UniformEra.StrangeNewWorlds) {
      return [
        new NamedColor(i18next.t('Division.command'), '#c8973b'),
        new NamedColor(i18next.t('Division.science'), '#0f4268'),
        new NamedColor(
          i18next.t('Division.strangeNewWorlds.medical'),
          '#87b9cb',
        ),
        new NamedColor(
          i18next.t('Division.strangeNewWorlds.nursing'),
          '#e4e4e4',
        ),
        new NamedColor(i18next.t('Division.operations'), '#a40d1c'),
      ];
    } else {
      return [
        new NamedColor(i18next.t('Division.command'), '#B12542'),
        new NamedColor(i18next.t('Division.science'), '#30787E'),
        new NamedColor(i18next.t('Division.operations'), '#D5934C'),
      ];
    }
  }

  static isCommand(era: UniformEra, color: string) {
    return this.getDivision(era, color) === Division[Division.Command];
  }

  static isScience(era: UniformEra, color: string) {
    return this.getDivision(era, color) === Division[Division.Science];
  }

  static getDivision(era: UniformEra, color: string) {
    const index = this.indexOf(era, color);
    if (!this.isDivisionColorsSupported(era)) {
      return null;
    } else if (era === UniformEra.TheMotionPicture) {
      const colours = [
        'Command',
        'Science',
        'Medical',
        'Engineering',
        'Operations',
        'Security',
      ];
      return index >= 0 ? colours[index] : null;
    } else if (era === UniformEra.MonsterMaroon) {
      const colours = [
        'Command',
        'Science',
        'HelmEngineering',
        'Medical',
        'Security',
        'Special Services',
        'Trainee',
      ];
      return index >= 0 ? colours[index] : null;
    } else if (era === UniformEra.Discovery23) {
      const colours = ['Command', 'Science', 'Operations', 'Medical'];
      return index >= 0 ? colours[index] : null;
    } else if (era === UniformEra.Discovery32) {
      const colours = ['Command', 'Science', 'Operations', 'Medical'];
      return index >= 0 ? colours[index] : null;
    } else if (era === UniformEra.StarfleetAcademy) {
      const colours = [
        'Command',
        'Science',
        'Operations',
        'Medical',
        'Undeclared',
      ];
      return index >= 0 ? colours[index] : null;
    } else if (era === UniformEra.StrangeNewWorlds) {
      const colours = [
        'Command',
        'Science',
        'Medical',
        'Nursing',
        'Operations',
      ];
      return index >= 0 ? colours[index] : null;
    } else {
      return index >= 0 ? Division[index] : null;
    }
  }

  static isDivisionColorsSupported(era: UniformEra) {
    return (
      era !== UniformEra.Klingon &&
      era !== UniformEra.OriginalSeriesKlingon &&
      era !== UniformEra.Civilian &&
      era !== UniformEra.JemHadar &&
      era !== UniformEra.Romulan &&
      era !== UniformEra.RomulanNemesis &&
      era !== UniformEra.Suliban &&
      era !== UniformEra.Ferengi &&
      era !== UniformEra.Bynar &&
      era !== UniformEra.Cardassian &&
      era !== UniformEra.Maco &&
      era !== UniformEra.None &&
      era !== UniformEra.Tzenkethi
    );
  }

  static indexOf(era: UniformEra, color: string) {
    let index = -1;
    this.getColors(era).forEach((c, i) => {
      if (c.color === color) {
        index = i;
      }
    });
    return index;
  }
}
