import { talentSelectionKey } from '../helpers/talentSelectionKey';
import React, { useEffect, useState } from 'react';
import { CheckBox } from './checkBox';
import type { TalentModel } from '../helpers/talentModel';
import { TALENT_NAME_CUSTOM_TALENT } from '../helpers/talents';
import { replaceDiceWithArrowhead } from '../common/arrowhead';
import type { Construct } from '../common/construct';
import { SelectedTalent } from '../common/selectedTalent';
import type { ITalent } from '../helpers/italent';
import { t } from 'i18next';
import {
  TalentCategoryFilter,
  matchesTalentFilter,
} from './talentCategoryFilter';
import type { TalentFilter } from './talentCategoryFilter';

interface ISimpleTalentSelectionProperties {
  heading?: string;
  // Show the talent filter without a section heading (e.g. inside a modal).
  filterable?: boolean;
  talents: TalentModel[];
  allowDeselect?: boolean;
  construct: Construct;
  initialSelection?: string;
  onSelection: (talent?: SelectedTalent) => void;
}

export const SimpleTalentSelectionList: React.FC<
  ISimpleTalentSelectionProperties
> = ({
  talents,
  construct,
  onSelection,
  initialSelection,
  allowDeselect = true,
  heading,
  filterable = false,
}) => {
  const showFilter = !!heading || filterable;
  const [filter, setFilter] = useState<TalentFilter>('all');
  const [selection, setSelection] = useState<string | undefined>(
    initialSelection,
  );

  useEffect(() => {
    if (selection == null) {
      // do nothing
    } else if (talents.filter((t) => t.name === selection)?.length) {
      // do nothing
    } else {
      setSelection(undefined);
      onSelection(undefined);
    }
  }, [talents, selection, onSelection]);

  const matches = talents.filter(
    (talent) => !showFilter || matchesTalentFilter(talent, filter),
  );
  const selectedOutsideFilter = talents.some(
    (talent) => talent.name === selection && !matches.includes(talent),
  );
  const visibleTalents = talents
    .filter((talent) => matches.includes(talent) || talent.name === selection)
    .sort((t1, t2) => {
      if (t1.name === TALENT_NAME_CUSTOM_TALENT) {
        return 1;
      } else if (t2.name === TALENT_NAME_CUSTOM_TALENT) {
        return -1;
      } else {
        return t1.localizedName.localeCompare(t2.localizedName);
      }
    });

  const selectTalent = (talent: ITalent) => {
    if (selection === talent.name && allowDeselect) {
      setSelection(undefined);
      onSelection(undefined);
    } else {
      setSelection(talent.name);
      onSelection(new SelectedTalent(talent.name));
    }
  };

  const talentList = visibleTalents.map((t) => {
    let prerequisites = undefined;
    t.prerequisites.forEach((p) => {
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

    const description =
      construct.version === 1
        ? (t as TalentModel).localizedDescription
        : (t as TalentModel).localizedDescription2e;
    const lines = description.split('\n').map((l, i) => {
      return (
        <div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>
          {replaceDiceWithArrowhead(l)}
        </div>
      );
    });

    return (
      <tr key={talentSelectionKey(t)}>
        <td className="selection-header-small">{t.localizedName}</td>
        <td>
          {lines} {prerequisites}
        </td>
        <td>
          <CheckBox
            text=""
            value={t.name}
            isChecked={selection === t.name}
            onChanged={() => selectTalent(t)}
          />
        </td>
      </tr>
    );
  });

  return (
    <>
      {showFilter && (
        <TalentCategoryFilter
          heading={heading}
          value={filter}
          onChange={setFilter}
        />
      )}
      {showFilter && selectedOutsideFilter && (
        <p role="status">{t('TalentFilter.selectedOutside')}</p>
      )}
      {showFilter && matches.length === 0 && (
        <p role="status">
          {filter === 'all' ? t('TalentFilter.none') : t('TalentFilter.empty')}
        </p>
      )}
      <table className="selection-list">
        <tbody>{talentList}</tbody>
      </table>
    </>
  );
};
