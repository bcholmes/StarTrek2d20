import { TalentSelectionRow } from '../../components/singleTalentSelectionList';
import { RankedTalent } from '../../helpers/rankedTalent';
import type { AttackType } from '../../common/attackType';
import type { Character } from '../../common/character';
import type { SelectedTalent } from '../../common/selectedTalent';
import type { SpecialWeapon } from '../../common/specialWeapon';
import {
  AugmentedAbilitySelectionView,
  BoldOrCautiousDepartmentSelectionView,
  CollaborationDepartmentSelectionView,
  DefensiveTrainingAttackTypeSelectionView,
  ExpandedProgramSelectionView,
  UntappedPotentialSelectionView,
  VisitEveryStarSelectionView,
  WarriorsSpiritSelectionView,
  WisdomOfYearsSelectionView,
} from '../../components/selectedTalentDescriptionView';
import type { ITalent } from '../../helpers/italent';
import {
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_DEFENSIVE_TRAINING,
  TALENT_NAME_EXPANDED_PROGRAM,
  TALENT_NAME_UNTAPPED_POTENTIAL,
  TALENT_NAME_VISIT_EVERY_STAR,
  TALENT_NAME_WARRIORS_SPIRIT,
  TALENT_NAME_WISDOM_OF_YEARS,
} from '../../helpers/talents';

interface IAdditionalTalentInfoProperties {
  character: Character;
  talentSelection: SelectedTalent;
  setTalentSelection: (selection: SelectedTalent) => void;
  simpleHeader?: boolean;
}

export const isAdditionalTalentSupported = (talent?: ITalent) => {
  if (talent == null) {
    return false;
  } else {
    return [
      TALENT_NAME_AUGMENTED_ABILITY,
      TALENT_NAME_BOLD,
      TALENT_NAME_CAUTIOUS,
      TALENT_NAME_COLLABORATION,
      TALENT_NAME_EXPANDED_PROGRAM,
      TALENT_NAME_VISIT_EVERY_STAR,
      TALENT_NAME_WARRIORS_SPIRIT,
      TALENT_NAME_WISDOM_OF_YEARS,
      TALENT_NAME_UNTAPPED_POTENTIAL,
    ].includes(talent.name);
  }
};

export const AdditionalTalentInfo: React.FC<
  IAdditionalTalentInfoProperties
> = ({ character, talentSelection, setTalentSelection, simpleHeader }) => {
  if (talentSelection?.talent === TALENT_NAME_COLLABORATION) {
    return (
      <CollaborationDepartmentSelectionView
        onDepartmentSelection={(d) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.department = d;
          }
          setTalentSelection(temp);
        }}
        character={character}
        simpleHeader={simpleHeader}
        initialSelection={talentSelection.department}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_DEFENSIVE_TRAINING) {
    return (
      <DefensiveTrainingAttackTypeSelectionView
        onSelection={(a) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.selection = a as AttackType;
          }
          setTalentSelection(temp);
        }}
        character={character}
        initialSelection={talentSelection.selection as AttackType}
        simpleHeader={simpleHeader}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_AUGMENTED_ABILITY) {
    return (
      <AugmentedAbilitySelectionView
        onAttributeSelection={(a) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.attribute = a;
          }
          setTalentSelection(temp);
        }}
        character={character}
        initialSelection={talentSelection.attribute}
        simpleHeader={simpleHeader}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_UNTAPPED_POTENTIAL) {
    return (
      <UntappedPotentialSelectionView
        onAttributeSelection={(a) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.attribute = a;
          }
          setTalentSelection(temp);
        }}
        character={character}
        initialSelection={talentSelection.attribute}
        simpleHeader={simpleHeader}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_VISIT_EVERY_STAR) {
    return (
      <VisitEveryStarSelectionView
        onSelection={(f) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.focuses = f as string[];
          }
          setTalentSelection(temp);
        }}
        character={character}
        simpleHeader={simpleHeader}
        initialSelection={talentSelection?.focuses}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_EXPANDED_PROGRAM) {
    return (
      <ExpandedProgramSelectionView
        onSelection={(f) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.focuses = f as string[];
          }
          setTalentSelection(temp);
        }}
        character={character}
        simpleHeader={simpleHeader}
        initialSelection={talentSelection.focuses}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_WARRIORS_SPIRIT) {
    return (
      <WarriorsSpiritSelectionView
        onSelection={(w) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.selection = w as SpecialWeapon;
          }
          setTalentSelection(temp);
        }}
        character={character}
        simpleHeader={simpleHeader}
        initialSelection={talentSelection.selection as SpecialWeapon}
      />
    );
  } else if (talentSelection?.talent === TALENT_NAME_WISDOM_OF_YEARS) {
    return (
      <WisdomOfYearsSelectionView
        onFocusSelection={(f) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.focuses = [f];
          }
          setTalentSelection(temp);
        }}
        onValueSelection={(v) => {
          const temp = talentSelection.copy();
          if (temp) {
            temp.value = v;
          }
          setTalentSelection(temp);
        }}
        character={character}
        initialFocus={talentSelection.focuses[0]}
        initialValue={talentSelection.value}
        simpleHeader={simpleHeader}
      />
    );
  } else if (
    talentSelection?.talent === TALENT_NAME_BOLD ||
    talentSelection?.talent === TALENT_NAME_CAUTIOUS
  ) {
    return (
      <BoldOrCautiousDepartmentSelectionView
        onDepartmentSelection={(d) => {
          const temp = talentSelection?.copy();
          if (temp) {
            temp.department = d;
          }
          setTalentSelection(temp);
        }}
        talent={talentSelection.talentModel}
        initialSelection={talentSelection.department}
        character={character}
        simpleHeader={simpleHeader}
      />
    );
  } else if (talentSelection) {
    return (
      <table className="selection-list">
        <TalentSelectionRow
          detailsOnly
          talent={new RankedTalent(talentSelection.talentModel)}
          construct={character}
          selection={talentSelection}
          onSelection={setTalentSelection}
        />
      </table>
    );
  } else {
    return undefined;
  }
};
