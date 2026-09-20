import { type Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import {
  cardassianBrownColour2e,
  divisionColour2e,
  ferengiOrangeColour2e,
  klingonRedColour2e,
  orionGreenColour2e,
  romulanGreenColour2e,
  tealColour2e,
  tholianFlameColour2e,
} from './colourProvider2e';

export const deriveSheetColour = (character: Character) => {
  if (
    character.type === CharacterType.Starfleet ||
    character.type === CharacterType.Cadet
  ) {
    const division = character.division;
    return division != null
      ? divisionColour2e(character.era, division)
      : tealColour2e;
  } else if (character.isKlingonImperialCitizen) {
    return klingonRedColour2e;
  } else if (character.isRomulanStarEmpire) {
    return romulanGreenColour2e;
  } else if (character.isOrion) {
    return orionGreenColour2e;
  } else if (character.isCardassian) {
    return cardassianBrownColour2e;
  } else if (character.isFerengi) {
    return ferengiOrangeColour2e;
  } else if (character.isTholian) {
    return tholianFlameColour2e;
  } else {
    return tealColour2e;
  }
};
