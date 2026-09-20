import React, { useEffect, useState } from 'react';
import { CheckBox } from './checkBox';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_CAMOUFLAGED_X,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_CUSTOM_TALENT,
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_DEFENSIVE_TRAINING,
  TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR,
  TALENT_NAME_EXPANDED_MUNITIONS,
  TALENT_NAME_EXPANDED_PROGRAM,
  TALENT_NAME_EXPANSIVE_DEPARTMENT,
  TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X,
  TALENT_NAME_IM_A_DOCTOR_NOT_A,
  TALENT_NAME_INITIATIVE_X,
  TALENT_NAME_MENACING_X,
  TALENT_NAME_MINELAYER,
  TALENT_NAME_NATURAL_PROTECTION_X,
  TALENT_NAME_REDUNDANT_SYSTEMS,
  TALENT_NAME_SWARM_X,
  TALENT_NAME_VISIT_EVERY_STAR,
  TALENT_NAME_WARRIORS_SPIRIT,
  TALENT_NAME_WISDOM_OF_YEARS,
} from '../helpers/talents';
import { replaceDiceWithArrowhead } from '../common/arrowhead';
import type { ITalent } from '../helpers/italent';
import { SelectedTalent } from '../common/selectedTalent';
import { DropDownElement, DropDownSelect } from './dropDownInput';
import { SpecialWeapon } from '../common/specialWeapon';
import { FocusSelectionView } from './focusSelectionView';
import type { Character } from '../common/character';
import { Department } from '../helpers/department';
import { ValueInput } from './valueInput';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import type { Construct } from '../common/construct';
import { BorgImplants } from '../helpers/borgImplant';
import { SimpleAttributeSelector } from './simpleAttributeSelector';
import {
  SimpleDepartmentSelector,
  StarshipDepartmentSelector,
} from './simpleDepartmentSelector';
import { AttackType } from '../common/attackType';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import Markdown from 'react-markdown';
import { t } from 'i18next';
import type { RankedTalent } from '../helpers/rankedTalent';
import { rankedTalentNameCompare } from '../helpers/rankedTalent';
import type { Starship } from '../common/starship';
import type { PropulsionSystemType } from '../helpers/propulsionSystem';
import { PropulsionSystemModel } from '../helpers/propulsionSystem';
import { Weapon } from '../helpers/weapons';
import { Button } from 'react-bootstrap';
import { ModalControl } from './modal';
import { AddWeaponView, AddWeaponMode } from '../starship/view/addWeaponView';
import { SimpleSystemSelector } from './simpleSystemSelector';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { RichTextEditor } from './richTextEditor';

interface ISingleTalentSelectionProperties {
  talents: RankedTalent[];
  construct: Construct;
  initialSelection?: ITalent | SelectedTalent;
  onSelection: (talent?: SelectedTalent) => void;
}

interface ITalentSelectionRowProperties {
  talent: RankedTalent;
  construct: Construct;
  selection: SelectedTalent;
  onSelection: (talent?: SelectedTalent) => void;
}

interface ISelectedTalentChoiceProperties {
  talentNames?: string[];
  construct: Construct;
  selection: SelectedTalent;
  setSelection: (SelectedTalent) => void;
}

interface IXSelectedTalentChoiceProperties extends ISelectedTalentChoiceProperties {
  min?: number;
  max?: number;
}

interface INumberToggleButtonProperties {
  label: number;
  selected: boolean;
  onClick: () => void;
}

const NumberToggleButton: React.FC<INumberToggleButtonProperties> = ({
  selected,
  label,
  onClick,
}) => {
  if (selected) {
    return (
      <div
        className="mx-1 p-3 bg-primary text-black rounded-circle text-center"
        style={{ height: '3rem', width: '3rem' }}
        role="button"
        onClick={onClick}
      >
        {label}
      </div>
    );
  } else {
    return (
      <div
        className="mx-1 p-3 bg-black text-primary border border-primary border-2 rounded-circle text-center"
        style={{ height: '3rem', width: '3rem' }}
        role="button"
        onClick={onClick}
      >
        {label}
      </div>
    );
  }
};

const XSelectionView: React.FC<IXSelectedTalentChoiceProperties> = ({
  construct,
  selection,
  min,
  max,
  setSelection,
}) => {
  const [x, setX] = useState<number | undefined>(selection.x);

  const assignX = (x: number) => {
    const temp = selection?.copy();
    if (temp) {
      temp.x = x;
    }
    setX(x);
    setSelection(temp);
  };

  const options = [];
  for (let i = min ?? 1; i <= (max ?? 6); i++) {
    options.push(i);
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="text-white py-3 pe-2">
        <big>
          <b>X:</b>
        </big>
      </div>
      {options.map((i) => (
        <NumberToggleButton
          label={i}
          selected={x === i}
          onClick={() => assignX(i)}
        />
      ))}
    </div>
  );
};

export const DepartmentSelectedTalentChoice: React.FC<
  ISelectedTalentChoiceProperties
> = ({ construct, talentNames, selection, setSelection }) => {
  return (
    <SimpleDepartmentSelector
      character={construct as Character}
      isChecked={(d) => selection.department === d}
      onSelectDepartment={(d) => {
        const temp = selection?.copy();
        if (temp) {
          temp.department = d;
        }
        setSelection(temp);
      }}
      isUpdateable={(d) => {
        if (d === selection.department) {
          return true;
        } else {
          const departments = (construct as Character).talents
            .filter(
              (t) => talentNames?.includes(t.talent) && t.department != null,
            )
            .map((t) => t.department);
          return !departments.includes(d);
        }
      }}
    />
  );
};

export const TalentSelectionRow: React.FC<ITalentSelectionRowProperties> = ({
  talent,
  construct,
  selection,
  onSelection,
}) => {
  let prerequisites = undefined;
  talent.talentModel.prerequisites.forEach((p) => {
    const desc = p.describe();
    if (desc) {
      if (prerequisites == null) {
        prerequisites = desc;
      } else {
        prerequisites += ', ' + desc;
      }
    }
  });
  if (prerequisites) {
    prerequisites = <div style={{ fontWeight: 'bold' }}>{prerequisites}</div>;
  }

  const selectTalent = (talent: RankedTalent) => {
    if (selection?.talent === talent.name) {
      onSelection(undefined);
    } else {
      onSelection(new SelectedTalent(talent.name));
    }
  };

  const specialWeaponOptions = () => {
    const result = [];
    result.push(new DropDownElement('', t('Common.select.choose')));
    result.push(new DropDownElement(SpecialWeapon.BatLeth, "Bat'leth"));
    result.push(new DropDownElement(SpecialWeapon.MekLeth, "Mek'leth"));
    return result;
  };

  const talentDescription = (t: RankedTalent) => {
    const description =
      construct.version === 1
        ? t.talentModel.localizedDescription
        : t.talentModel.localizedDescription2e;
    if (description.includes(CHALLENGE_DICE_NOTATION)) {
      return description.split('\n').map((l, i) => {
        return (
          <div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>
            {replaceDiceWithArrowhead(l)}
          </div>
        );
      });
    } else {
      return <Markdown className="markdown-sm">{description}</Markdown>;
    }
  };

  const renderImADoctorSelection = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <SimpleDepartmentSelector
            character={construct as Character}
            isChecked={(a) => selection.department === a}
            onSelectDepartment={(d) => {
              const temp = selection?.copy();
              if (temp) {
                temp.department = d;
              }
              onSelection(temp);
            }}
            isUpdateable={(d) => {
              if ((construct as Character).departments[d] > 1) {
                return false;
              } else if (d === selection.department) {
                return true;
              } else {
                const departments = (construct as Character).talents
                  .filter(
                    (t) =>
                      t.talent === TALENT_NAME_IM_A_DOCTOR_NOT_A &&
                      t.department != null,
                  )
                  .map((t) => t.department);
                return !departments.includes(d);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderAugmentedAbilitySelection = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <SimpleAttributeSelector
            character={construct as Character}
            isChecked={(a) => selection.attribute === a}
            onSelectAttribute={(a) => {
              const temp = selection?.copy();
              if (temp) {
                temp.attribute = a;
              }
              onSelection(temp);
            }}
            isUpdateable={(a) => {
              if (a === selection.attribute) {
                return true;
              } else {
                const attributes = (construct as Character).talents
                  .filter(
                    (t) =>
                      t.talent === TALENT_NAME_AUGMENTED_ABILITY &&
                      t.attribute != null,
                  )
                  .map((t) => t.attribute);
                return !attributes.includes(a);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderXSelection = (min?: number, max?: number) => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <XSelectionView
            construct={construct}
            selection={selection}
            setSelection={onSelection}
            min={min}
            max={max}
          />
        </div>
      </div>
    );
  };

  const renderExtraOrdinaryAttributeXSelection = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <SimpleAttributeSelector
            character={construct as Character}
            isChecked={(a) => selection.attribute === a}
            onSelectAttribute={(a) => {
              const temp = selection?.copy();
              if (temp) {
                temp.attribute = a;
              }
              onSelection(temp);
            }}
            isUpdateable={(a) => true}
          />
        </div>
      </div>
    );
  };

  const renderCollaborationSelection = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <DepartmentSelectedTalentChoice
            construct={construct}
            selection={selection}
            setSelection={onSelection}
            talentNames={[TALENT_NAME_COLLABORATION]}
          />
        </div>
      </div>
    );
  };

  const renderDedicatedPersonnel = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <StarshipDepartmentSelector
            starship={construct as Starship}
            isChecked={(d) => selection.department === d}
            onSelectDepartment={(d) => {
              const temp = selection?.copy();
              if (temp) {
                temp.department = d;
              }
              onSelection(temp);
            }}
          />
        </div>
      </div>
    );
  };

  const renderExpansiveDepartment = () => {
    const starship = construct as Starship;
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <StarshipDepartmentSelector
            starship={starship}
            isChecked={(d) => selection.department === d}
            onSelectDepartment={(d) => {
              const temp = selection?.copy();
              if (temp) {
                temp.department = d;
              }
              onSelection(temp);
            }}
            isUpdateable={(d) => starship.departments[d] === 5}
          />
        </div>
      </div>
    );
  };

  const renderRedundantSystems = () => {
    const starship = construct as Starship;
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <SimpleSystemSelector
            starship={starship}
            isChecked={(s) => selection.system === s}
            onSelectSystem={(s) => {
              const temp = selection?.copy();
              if (temp) {
                temp.system = s;
              }
              onSelection(temp);
            }}
          />
        </div>
      </div>
    );
  };

  const renderCustomTalent = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-8">
          <div>
            <InputFieldAndLabel
              labelName={t('Common.text.talentName')}
              id="customName"
              value={selection.customTalentName}
              onChange={(n) => {
                const temp = selection?.copy();
                if (temp) {
                  temp.customTalentName = n;
                }
                onSelection(temp);
              }}
            />
          </div>
          <div className="pt-3">
            <RichTextEditor
              initialText={selection.customTalentDescription}
              placeholder={t('Common.text.description')}
              onChange={(description) => {
                const temp = selection?.copy();
                if (temp) {
                  temp.customTalentDescription = description;
                }
                onSelection(temp);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAdditionalPropulsionSystem = () => {
    const getItems = () => {
      const result = [new DropDownElement('', '')];
      result.push(
        ...PropulsionSystemModel.types.map(
          (t) => new DropDownElement(t.type, t.localizedName),
        ),
      );
      return result;
    };

    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <DropDownSelect
            items={getItems()}
            defaultValue={selection.selection as PropulsionSystemType}
            onChange={(s) => {
              const temp = selection?.copy();
              if (temp) {
                if (s === '') {
                  temp.selection = undefined;
                } else {
                  temp.selection = s as PropulsionSystemType;
                }
                onSelection(temp);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderWeaponSelection = () => {
    let weaponName = '';
    if (selection?.weapon) {
      if (selection.weapon instanceof Weapon) {
        weaponName = selection.weapon.name;
      } else {
        weaponName = selection.weapon as string;
      }
    }

    const closeModal = () => {
      ModalControl.hide();
    };

    const showModal = () => {
      const starship = construct as Starship;
      let mode =
        starship.version === 1
          ? AddWeaponMode.IncludeMines
          : AddWeaponMode.NoMines;
      if (talent.name === TALENT_NAME_MINELAYER) {
        mode = AddWeaponMode.MinesOnly;
      } else if (starship.isMineLayer) {
        mode = AddWeaponMode.IncludeMines;
      }
      ModalControl.show(
        'lg',
        () => closeModal(),
        <AddWeaponView
          onClose={() => closeModal()}
          version={construct.version}
          addWeapon={(w) => {
            const temp = selection?.copy();
            if (temp) {
              temp.weapon = w;
              onSelection(temp);
            }
          }}
          mode={mode}
        />,
        'Add Weapon',
      );
    };

    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="d-flex justify-content-between align-items-baseline">
            <p className="mb-0">{weaponName}</p>
            <Button size="sm" onClick={() => showModal()}>
              {t('Common.button.select')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBoldOrCautiousSelection = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <SimpleDepartmentSelector
            character={construct as Character}
            isChecked={(d) => selection.department === d}
            onSelectDepartment={(d) => {
              const temp = selection?.copy();
              if (temp) {
                temp.department = d;
              }
              onSelection(temp);
            }}
            isUpdateable={(d) => {
              if (d === selection.department) {
                return true;
              } else {
                const departments = (construct as Character).talents
                  .filter(
                    (t) =>
                      [TALENT_NAME_BOLD, TALENT_NAME_CAUTIOUS].includes(
                        t.talent,
                      ) && t.department != null,
                  )
                  .map((t) => t.department);
                return !departments.includes(d);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderDefensiveTrainingSelection = () => {
    const options = [];
    options.push(new DropDownElement('', t('Common.select.choose')));
    options.push(
      new DropDownElement(AttackType.Melee, t('Weapon.common.melee')),
    );
    options.push(
      new DropDownElement(AttackType.Ranged, t('Weapon.common.ranged')),
    );
    return (
      <DropDownSelect
        items={options}
        defaultValue={selection?.selection ?? ''}
        onChange={(value) => {
          const temp = selection?.copy();
          if (temp) {
            temp.selection = value as AttackType;
          }
          onSelection(temp);
        }}
      />
    );
  };

  const renderBorgImplantsSelection = () => {
    const implants = BorgImplants.instance.implants.map((implant) => {
      const description =
        construct.version === 1
          ? implant.localizedDescription
          : implant.localizedDescription2e;
      return (
        <tr key={'implant-' + implant.type}>
          <td>
            <CheckBox
              isChecked={selection.implants.includes(implant.type)}
              onChanged={(val) => {
                const temp = selection.copy();
                if (temp.implants?.includes(implant.type)) {
                  temp.implants.splice(temp.implants.indexOf(implant.type), 1);
                } else {
                  if (temp.implants == null) {
                    temp.implants = [];
                  }
                  temp.implants.push(implant.type);
                }
                if (temp.implants.length > 3) {
                  temp.implants.splice(0, temp.implants.length - 3);
                }
                onSelection(temp);
              }}
              value={implant.name}
            />
          </td>
          <td>
            <div className="selection-header-small">
              <strong>
                {construct.version === 1
                  ? implant.localizedName
                  : implant.localizedName2e}
              </strong>
            </div>
            {description.includes(CHALLENGE_DICE_NOTATION) ? (
              <div>replaceDiceWithArrowhead(implant.description)</div>
            ) : (
              <div>
                <Markdown className="markdown-sm">{description}</Markdown>
              </div>
            )}
          </td>
        </tr>
      );
    });

    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <table className="selection-list">
            <tbody>{implants}</tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWisdomOfYearsSelection = () => {
    return (
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <FocusSelectionView
              value={selection.focuses[0] ?? ''}
              addFocus={(f) => {
                const temp = selection?.copy();
                if (temp) {
                  if (temp.focuses?.length) {
                    temp.focuses[0] = f;
                  } else {
                    temp.focuses = [f];
                  }
                }
                onSelection(temp);
              }}
              character={construct as Character}
            />
            <ValueInput
              value={selection.value ?? ''}
              onValueChanged={(v) => {
                const temp = selection?.copy();
                if (temp) {
                  temp.value = v;
                }
                onSelection(temp);
              }}
              onRandomClicked={() => {
                const value = randomUniqueValue(
                  (construct as Character).values ?? [],
                  (construct as Character).speciesStep?.species,
                  (construct as Character).educationStep?.primaryDiscipline,
                );
                const temp = selection?.copy();
                if (temp) {
                  temp.value = value;
                }
                onSelection(temp);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const renderExpandedProgramSelection = () => {
    return (
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <FocusSelectionView
              label={t('Construct.other.focus1')}
              value={selection.focuses[0] ?? ''}
              addFocus={(f) => {
                const temp = selection?.copy();
                if (temp) {
                  if (temp.focuses?.length) {
                    temp.focuses[0] = f;
                  } else {
                    temp.focuses = [f];
                  }
                }
                onSelection(temp);
              }}
              character={construct as Character}
            />
            <FocusSelectionView
              label={t('Construct.other.focus2')}
              value={selection.focuses[1] ?? ''}
              addFocus={(f) => {
                const temp = selection?.copy();
                if (temp) {
                  if (!temp.focuses?.length) {
                    temp.focuses = ['', f];
                  } else if (temp.focuses?.length === 1) {
                    temp.focuses.push(f);
                  } else {
                    temp.focuses[1] = f;
                  }
                }
                onSelection(temp);
              }}
              suggestions="Holonovel writing, Opera, Holo-photography, or anything else"
              character={construct as Character}
            />
          </div>
        </div>
      </>
    );
  };

  let name = talent.talentModel.localizedName;
  if (talent.talentModel.maxRank > 1) {
    name = t('Talent.text.rank', {
      talentName: talent.talentModel.localizedName,
      rank: talent.rank,
    });
  }

  return (
    <tbody>
      <tr>
        <td className="selection-header-small">{name}</td>
        <td>
          {talentDescription(talent)} {prerequisites}
        </td>
        <td>
          <CheckBox
            text=""
            value={talent.name}
            isChecked={selection?.talent === talent.name}
            onChanged={() => {
              selectTalent(talent);
            }}
          />
        </td>
      </tr>
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_WARRIORS_SPIRIT ? (
        <tr>
          <td></td>
          <td colSpan={2}>
            <DropDownSelect
              items={specialWeaponOptions()}
              defaultValue={selection?.selection ?? ''}
              onChange={(value) => {
                const temp = selection?.copy();
                if (temp) {
                  temp.selection = value as SpecialWeapon;
                }
                onSelection(temp);
              }}
            />
          </td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_VISIT_EVERY_STAR ? (
        <tr>
          <td></td>
          <td>
            <div className="row">
              <div className="col-12 col-md-6">
                <FocusSelectionView
                  character={construct as Character}
                  addFocus={(f) => {
                    const temp = selection?.copy();
                    if (temp) {
                      temp.focuses = [f];
                    }
                    onSelection(temp);
                  }}
                  value={
                    selection.focuses?.length ? selection.focuses[0] : undefined
                  }
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
                  randomFocusDepartment={Department.Conn}
                />
              </div>
            </div>
          </td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_EXPANDED_PROGRAM ? (
        <tr>
          <td></td>
          <td colSpan={2}>{renderExpandedProgramSelection()}</td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_WISDOM_OF_YEARS ? (
        <tr>
          <td></td>
          <td>{renderWisdomOfYearsSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_CUSTOM_TALENT ? (
        <tr>
          <td></td>
          <td>{renderCustomTalent()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_BORG_IMPLANTS ? (
        <tr>
          <td></td>
          <td>{renderBorgImplantsSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_AUGMENTED_ABILITY ? (
        <tr>
          <td></td>
          <td>{renderAugmentedAbilitySelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_IM_A_DOCTOR_NOT_A ? (
        <tr>
          <td></td>
          <td>{renderImADoctorSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      talent.name === TALENT_NAME_COLLABORATION ? (
        <tr>
          <td></td>
          <td>{renderCollaborationSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      [TALENT_NAME_BOLD, TALENT_NAME_CAUTIOUS].includes(talent.name) ? (
        <tr>
          <td></td>
          <td>{renderBoldOrCautiousSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      [
        TALENT_NAME_DEFENSIVE_TRAINING,
        TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR,
      ].includes(talent.name) ? (
        <tr>
          <td></td>
          <td>{renderDefensiveTrainingSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_CAMOUFLAGED_X === talent.name ? (
        <tr>
          <td></td>
          <td>{renderXSelection(1, 3)}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_INITIATIVE_X === talent.name ? (
        <tr>
          <td></td>
          <td>{renderXSelection(2, 6)}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_SWARM_X === talent.name ? (
        <tr>
          <td></td>
          <td>{renderXSelection(1, 6)}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_MENACING_X === talent.name ? (
        <tr>
          <td></td>
          <td>{renderXSelection(1, 6)}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_NATURAL_PROTECTION_X === talent.name ? (
        <tr>
          <td></td>
          <td>{renderXSelection(1, 6)}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_DEDICATED_PERSONNEL === talent.name ? (
        <tr>
          <td></td>
          <td>{renderDedicatedPersonnel()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_EXPANSIVE_DEPARTMENT === talent.name ? (
        <tr>
          <td></td>
          <td>{renderExpansiveDepartment()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_REDUNDANT_SYSTEMS === talent.name ? (
        <tr>
          <td></td>
          <td>{renderRedundantSystems()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X === talent.name ? (
        <>
          <tr>
            <td rowSpan={2}></td>
            <td>{renderExtraOrdinaryAttributeXSelection()}</td>
            <td rowSpan={2}></td>
          </tr>
          <tr>
            <td>{renderXSelection(1, 6)}</td>
          </tr>
        </>
      ) : undefined}
      {selection?.talent === talent.name &&
      TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM === talent.name ? (
        <tr>
          <td></td>
          <td>{renderAdditionalPropulsionSystem()}</td>
          <td></td>
        </tr>
      ) : undefined}
      {selection?.talent === talent.name &&
      [TALENT_NAME_MINELAYER, TALENT_NAME_EXPANDED_MUNITIONS].includes(
        talent.name,
      ) ? (
        <tr>
          <td></td>
          <td>{renderWeaponSelection()}</td>
          <td></td>
        </tr>
      ) : undefined}
    </tbody>
  );
};

export const SingleTalentSelectionList: React.FC<
  ISingleTalentSelectionProperties
> = ({ talents, construct, initialSelection, onSelection }) => {
  let original = null;
  if (initialSelection == null) {
    // do nothing
  } else if (initialSelection instanceof SelectedTalent) {
    original = (initialSelection as SelectedTalent).copy();
  } else {
    original = new SelectedTalent(initialSelection.name);
  }
  const [selection, setSelection] = useState<SelectedTalent | undefined>(
    original,
  );

  useEffect(() => {
    if (selection == null) {
      // do nothing
    } else if (talents.filter((t) => t.name === selection.talent)?.length) {
      // do nothing
    } else {
      setSelection(undefined);
      onSelection(undefined);
    }
  }, [talents, selection, onSelection]);

  const updateSelection = (selection: SelectedTalent) => {
    setSelection(selection);
    onSelection(selection);
  };

  talents = talents.sort(rankedTalentNameCompare);

  const talentList = talents.map((t, i) => {
    return (
      <TalentSelectionRow
        talent={t}
        construct={construct}
        onSelection={updateSelection}
        selection={selection}
        key={'talent-' + i}
      />
    );
  });

  return <table className="selection-list">{talentList}</table>;
};
