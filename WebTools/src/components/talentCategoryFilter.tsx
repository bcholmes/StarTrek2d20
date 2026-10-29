import React from 'react';
import { t } from 'i18next';
import { Department } from '../helpers/department';
import { TalentCategory } from '../helpers/talentCategory';
import type { TalentModel } from '../helpers/talentModel';

export type TalentFilter =
  'all' | 'general' | 'species' | 'esoteric' | 'enhancement' | Department;

const CATEGORY_FILTERS: Record<string, TalentCategory> = {
  general: TalentCategory.General,
  species: TalentCategory.Species,
  esoteric: TalentCategory.Esoteric,
  enhancement: TalentCategory.Enhancement,
};

export function matchesTalentFilter(talent: TalentModel, filter: TalentFilter) {
  if (filter === 'all') return true;
  if (typeof filter === 'string')
    return talent.category.category === CATEGORY_FILTERS[filter];
  return (
    talent.category.category === TalentCategory.Department &&
    talent.category.includes(filter)
  );
}

const FilterSelect: React.FC<{
  value: TalentFilter;
  onChange: (value: TalentFilter) => void;
}> = ({ value, onChange }) => (
  <label>
    <span>{t('TalentFilter.label')}</span>
    <select
      value={value}
      onChange={(event) => {
        const value = event.target.value;
        onChange(
          value === 'all' || value in CATEGORY_FILTERS
            ? (value as TalentFilter)
            : (Number(value) as Department),
        );
      }}
    >
      <option value="all">{t('TalentFilter.all')}</option>
      <option value="general">{t('TalentCategory.general')}</option>
      {[
        Department.Command,
        Department.Conn,
        Department.Security,
        Department.Engineering,
        Department.Science,
        Department.Medicine,
      ].map((department) => (
        <option key={department} value={department}>
          {t('Construct.discipline.' + Department[department].toLowerCase())}
        </option>
      ))}
      <option value="species">{t('TalentCategory.species')}</option>
      <option value="esoteric">{t('TalentCategory.esoteric')}</option>
      <option value="enhancement">{t('TalentCategory.enhancement')}</option>
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
