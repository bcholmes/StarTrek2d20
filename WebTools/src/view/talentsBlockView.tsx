import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_EXPANDED_MUNITIONS,
  TALENT_NAME_EXPANSIVE_DEPARTMENT,
  TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X,
  TALENT_NAME_IM_A_DOCTOR_NOT_A,
  TALENT_NAME_REDUNDANT_SYSTEMS,
  TalentsHelper,
} from '../helpers/talents';
import { replaceDiceWithArrowhead } from '../common/arrowhead';
import { Stereotype } from '../common/construct';
import { Starship } from '../common/starship';
import { Character } from '../common/character';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import type { Creature } from '../creature/model/creature';
import { makeKey } from '../common/translationKey';
import { Attribute } from '../helpers/attributes';
import { Department } from '../helpers/department';
import { System } from '../helpers/systems';
import type { PropulsionSystemType } from '../helpers/propulsionSystem';
import { PropulsionSystemModel } from '../helpers/propulsionSystem';
import { Weapon } from '../helpers/weapons';
import { Station } from '../common/station';
import type { TalentModel } from '../helpers/talentModel';
import { STAMarkdown } from '../components/staMarkdown';

interface IConstructPageProperties {
  construct: Character | Starship | Creature | Station;
}

export const TalentsBlockView: React.FC<IConstructPageProperties> = ({
  construct,
}) => {
  const { t } = useTranslation();

  const renderDescription = (
    talentName: string,
    talent: TalentModel,
    x?: number,
    description?: string,
  ) => {
    if (description === undefined) {
      description =
        construct.version === 1
          ? talent.localizedDescription
          : talent.localizedDescription2e;
    }
    if (talent.isXQualified && x !== undefined) {
      if (description.includes(' X.')) {
        description = description.replace(' X.', ' ' + x + '.');
      }
      if (description.includes(' X ')) {
        description = description.replace(' X ', ' ' + x + ' ');
      }
    }

    if (description.indexOf(CHALLENGE_DICE_NOTATION) >= 0) {
      return (
        <>
          <strong>
            {talent.localizedDisplayName +
              (talent.maxRank > 1
                ? ' [x' + construct.getRankForTalent(t.name) + ']'
                : '')}
            :
          </strong>{' '}
          {replaceDiceWithArrowhead(description)}
          {renderExtraDetails(talent)}
        </>
      );
    } else {
      return (
        <>
          <STAMarkdown className="markdown-sm">
            {'**' + talentName + ':** ' + description}
          </STAMarkdown>
          {renderExtraDetails(talent)}
        </>
      );
    }
  };

  const renderExtraDetails = (talent: TalentModel) => {
    if (
      [
        TALENT_NAME_AUGMENTED_ABILITY,
        TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X,
      ].includes(talent.name)
    ) {
      const character = construct as Character;
      const selectedAttributes = character.talents
        .filter((s) => s.talent === talent.name && s.attribute != null)
        .map((s) => t(makeKey('Construct.attribute.', Attribute[s.attribute])))
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.attribute') + ': '}</b>
          {selectedAttributes}
        </div>
      );
    } else if (
      [
        TALENT_NAME_COLLABORATION,
        TALENT_NAME_BOLD,
        TALENT_NAME_CAUTIOUS,
        TALENT_NAME_IM_A_DOCTOR_NOT_A,
      ].includes(talent.name)
    ) {
      const character = construct as Character;
      const selectedAttributes = character.talents
        .filter((s) => s.talent === talent.name && s.department != null)
        .map((s) =>
          t(makeKey('Construct.discipline.', Department[s.department])),
        )
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.department') + ': '}</b>
          {selectedAttributes}
        </div>
      );
    } else if (
      [TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM].includes(talent.name)
    ) {
      const starship = construct as Starship;
      const propulsion = starship.talents
        .filter((s) => s.talent === talent.name && s.selection != null)
        .map(
          (s) =>
            PropulsionSystemModel.getByType(s.selection as PropulsionSystemType)
              ?.localizedName,
        )
        .join(', ');
      return <div className="text-sm px-4">{propulsion}</div>;
    } else if ([TALENT_NAME_EXPANDED_MUNITIONS].includes(talent.name)) {
      const starship = construct as Starship;
      const propulsion = starship.talents
        .filter((s) => s.talent === talent.name && s.weapon != null)
        .map((s) =>
          s.weapon instanceof Weapon
            ? (s.weapon as Weapon).name
            : (s.weapon as string),
        )
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.weapons') + ': '}</b>
          {propulsion}
        </div>
      );
    } else if (
      [
        TALENT_NAME_DEDICATED_PERSONNEL,
        TALENT_NAME_EXPANSIVE_DEPARTMENT,
      ].includes(talent.name)
    ) {
      const starship = construct as Starship;
      const selectedAttributes = starship.talents
        .filter((s) => s.talent === talent.name && s.department != null)
        .map((s) =>
          t(makeKey('Construct.department.', Department[s.department])),
        )
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.department') + ': '}</b>
          {selectedAttributes}
        </div>
      );
    } else if ([TALENT_NAME_REDUNDANT_SYSTEMS].includes(talent.name)) {
      const starship = construct as Starship;
      const selectedAttributes = starship.talents
        .filter((s) => s.talent === talent.name && s.system != null)
        .map((s) => t(makeKey('Construct.system.', System[s.system])))
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.systems') + ': '}</b>
          {selectedAttributes}
        </div>
      );
    } else if (
      [
        'Peak Performance (Service Record)',
        'The Last Generation (Service Record)',
        'Upgraded Systems (Service Record)',
      ].includes(talent.name)
    ) {
      const starship = construct as Starship;
      const selectedAttributes = starship.talents
        .filter((s) => s.talent === talent.name && s.system != null)
        .map((s) => t(makeKey('Construct.system.', System[s.system])))
        .join(', ');
      return (
        <div className="text-sm px-4">
          <b>{t('Construct.other.systems') + ': '}</b>
          {selectedAttributes}
        </div>
      );
    } else {
      return undefined;
    }
  };

  const renderStarshipTalents = (construct: Station | Starship) => {
    const talents = construct?.rankedTalents.map((selectedTalent, i) => {
      const t = selectedTalent.talentModel;
      const name = selectedTalent.displayNameWithMultiple;
      let description = undefined;
      if (selectedTalent.isCustom) {
        description = selectedTalent.customTalentDescription;
      }
      if (t.isSpecialRule(construct.version)) {
        return null;
      } else if (construct.stereotype === Stereotype.SoloStarship) {
        return (
          <div
            className="text-white view-border-bottom py-2"
            key={'talent-' + i}
          >
            <strong>
              {t.localizedDisplayName +
                (t.maxRank > 1
                  ? ' [x' + construct.getRankForTalent(t.name) + ']'
                  : '')}
              :
            </strong>{' '}
            {replaceDiceWithArrowhead(t.localizedSoloDescription)}
          </div>
        );
      } else {
        return (
          <div
            className="text-white view-border-bottom py-2"
            key={'talent-' + i}
          >
            {renderDescription(name, t, undefined, description)}
          </div>
        );
      }
    });

    const specialRules = construct
      ?.getDistinctTalentNameList()
      .map((tName, i) => {
        const t = TalentsHelper.getTalent(tName);
        let name = t.localizedName;
        const starship = construct as Starship;
        const qualifier = starship.getQualifierForTalent(tName);
        if (qualifier?.length) {
          name += ' [' + qualifier + ']';
        }
        const talentName =
          name +
          (t.maxRank > 1
            ? ' [x' + construct.getRankForTalent(t.name) + ']'
            : '');
        if (!t.isSpecialRule(construct.version)) {
          return null;
        } else if (construct.stereotype === Stereotype.SoloStarship) {
          return (
            <div
              className="text-white view-border-bottom py-2"
              key={'talent-' + i}
            >
              <strong>
                {t.localizedDisplayName +
                  (t.maxRank > 1
                    ? ' [x' + construct.getRankForTalent(t.name) + ']'
                    : '')}
                :
              </strong>{' '}
              {replaceDiceWithArrowhead(t.localizedSoloDescription)}
            </div>
          );
        } else {
          return (
            <div
              className="text-white view-border-bottom py-2"
              key={'talent-' + i}
            >
              {renderDescription(talentName, t)}
            </div>
          );
        }
      });

    return (
      <>
        {talents?.filter((s) => s != null)?.length ? (
          <>
            <Header level={2} className="mt-4">
              {t('Construct.other.talents')}
            </Header>
            {talents}
          </>
        ) : null}
        {specialRules?.filter((s) => s != null)?.length ? (
          <>
            <Header level={2} className="mt-4">
              {t('Construct.other.specialRules')}
            </Header>
            {specialRules}
          </>
        ) : null}
      </>
    );
  };

  const renderCharacterTalents = () => {
    return (
      <>
        <Header level={2} className="mt-4">
          {construct.stereotype === Stereotype.Npc
            ? t('Construct.other.specialRules')
            : t('Construct.other.talents')}
        </Header>
        {(construct as Character)?.rankedTalents.map((s, i) => {
          let x = undefined;
          const t = s.talentModel;
          if (t.isXQualified) {
            x = s.x;
          }
          const talentName = s.displayNameWithMultiple;
          return (
            <div
              className="text-white view-border-bottom py-2"
              key={'talent-' + i}
            >
              {renderDescription(
                talentName,
                t,
                x,
                s.isCustom ? s.customTalentDescription : undefined,
              )}
            </div>
          );
        })}
      </>
    );
  };

  const renderCreatureTalents = () => {
    const creature = construct as Creature;
    let x = undefined;
    return (
      <>
        <Header level={2} className="mt-4">
          {t('Construct.other.specialRules')}
        </Header>
        {creature?.getDistinctTalentNameList().map((tName, i) => {
          const temp = creature.talents.filter((t) => t.talent === tName);
          if (temp.length) {
            const selectedTalent = temp[0];
            x = selectedTalent.x;
            return (
              <div
                className="text-white view-border-bottom py-2"
                key={'talent-' + i}
              >
                {renderDescription(
                  selectedTalent.displayName,
                  TalentsHelper.getTalent(selectedTalent.talent),
                  x,
                )}
              </div>
            );
          } else {
            return undefined;
          }
        })}
      </>
    );
  };

  if (construct?.getDistinctTalentNameList()?.length) {
    if (construct instanceof Character) {
      return renderCharacterTalents();
    } else if (construct instanceof Starship || construct instanceof Station) {
      return renderStarshipTalents(construct);
    } else {
      return renderCreatureTalents();
    }
  } else {
    return undefined;
  }
};
