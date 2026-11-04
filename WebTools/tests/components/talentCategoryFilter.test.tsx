import { afterEach, beforeAll, expect, it, jest } from '@jest/globals';
import { Character } from '../../src/common/character';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../../src/i18n/locales/en/translations.json';
import { TalentCategoryFilter } from '../../src/components/talentCategoryFilter';
import { ALL_TALENTS } from '../../src/helpers/talentFilter';
import { TalentCategory } from '../../src/helpers/talentCategory';
import { SingleTalentSelectionList } from '../../src/components/singleTalentSelectionList';
import { TalentsHelper } from '../../src/helpers/talents';
import { RankedTalent } from '../../src/helpers/rankedTalent';
import { Department } from '../../src/helpers/department';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { SimpleTalentSelectionList } from '../../src/components/simpleTalentSelectionList';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../src/components/richTextEditor', () => ({
  RichTextEditor: () => null,
}));
Object.defineProperty(global, 'window', {
  value: { localStorage: { getItem: () => null } },
  writable: true,
});
beforeAll(async () => {
  await i18next
    .use(initReactI18next)
    .init({ lng: 'en', resources: { en: { translation: translations } } });
});
afterEach(() => jest.restoreAllMocks());

it('renders a labelled select in the orange heading with all eleven choices', () => {
  const html = renderToStaticMarkup(
    <TalentCategoryFilter
      heading="Talents"
      value={ALL_TALENTS}
      onChange={() => {}}
    />,
  );
  expect(html).toContain('talent-filter-heading');
  expect(html).toContain(
    '<h2 class="header-text d-flex align-items-stretch py-0"><div>Talents</div></h2>',
  );
  expect(html.indexOf('</h2>')).toBeLessThan(html.indexOf('<label '));
  expect(html).toContain('<label ');
  expect(html).toContain('Filter talents');
  expect(html.match(/<option /g)).toHaveLength(11);
  expect(html).toContain('<option value="species">Species</option>');
  expect(html).toContain('<option value="esoteric">Esoteric</option>');
  expect(html).toContain('<option value="enhancement">Enhancement</option>');
  expect(html).toContain('General');
  expect(html).toContain('Medicine');
});

const general = { category: TalentCategory.General };
const department = (type: Department) => ({
  category: TalentCategory.Department,
  type,
});

it('selecting an option reports the matching shared filter', () => {
  const onChange = jest.fn();
  const element = TalentCategoryFilter({
    heading: 'Talents',
    value: ALL_TALENTS,
    onChange,
  }) as React.ReactElement;
  const select = findSelect(element);
  select.props.onChange({ target: { value: String(Department.Science) } });
  select.props.onChange({ target: { value: 'species' } });
  select.props.onChange({ target: { value: 'all' } });
  expect(onChange.mock.calls.map((c) => c[0])).toEqual([
    department(Department.Science),
    { category: TalentCategory.Species },
    ALL_TALENTS,
  ]);
});

it('shows the option that matches the current filter', () => {
  const html = renderToStaticMarkup(
    <TalentCategoryFilter
      heading="Talents"
      value={department(Department.Conn)}
      onChange={() => {}}
    />,
  );
  expect(html).toMatch(/<option value="1" selected="">Conn<\/option>/);
});

function findSelect(node): React.ReactElement<{
  onChange: (event: { target: { value: string } }) => void;
}> {
  if (!node || typeof node !== 'object') return undefined;
  if (node.type === 'select') return node;
  if (typeof node.type === 'function') return findSelect(node.type(node.props));
  const children = React.Children.toArray(node.props?.children);
  for (const child of children) {
    const found = findSelect(child);
    if (found) return found;
  }
  return undefined;
}

function renderFilteredList(filter, selected?: SelectedTalent) {
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(() => [filter, jest.fn()]);
  const change = jest.fn();
  const character = new Character();
  character.version = 2;
  const talents = ['Tough', 'Advisor'].map(
    (name) => new RankedTalent(TalentsHelper.getTalent(name)),
  );
  const order = talents.map((t) => t.name);
  const html = renderToStaticMarkup(
    <SingleTalentSelectionList
      heading="Talent"
      talents={talents}
      construct={character}
      initialSelection={selected}
      onSelection={change}
    />,
  );
  expect(talents.map((t) => t.name)).toEqual(order);
  expect(change).not.toHaveBeenCalled();
  return html;
}

it('filters rows without mutating eligibility or invoking selection updates', () => {
  const html = renderFilteredList(general);
  expect(html).toContain('Tough');
  expect(html).not.toContain('Advisor');
});

it('retains the selected talent outside the filter with an explanation', () => {
  const html = renderFilteredList(general, new SelectedTalent('Advisor'));
  expect(html).toContain('Advisor');
  expect(html).toContain('Tough');
  expect(html).toContain('outside this filter');
  expect(html).toContain('checked');
});

it('explains an empty result and how to restore the full list', () => {
  const html = renderFilteredList(department(Department.Medicine));
  expect(html).not.toContain('Advisor');
  expect(html).not.toContain('Tough');
  expect(html).toContain('No available talents match');
  expect(html).toContain('Choose All talents');
});

function renderFilteredEditor(filter, selected?: string, heading = 'Talents') {
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(() => [filter, jest.fn()]);
  const change = jest.fn();
  const talents = ['Tough', 'Advisor'].map((name) =>
    TalentsHelper.getTalent(name),
  );
  const html = renderToStaticMarkup(
    <SimpleTalentSelectionList
      heading={heading}
      talents={talents}
      construct={new Character()}
      initialSelection={selected}
      allowDeselect={false}
      onSelection={change}
    />,
  );
  expect(talents.map((talent) => talent.name)).toEqual(['Tough', 'Advisor']);
  expect(change).not.toHaveBeenCalled();
  return html;
}

it('filters the shared editor choices by discipline without changing selection', () => {
  const html = renderFilteredEditor(department(Department.Command));
  expect(html).toContain('Advisor');
  expect(html).not.toContain('Tough');
  expect(html).toContain('Filter talents');
});

it('keeps the current editor talent visible and checked outside the filter', () => {
  const html = renderFilteredEditor(general, 'Advisor');
  expect(html).toContain('Advisor');
  expect(html).toContain('Tough');
  expect(html).toContain('outside this filter');
  expect(html).toContain('checked');
});

it('explains empty editor results', () => {
  const html = renderFilteredEditor(department(Department.Medicine));
  expect(html).toContain('No available talents match');
  expect(html).not.toContain('Advisor');
  expect(html).not.toContain('Tough');
});

it('leaves other simple selection lists unfiltered without an opt-in heading', () => {
  const html = renderFilteredEditor(
    department(Department.Medicine),
    undefined,
    '',
  );
  expect(html).toContain('Advisor');
  expect(html).toContain('Tough');
  expect(html).not.toContain('Filter talents');
});

it.each([
  [
    'step lists',
    () => (
      <SingleTalentSelectionList
        heading="Talent"
        talents={[]}
        construct={new Character()}
        onSelection={jest.fn()}
      />
    ),
  ],
  [
    'the shared editor',
    () => (
      <SimpleTalentSelectionList
        heading="Talents"
        talents={[]}
        construct={new Character()}
        onSelection={jest.fn()}
      />
    ),
  ],
])(
  'does not suggest choosing All talents when %s are already unfiltered',
  (_, list) => {
    const html = renderToStaticMarkup(list());
    expect(html).toContain('No talents are available for this choice.');
    expect(html).not.toContain('Choose All talents');
  },
);

it('shows the filter without a section header when only filterable is set', () => {
  const html = renderToStaticMarkup(
    <SimpleTalentSelectionList
      filterable
      talents={['Tough', 'Advisor'].map((name) =>
        TalentsHelper.getTalent(name),
      )}
      construct={new Character()}
      onSelection={jest.fn()}
    />,
  );
  expect(html).toContain('Filter talents');
  expect(html).toContain('talent-filter-bar');
  expect(html).not.toContain('header-text');
  expect(html).not.toContain('talent-filter-heading');
});
