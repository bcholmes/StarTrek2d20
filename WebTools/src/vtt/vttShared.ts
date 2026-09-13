import type { SelectedTalent } from '../common/selectedTalent';
import { Attribute } from '../helpers/attributes';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import { Department } from '../helpers/department';

export function resolveTalentDescription(
  selectedTalent: SelectedTalent,
  version: number,
  applyChallengeDiceNormalization = false,
): string {
  const description = selectedTalent.isCustom
    ? selectedTalent.customTalentDescription
    : version === 1
      ? selectedTalent.talentModel.localizedDescription
      : selectedTalent.talentModel.localizedDescription2e;
  return applyChallengeDiceNormalization
    ? description.replace(CHALLENGE_DICE_NOTATION, 'CD')
    : description;
}

export function departmentName(department: Department): string {
  return Department[department].toLowerCase();
}

export function attributeName(attribute: Attribute): string {
  return Attribute[attribute].toLowerCase();
}

export function splitToParagraphs(text: string): string[] {
  return text.split('\n').filter((s) => s?.length);
}
