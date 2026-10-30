// Initialize the character/catalog dependency cycle in the same order as the app.
import '../../src/common/character';
import { TalentsHelper } from '../../src/helpers/talents';
import { talentSelectionKey } from '../../src/helpers/talentSelectionKey';
import { Department } from '../../src/helpers/department';

test.each(['Pathfinder', 'Applied Force'])(
  'same-name species and department variants have distinct stable row keys: %s',
  (name) => {
    const variants = TalentsHelper.getTalents().filter((t) => t.name === name);
    expect(variants).toHaveLength(2);
    const keys = variants.map(talentSelectionKey);
    expect(new Set(keys).size).toBe(2);
    expect([...variants].reverse().map(talentSelectionKey)).toEqual(
      [...keys].reverse(),
    );
  },
);
test.each([
  ['Crisis Management', Department.Security],
  ['In the Nick of Time', Department.Science],
  ['Intense Scrutiny', Department.Science],
  ['Testing a Theory', Department.Science],
])(
  'dual-department %s retains its original primary department for NPC generation and exports',
  (name, primary) => {
    const talent = TalentsHelper.getTalent(name as string);
    expect(talent.category.type).toHaveLength(2);
    expect(talent.category.type[0]).toBe(primary);
  },
);
test('Fleet Commander deliberately uses Command as its primary department', () => {
  expect(TalentsHelper.getTalent('Fleet Commander').category.type).toEqual([
    Department.Command,
  ]);
});
