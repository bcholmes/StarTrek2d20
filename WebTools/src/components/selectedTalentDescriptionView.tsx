import React, { useState } from 'react';
import { replaceDiceWithArrowhead } from '../common/arrowhead';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import Markdown from 'react-markdown';
import { Header } from './header';
import type { SelectedTalent } from '../common/selectedTalent';
import { SpecialWeapon } from '../common/specialWeapon';
import { useTranslation } from 'react-i18next';
import { DropDownElement, DropDownSelect } from './dropDownInput';
import { FocusSelectionView } from './focusSelectionView';
import type { Character } from '../common/character';
import { ValueInput } from './valueInput';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import type { BorgImplantType } from '../helpers/borgImplant';
import { BorgImplants } from '../helpers/borgImplant';
import { CheckBox } from './checkBox';
import type { Attribute } from '../helpers/attributes';
import { SimpleAttributeSelector } from './simpleAttributeSelector';
import {
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
} from '../helpers/talents';
import { SimpleDepartmentSelector } from './simpleDepartmentSelector';
import type { Department } from '../helpers/department';
import { AttackType } from '../common/attackType';
import type { TalentModel } from '../helpers/talentModel';

interface ISelectedTalentDescriptionProperties {
  version: number;
  talent: SelectedTalent;
}

interface ITalentAttributeSelectionProperties {
  character: Character;
  initialSelection?: Attribute;
  onAttributeSelection: (a: Attribute) => void;
  simpleHeader?: boolean;
}

interface ITalentDepartmentSelectionProperties {
  character: Character;
  onDepartmentSelection: (d: Department) => void;
  initialSelection?: Department;
  simpleHeader?: boolean;
}

interface IBoldOrCautiousTalentDepartmentSelectionProperties extends ITalentDepartmentSelectionProperties {
  talent: TalentModel;
}

interface ITalentAdditionalSelectionProperties {
  character: Character;
  onSelection: (
    selection: string[] | SpecialWeapon | AttackType | undefined,
  ) => void;
  simpleHeader?: boolean;
  initialSelection?: string[] | SpecialWeapon | AttackType;
}

interface ITalentAdditionalFocusAndValueSelectionProperties {
  character: Character;
  onFocusSelection: (selection: string | undefined) => void;
  onValueSelection: (selection: string | undefined) => void;
  simpleHeader?: boolean;
  initialFocus?: string;
  initialValue?: string;
}

interface ISelectedTalentBorgImplantProperties {
  character: Character;
  initialSelection?: BorgImplantType[];
  onSelection: (selection: BorgImplantType[]) => void;
  simpleHeader?: boolean;
}

export const WarriorsSpiritSelectionView: React.FC<
  ITalentAdditionalSelectionProperties
> = ({ onSelection, initialSelection }) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<SpecialWeapon | undefined>(
    initialSelection as SpecialWeapon,
  );

  const options = () => {
    const result = [];
    result.push(new DropDownElement('', t('Common.select.choose')));
    result.push(new DropDownElement(SpecialWeapon.BatLeth, "Bat'leth"));
    result.push(new DropDownElement(SpecialWeapon.MekLeth, "Mek'leth"));
    return result;
  };

  return (
    <div>
      <Header level={2} className="my-4">
        {t('Talent.warriorsSpirit')}
      </Header>
      <DropDownSelect
        items={options()}
        defaultValue={selection ?? ''}
        onChange={(value) => {
          if (value === '') {
            onSelection(undefined);
            setSelection(undefined);
          } else {
            onSelection(value as SpecialWeapon);
            setSelection(value as SpecialWeapon);
          }
        }}
      />
    </div>
  );
};

export const VisitEveryStarSelectionView: React.FC<
  ITalentAdditionalSelectionProperties
> = ({ onSelection, character, initialSelection }) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string | undefined>(
    (initialSelection as string[])[0],
  );

  return (
    <div>
      <Header level={2} className="my-4">
        {t('Talent.visitEveryStar')}
      </Header>
      <FocusSelectionView
        addFocus={(f) => {
          setSelection(f);
          onSelection(f == null ? undefined : [f]);
        }}
        value={selection ?? ''}
        character={character}
        hints={[
          'Astronagivation',
          'Stellar Cartography',
          'Warp Field Theory',
          'Astronomy',
          'Heliophysics',
          'Cosmology',
          'Astrometry',
          'Planetology',
        ]}
        suggestions="Astronavigation, Stellar Cartography, or a similar field of space science."
      />
    </div>
  );
};

const randomValue = (character: Character) => {
  return randomUniqueValue(
    character.values,
    character.speciesStep?.species,
    character.educationStep?.primaryDiscipline,
  );
};

export const WisdomOfYearsSelectionView: React.FC<
  ITalentAdditionalFocusAndValueSelectionProperties
> = ({
  onFocusSelection,
  onValueSelection,
  character,
  initialFocus,
  initialValue,
}) => {
  const { t } = useTranslation();
  const [focusSelection, setFocusSelection] = useState<string | undefined>(
    initialFocus,
  );
  const [valueSelection, setValueSelection] = useState<string | undefined>(
    initialValue,
  );

  return (
    <div>
      <Header level={2} className="my-4">
        {t('Talent.wisdomOfYears')}
      </Header>
      <FocusSelectionView
        addFocus={(f) => {
          setFocusSelection(f);
          onFocusSelection(f);
        }}
        value={focusSelection ?? ''}
        character={character}
      />

      <ValueInput
        onValueChanged={(v) => {
          setValueSelection(v);
          onValueSelection(v);
        }}
        value={valueSelection ?? ''}
        onRandomClicked={() => {
          const value = randomValue(character);
          setValueSelection(value);
          onValueSelection(value);
        }}
      />
    </div>
  );
};

export const AugmentedAbilitySelectionView: React.FC<
  ITalentAttributeSelectionProperties
> = ({ onAttributeSelection, character, initialSelection, simpleHeader }) => {
  const { t } = useTranslation();
  const [attributeSelection, setAttributeSelection] = useState<
    Attribute | undefined
  >(initialSelection);

  const selectedAttributes = character.talents
    .filter(
      (t) =>
        t.talent === TALENT_NAME_AUGMENTED_ABILITY &&
        t.attribute !== initialSelection,
    )
    .map((t) => t.attribute);

  return (
    <div>
      {simpleHeader ? (
        <Header level={3} className="my-4">
          {t('Construct.other.attributes')}
        </Header>
      ) : (
        <Header level={2} className="my-4">
          {t('Talent.augmentedAbility')}
        </Header>
      )}
      <SimpleAttributeSelector
        character={character}
        isChecked={(a) => attributeSelection === a}
        onSelectAttribute={(a) => {
          setAttributeSelection(a);
          onAttributeSelection(a);
        }}
        isUpdateable={(a) => !selectedAttributes.includes(a)}
      />
    </div>
  );
};

export const UntappedPotentialSelectionView: React.FC<
  ITalentAttributeSelectionProperties
> = ({ onAttributeSelection, character, initialSelection, simpleHeader }) => {
  const { t } = useTranslation();
  const [attributeSelection, setAttributeSelection] = useState<
    Attribute | undefined
  >(initialSelection);

  return (
    <div>
      {simpleHeader ? (
        <Header level={3} className="my-4">
          {t('Construct.other.attributes')}
        </Header>
      ) : (
        <Header level={2} className="my-4">
          {t('Talent.untappedPotential')}
        </Header>
      )}
      <SimpleAttributeSelector
        character={character}
        isChecked={(a) => attributeSelection === a}
        onSelectAttribute={(a) => {
          setAttributeSelection(a);
          onAttributeSelection(a);
        }}
        isUpdateable={(a) => true}
      />
    </div>
  );
};
export const DefensiveTrainingAttackTypeSelectionView: React.FC<
  ITalentAdditionalSelectionProperties
> = ({ onSelection, simpleHeader, initialSelection }) => {
  const { t } = useTranslation();
  const [attackTypeSelection, setAttackTypeSelection] = useState<
    AttackType | undefined
  >(initialSelection as AttackType);
  const options = () => {
    const result = [];
    result.push(new DropDownElement('', t('Common.select.choose')));
    result.push(
      new DropDownElement(AttackType.Melee, t('Weapon.common.melee')),
    );
    result.push(
      new DropDownElement(AttackType.Ranged, t('Weapon.common.ranged')),
    );
    return result;
  };

  return (
    <div>
      {simpleHeader ? (
        <Header level={3} className="my-4">
          {t('Construct.other.attackType')}
        </Header>
      ) : (
        <Header level={2} className="my-4">
          {t('Talent.defensiveTraining')}
        </Header>
      )}
      <DropDownSelect
        items={options()}
        defaultValue={attackTypeSelection ?? ''}
        onChange={(value) => {
          if (value === '') {
            onSelection(undefined);
            setAttackTypeSelection(undefined);
          } else {
            onSelection(value as AttackType);
            setAttackTypeSelection(value as AttackType);
          }
        }}
      />
    </div>
  );
};

export const CollaborationDepartmentSelectionView: React.FC<
  ITalentDepartmentSelectionProperties
> = ({ onDepartmentSelection, character, simpleHeader, initialSelection }) => {
  const { t } = useTranslation();
  const [departmentSelection, setDepartmentSelection] = useState<
    Department | undefined
  >(initialSelection);

  const selectedDepartments = character.talents
    .filter(
      (t) =>
        t.talent === TALENT_NAME_COLLABORATION &&
        t.department !== initialSelection,
    )
    .map((t) => t.department);

  return (
    <div>
      {simpleHeader ? (
        <Header level={3} className="my-4">
          {t('Construct.other.departments')}
        </Header>
      ) : (
        <Header level={2} className="my-4">
          {t('Talent.collaboration')}
        </Header>
      )}
      <SimpleDepartmentSelector
        character={character}
        isChecked={(a) => departmentSelection === a}
        onSelectDepartment={(a) => {
          setDepartmentSelection(a);
          onDepartmentSelection(a);
        }}
        isUpdateable={(d) => !selectedDepartments.includes(d)}
      />
    </div>
  );
};

export const BoldOrCautiousDepartmentSelectionView: React.FC<
  IBoldOrCautiousTalentDepartmentSelectionProperties
> = ({
  onDepartmentSelection,
  character,
  talent,
  simpleHeader,
  initialSelection,
}) => {
  const { t } = useTranslation();
  const [departmentSelection, setDepartmentSelection] = useState<
    Department | undefined
  >(initialSelection);
  const selectedDepartments = character.talents
    .filter(
      (t) =>
        [TALENT_NAME_BOLD, TALENT_NAME_CAUTIOUS].includes(t.talent) &&
        t.department !== initialSelection,
    )
    .map((t) => t.department);

  return (
    <div>
      {simpleHeader ? (
        <Header level={3} className="my-4">
          {t('Construct.other.departments')}
        </Header>
      ) : (
        <Header level={2} className="my-4">
          {talent.localizedDisplayName}
        </Header>
      )}
      <SimpleDepartmentSelector
        character={character}
        isChecked={(a) => departmentSelection === a}
        onSelectDepartment={(a) => {
          setDepartmentSelection(a);
          onDepartmentSelection(a);
        }}
        isUpdateable={(d) => !selectedDepartments.includes(d)}
      />
    </div>
  );
};

export const BorgImplantsSelectionView: React.FC<
  ISelectedTalentBorgImplantProperties
> = ({ character, onSelection, initialSelection }) => {
  const [implantSelections, setImplantSelections] = useState<BorgImplantType[]>(
    initialSelection ?? [],
  );

  const implants = BorgImplants.instance.implants.map((implant) => {
    return (
      <tr key={'implant-' + implant.type}>
        <td>
          <CheckBox
            isChecked={implantSelections.includes(implant.type)}
            onChanged={(val) => {
              const temp = [...implantSelections];
              if (temp.includes(implant.type)) {
                temp.splice(temp.indexOf(implant.type), 1);
              } else {
                temp.push(implant.type);
              }
              if (temp.length > 3) {
                temp.splice(0, temp.length - 3);
              }
              onSelection(temp);
              setImplantSelections(temp);
            }}
            value={implant.name}
          />
        </td>
        <td>
          <div className="selection-header-small">
            <strong>{implant.name}</strong>
          </div>
          <div>{replaceDiceWithArrowhead(implant.description)}</div>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Header level={2} className="my-4">
        Borg Implants
      </Header>
      <table className="selection-list">
        <tbody>{implants}</tbody>
      </table>
    </div>
  );
};

export const ExpandedProgramSelectionView: React.FC<
  ITalentAdditionalSelectionProperties
> = ({ onSelection, character, initialSelection }) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string[]>(
    (initialSelection as string[]) ?? [],
  );

  return (
    <div>
      <Header level={2} className="my-4">
        {t('Talent.expandedProgram')}
      </Header>
      <FocusSelectionView
        label={t('Construct.other.focus1')}
        value={selection[0] ?? ''}
        addFocus={(f) => {
          const temp = [...selection];
          if (temp?.length) {
            temp[0] = f;
          } else {
            temp.push(f);
          }
          setSelection(temp);
          onSelection(temp);
        }}
        character={character}
      />
      <FocusSelectionView
        label={t('Construct.other.focus2')}
        value={selection[1] ?? ''}
        addFocus={(f) => {
          let temp = [...selection];
          if (temp) {
            if (!temp.length) {
              temp = ['', f];
            } else if (temp?.length === 1) {
              temp.push(f);
            } else {
              temp[1] = f;
            }
          }
          setSelection(temp);
          onSelection(temp);
        }}
        suggestions="Holonovel writing, Opera, Holo-photography, or anything else"
        character={character}
      />
    </div>
  );
};

export const SelectedTalentDescriptionView: React.FC<
  ISelectedTalentDescriptionProperties
> = ({ version, talent }) => {
  if (talent == null) {
    return undefined;
  } else {
    const talentDescription =
      version === 1
        ? talent.talentModel.localizedDescription
        : talent.talentModel.localizedDescription2e;
    const desc =
      talentDescription.indexOf(CHALLENGE_DICE_NOTATION) >= 0 ? (
        <p>{replaceDiceWithArrowhead(talentDescription)}</p>
      ) : (
        <Markdown>{talentDescription}</Markdown>
      );

    return (
      <div>
        <Header level={3}>{talent.talentModel.localizedName}</Header>
        {desc}
      </div>
    );
  }
};
