import { Character } from '../../src/common/character';
import { TalentsHelper } from '../../src/helpers/talents';
import { TalentCategory } from '../../src/helpers/talentCategory';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';
import { matchesTalentFilter } from '../../src/components/talentCategoryFilter';
import references from './talentCategoryReferences.json';

// Manually reviewed book headings from the user-supplied excerpts. pdfPage is
// the page in the excerpt, not the printed book page. "Or" requirements add
// both departments; "and" requirements retain the book's section category.
it.each(references)('$source: $name matches its reference category', (ref) => {
  const named = TalentsHelper.getTalents().filter((t) => t.name === ref.name);
  const sourced = named.filter((t) => t.sources.includes(Source[ref.source]));
  // Positive Reinforcement currently lists only Core 2e in the application.
  // Its Medicine category can still be checked against the Sciences excerpt.
  const candidates = sourced.length ? sourced : named;
  expect(candidates).toHaveLength(1);
  const talent = candidates[0];
  expect(talent.category.category).toBe(TalentCategory[ref.category]);
  expect(talent.category.type).toEqual(
    ref.departments.map((d) => Department[d]),
  );
  for (const department of ref.departments) {
    expect(matchesTalentFilter(talent, Department[department])).toBe(true);
  }
});

it('lists every alternative department from an existing character talent requirement', () => {
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
  for (const talent of alternatives) {
    for (const prerequisite of talent.prerequisites) {
      const match = either.exec(prerequisite.describe() || '');
      if (match) {
        expect(matchesTalentFilter(talent, Department[match[1]])).toBe(true);
        expect(matchesTalentFilter(talent, Department[match[2]])).toBe(true);
      }
    }
  }
});

it('preserves either-department eligibility for Crisis Management', () => {
  const talent = TalentsHelper.getTalent('Crisis Management');
  const requirement = talent.prerequisites.find((p) =>
    p.describe()?.includes('Security 3+ or Command 3+'),
  );
  expect(requirement).toBeDefined();
  const character = new Character();
  jest
    .spyOn(character, 'departments', 'get')
    .mockReturnValue([1, 1, 1, 1, 1, 1]);
  character.departments[Department.Security] = 3;
  character.departments[Department.Command] = 1;
  expect(requirement.isPrerequisiteFulfilled(character)).toBe(true);
  character.departments[Department.Security] = 1;
  character.departments[Department.Command] = 3;
  expect(requirement.isPrerequisiteFulfilled(character)).toBe(true);
  character.departments[Department.Command] = 2;
  expect(requirement.isPrerequisiteFulfilled(character)).toBe(false);
});
