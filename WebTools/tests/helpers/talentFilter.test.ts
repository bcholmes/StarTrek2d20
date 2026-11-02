import '../../src/common/character';
import { TalentsHelper } from '../../src/helpers/talents';
import { TalentCategory } from '../../src/helpers/talentCategory';
import { Department } from '../../src/helpers/department';
import { Species } from '../../src/helpers/speciesEnum';
import {
  ALL_TALENTS,
  matchesTalentFilter,
} from '../../src/helpers/talentFilter';

const talent = (name: string) => TalentsHelper.getTalent(name);
const department = (type: Department) => ({
  category: TalentCategory.Department,
  type,
});

it('an empty filter matches every talent', () => {
  for (const t of TalentsHelper.getTalents()) {
    expect(matchesTalentFilter(t, ALL_TALENTS)).toBe(true);
  }
});

it('a category alone matches every talent in that category', () => {
  expect(
    matchesTalentFilter(talent('Tough'), { category: TalentCategory.General }),
  ).toBe(true);
  expect(
    matchesTalentFilter(talent('Advisor'), {
      category: TalentCategory.General,
    }),
  ).toBe(false);
  expect(
    matchesTalentFilter(talent('Advisor'), {
      category: TalentCategory.Department,
    }),
  ).toBe(true);
});

it('a department narrows the Department category', () => {
  expect(
    matchesTalentFilter(talent('Advisor'), department(Department.Command)),
  ).toBe(true);
  expect(
    matchesTalentFilter(talent('Advisor'), department(Department.Conn)),
  ).toBe(false);
  expect(
    matchesTalentFilter(talent('Tough'), department(Department.Command)),
  ).toBe(false);
});

it.each(['In the Nick of Time', 'Intense Scrutiny'])(
  '%s matches both of its departments',
  (name) => {
    expect(
      matchesTalentFilter(talent(name), department(Department.Engineering)),
    ).toBe(true);
    expect(
      matchesTalentFilter(talent(name), department(Department.Science)),
    ).toBe(true);
    expect(
      matchesTalentFilter(talent(name), department(Department.Medicine)),
    ).toBe(false);
  },
);

it('a species narrows the Species category', () => {
  const vulcan = { category: TalentCategory.Species, type: Species.Vulcan };
  const species = TalentsHelper.getTalents().filter(
    (t) => t.category.category === TalentCategory.Species,
  );
  const vulcanTalents = species.filter((t) =>
    t.category.includes(Species.Vulcan),
  );
  expect(vulcanTalents.length).toBeGreaterThan(0);
  expect(vulcanTalents.length).toBeLessThan(species.length);
  for (const t of species) {
    expect(matchesTalentFilter(t, vulcan)).toBe(
      t.category.includes(Species.Vulcan),
    );
  }
  expect(matchesTalentFilter(talent('Advisor'), vulcan)).toBe(false);
});

it.each([
  [TalentCategory.Species, 'Proud and Honorable'],
  [TalentCategory.Esoteric, 'Telepathy2e'],
  [TalentCategory.Enhancement, 'Neural Interface'],
  [TalentCategory.Career, 'Veteran'],
])('category %s matches only its own talents', (category, name) => {
  expect(matchesTalentFilter(talent(name), { category })).toBe(true);
  expect(
    matchesTalentFilter(talent(name), { category: TalentCategory.General }),
  ).toBe(false);
  expect(matchesTalentFilter(talent('Tough'), { category })).toBe(false);
});

// Talents with an "X or Y" department requirement belong to both departments.
it('lists every alternative department from a talent requirement', () => {
  const departments = 'Command|Conn|Security|Engineering|Science|Medicine';
  const either = new RegExp(
    `Requires (${departments}) \\d\\+ or (${departments}) \\d\\+`,
  );
  const alternatives = TalentsHelper.getTalents().filter(
    (t) =>
      t.category.category === TalentCategory.Department &&
      t.prerequisites.some((p) => either.test(p.describe() || '')),
  );
  expect(alternatives.map((t) => t.name)).toEqual(
    expect.arrayContaining([
      'Crisis Management',
      'In the Nick of Time',
      'Intense Scrutiny',
      'Testing a Theory',
    ]),
  );
  for (const t of alternatives) {
    for (const prerequisite of t.prerequisites) {
      const match = either.exec(prerequisite.describe() || '');
      if (match) {
        expect(matchesTalentFilter(t, department(Department[match[1]]))).toBe(
          true,
        );
        expect(matchesTalentFilter(t, department(Department[match[2]]))).toBe(
          true,
        );
      }
    }
  }
});
