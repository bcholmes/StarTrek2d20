import React from 'react';
import { t } from 'i18next';
import { Department } from '../helpers/department';
import { TalentCategory } from '../helpers/talentCategory';
import {
  ALL_TALENTS,
  isSameTalentFilter,
  type TalentFilter,
} from '../helpers/talentFilter';

interface FilterOption {
  value: string;
  filter: TalentFilter;
  label: () => string;
}

// The compact, single-dropdown form of the talent filter used beside talent
// selection lists. Each option is a TalentFilter, matched by the same
// function as the Talents Overview page.
const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', filter: ALL_TALENTS, label: () => t('TalentFilter.all') },
  {
    value: 'general',
    filter: { category: TalentCategory.General },
    label: () => t('TalentCategory.general'),
  },
  ...[
    Department.Command,
    Department.Conn,
    Department.Security,
    Department.Engineering,
    Department.Science,
    Department.Medicine,
  ].map((department) => ({
    value: String(department),
    filter: { category: TalentCategory.Department, type: department },
    label: () =>
      t('Construct.discipline.' + Department[department].toLowerCase()),
  })),
  {
    value: 'species',
    filter: { category: TalentCategory.Species },
    label: () => t('TalentCategory.species'),
  },
  {
    value: 'esoteric',
    filter: { category: TalentCategory.Esoteric },
    label: () => t('TalentCategory.esoteric'),
  },
  {
    value: 'enhancement',
    filter: { category: TalentCategory.Enhancement },
    label: () => t('TalentCategory.enhancement'),
  },
];

const FilterSelect: React.FC<{
  value: TalentFilter;
  onChange: (value: TalentFilter) => void;
}> = ({ value, onChange }) => (
  <label>
    <span>{t('TalentFilter.label')}</span>
    <select
      value={
        FILTER_OPTIONS.find((o) => isSameTalentFilter(o.filter, value))
          ?.value ?? 'all'
      }
      onChange={(event) =>
        onChange(
          FILTER_OPTIONS.find((o) => o.value === event.target.value)?.filter ??
            ALL_TALENTS,
        )
      }
    >
      {FILTER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label()}
        </option>
      ))}
    </select>
  </label>
);

// With a heading, the filter sits in the section's LCARS header bar. Without
// one (for example inside the talent selection modal, which has its own
// title), it is a plain right-aligned control.
export const TalentCategoryFilter: React.FC<{
  heading?: string;
  value: TalentFilter;
  onChange: (value: TalentFilter) => void;
}> = ({ heading, value, onChange }) =>
  heading ? (
    <div className="talent-filter-heading">
      <h2 className="header-text">
        <div>{heading}</div>
      </h2>
      <FilterSelect value={value} onChange={onChange} />
    </div>
  ) : (
    <div className="talent-filter-bar">
      <FilterSelect value={value} onChange={onChange} />
    </div>
  );
