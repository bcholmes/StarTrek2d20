import {
  Character,
  CareerStep,
  EducationStep,
  FinishingStep,
  SpeciesStep,
  UpbringingStep,
} from '../../src/common/character';
import { Stereotype } from '../../src/common/construct';
import { AssemblyContext } from '../../src/common/characterAssembly';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import { SpeciesAbilityList } from '../../src/helpers/speciesAbility';
import { CharacterType } from '../../src/common/characterType';
import { Career } from '../../src/helpers/careerEnum';
import { Track } from '../../src/helpers/trackEnum';
import { Department } from '../../src/helpers/department';
import { Attribute } from '../../src/helpers/attributes';
import { Source } from '../../src/helpers/sources';
import { EarlyOutlook, UpbringingsHelper } from '../../src/helpers/upbringings';
import { TalentsHelper } from '../../src/helpers/talents';
import { marshaller } from '../../src/helpers/marshaller';
import {
  canDeferTalent,
  finalLifepathTalentErrors,
  getLifepathTalentChoices,
  getLifepathTalentStep,
  isTalentDeferred,
  lifepathTalentError,
} from '../../src/helpers/lifepathTalents';
import { characterReducer } from '../../src/state/characterReducer';
import {
  addCharacterTalent,
  recordLifepathTalentProgress,
  updateCharacterGeneralEditTalentChange,
  setCharacterName,
  setCharacterSpecies,
  setCharacterEducation,
  setCharacterCareerLength,
  StepContext,
} from '../../src/state/characterActions';
import { setSources } from '../../src/state/contextActions';
import { store } from '../../src/state/store';
import { pushPage, popPage } from '../../src/common/pageHistory';
import { PageIdentity } from '../../src/pages/pageIdentity';
import i18next from 'i18next';
import translations from '../../src/i18n/locales/en/translations.json';

Object.defineProperty(global, 'window', {
  value: {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  },
  writable: true,
});

function character() {
  const c = new Character();
  c.version = 2;
  c.speciesStep = new SpeciesStep(Species.Human);
  c.speciesStep.ability = new SpeciesAbility(Species.Human); // no species talent slot
  c.upbringingStep = new UpbringingStep(
    UpbringingsHelper.getUpbringing(EarlyOutlook.MilitaryOrExploration),
  );
  c.educationStep = new EducationStep(Track.Command);
  c.careerStep = new CareerStep(Career.Experienced);
  c.finishingStep = new FinishingStep();
  return c;
}
const reduce = (c: Character, action: any) =>
  characterReducer({ currentCharacter: c, isModified: false } as any, action)
    .currentCharacter;
const names = (c: Character, ctx = StepContext.Education) =>
  getLifepathTalentChoices(c, ctx).map((t) => t.name);
function fillTalents(c: Character) {
  for (const context of [
    StepContext.EarlyOutlook,
    StepContext.Education,
    StepContext.Career,
    StepContext.FinishingTouches,
  ]) {
    const choice = getLifepathTalentChoices(c, context).find((t) => {
      getLifepathTalentStep(c, context).talent = new SelectedTalent(t.name);
      const valid = !lifepathTalentError(c, context, true);
      getLifepathTalentStep(c, context).talent = undefined;
      return valid;
    });
    expect(choice).toBeDefined();
    getLifepathTalentStep(c, context).talent = new SelectedTalent(choice.name);
  }
  return c;
}

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});
beforeEach(() => {
  store.dispatch(setSources([Source.Core2ndEdition]));
});

test('all deferred origins survive a single compressed save, including a real species ability', () => {
  const c = character();
  c.speciesStep = new SpeciesStep(Species.Betazoid);
  c.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
    Species.Betazoid,
  );
  const contexts = [
    StepContext.Species,
    StepContext.EarlyOutlook,
    StepContext.Education,
    StepContext.Career,
  ];
  const deferred = contexts.reduce(
    (current, context) =>
      reduce(current, recordLifepathTalentProgress(context)),
    c,
  );
  const restored = marshaller.decodeCharacter(
    marshaller.decode(marshaller.encodeMainCharacter(deferred)),
  );
  contexts.forEach((context) =>
    expect(isTalentDeferred(restored, context)).toBe(true),
  );
  expect(names(restored, StepContext.Species).sort()).toEqual([
    'Empathy2e',
    'Telepathy2e',
  ]);
});

test('cadets retain their mandatory novice talent even without a career-length choice', () => {
  const c = character();
  c.type = CharacterType.Cadet;
  c.careerStep = new CareerStep();
  expect(names(c, StepContext.Career)).toEqual(['Untapped Potential']);
});

test('child education has no extra talent slot and child career retains its fixed talent', () => {
  const c = character();
  c.type = CharacterType.Child;
  store.dispatch(setSources([Source.Core2ndEdition, Source.PlayersGuide]));
  expect(canDeferTalent(c, StepContext.Education)).toBe(false);
  expect(names(c, StepContext.Career)).toEqual(['Childhood Insight']);
});

test('malformed saved deferrals cannot add a finishing slot or override a selected talent', () => {
  const c = character();
  c.educationStep.talent = new SelectedTalent('Tough');
  const json = marshaller.decode(marshaller.encodeMainCharacter(c));
  json.deferredTalents = ['Education', 'FinishingTouches', 'NotAStage'];
  const restored = marshaller.decodeCharacter(json);
  expect(restored.educationStep.talentDeferred).toBe(false);
  expect(restored.educationStep.talent.talent).toBe('Tough');
  expect(canDeferTalent(restored, StepContext.FinishingTouches)).toBe(false);
});

test('a blank slot can be skipped, but final validation still requires a choice', () => {
  const c = character();
  expect(lifepathTalentError(c, StepContext.Education)).toBeUndefined();
  const next = reduce(c, recordLifepathTalentProgress(StepContext.Education));
  expect(isTalentDeferred(next, StepContext.Education)).toBe(true);
  expect(lifepathTalentError(next, StepContext.Education)).toBeUndefined();
  expect(lifepathTalentError(next, StepContext.Education, true)).toMatch(
    /before finishing/,
  );
  expect(c.educationStep.talentDeferred).toBe(false);
});

test.each([
  StepContext.EarlyOutlook,
  StepContext.Education,
  StepContext.Career,
])(
  'defer, copy, unrelated Redux edit, choose, and clear context %s',
  (context) => {
    const c = character();
    getLifepathTalentStep(c, context).talent = new SelectedTalent('Tough');
    let next = reduce(
      reduce(c, addCharacterTalent(undefined, context)),
      recordLifepathTalentProgress(context),
    );
    expect(getLifepathTalentStep(next, context).talent).toBeFalsy();
    expect(getLifepathTalentStep(c, context).talent.talent).toBe('Tough');
    next = reduce(next.copy(), setCharacterName('Test'));
    expect(isTalentDeferred(next, context)).toBe(true);
    const talent = new SelectedTalent('Tough');
    next = reduce(next, addCharacterTalent(talent, context));
    expect(isTalentDeferred(next, context)).toBe(false);
    expect(getLifepathTalentStep(next, context).talent).not.toBe(talent);
    next = reduce(next, addCharacterTalent(undefined, context));
    expect(lifepathTalentError(next, context)).toBeUndefined();
    expect(lifepathTalentError(next, context, true)).toBeTruthy();
  },
);

test('species choices retain species-ability restrictions and provenance', () => {
  const c = character();
  c.speciesStep.ability = new SpeciesAbility(
    Species.Human,
    Source.Core2ndEdition,
    ['Tough'],
  );
  let next = reduce(c, recordLifepathTalentProgress(StepContext.Species));
  expect(next.copy().speciesStep.talentDeferred).toBe(true);
  expect(names(next, StepContext.Species)).toEqual(['Tough']);
  next = reduce(
    next,
    addCharacterTalent(new SelectedTalent('Tough'), StepContext.Species),
  );
  expect(
    next.talentAssemblies.find((a) => a.talent.talent === 'Tough').context,
  ).toBe(AssemblyContext.Species);
  expect(next.finishingStep.talent).toBeUndefined();
  next.speciesStep.talent = new SelectedTalent('Bold');
  expect(lifepathTalentError(next, StepContext.Species, true)).toMatch(
    /restrictions/,
  );
});

test('species abilities without talent choices do not invent an extra slot', () => {
  const c = character();
  expect(canDeferTalent(c, StepContext.Species)).toBe(false);
  expect(canDeferTalent(c, StepContext.FinishingTouches)).toBe(false);
  expect(names(c, StepContext.Species)).toEqual([]);
});

test('career pools remain novice-only or veteran-only and respect enabled sources', () => {
  const c = character();
  c.careerStep.career = Career.Young;
  expect(names(c, StepContext.Career)).toEqual(['Untapped Potential']);
  c.careerStep.career = Career.Veteran;
  expect(names(c, StepContext.Career)).toEqual(['Veteran']);
  store.dispatch(
    setSources([
      Source.Core2ndEdition,
      Source.TechnicalManual,
      Source.ExplorationGuide,
    ]),
  );
  const enabled = names(c, StepContext.Career);
  expect(enabled).toContain('Veteran');
  for (const name of ['Wrote the Book', 'Life Lessons']) {
    expect(enabled.includes(name)).toBe(
      TalentsHelper.getTalent(name).isPrerequisiteFulfilled(c),
    );
  }
  c.careerStep.talent = new SelectedTalent('Tough');
  expect(lifepathTalentError(c, StepContext.Career, true)).toBeTruthy();
});

test('talents can become eligible after later attribute improvements, and invalidated choices fail final validation', () => {
  const c = character();
  const available = new Set(names(c));
  c.finishingStep.attributes = [0, 1, 2, 3, 4, 5].flatMap((a) => [
    a,
    a,
    a,
    a,
    a,
  ]);
  c.finishingStep.disciplines = [0, 1, 2, 3, 4, 5].flatMap((d) => [d, d, d, d]);
  const unlocked = names(c).filter((n) => !available.has(n));
  expect(unlocked.length).toBeGreaterThan(0);
  c.educationStep.talent = new SelectedTalent(unlocked[0]);
  expect(names(c)).toContain(unlocked[0]);
  c.finishingStep.attributes = [];
  c.finishingStep.disciplines = [];
  expect(lifepathTalentError(c, StepContext.Education, true)).toMatch(
    /prerequisites/,
  );
});

test('single talents cannot be duplicated; ranked talents stop at their cap without counting the edited slot', () => {
  const c = character();
  c.upbringingStep.talent = new SelectedTalent('Tough');
  expect(names(c)).not.toContain('Tough');
  expect(names(c, StepContext.EarlyOutlook)).toContain('Tough');
  const ranked = TalentsHelper.getAllAvailableTalentsForCharacter(c).find(
    (t) => t.maxRank > 1,
  );
  expect(ranked).toBeDefined();
  expect(ranked.maxRank).toBeGreaterThan(1);
  c.upbringingStep.talent = new SelectedTalent(ranked.name);
  expect(names(c)).toContain(ranked.name);
  c.educationStep.talent = new SelectedTalent(ranked.name);
  c.careerStep.talent = new SelectedTalent(ranked.name);
  expect(names(c, StepContext.FinishingTouches).includes(ranked.name)).toBe(
    3 < ranked.maxRank,
  );
});

test('repeated options and missing talent details are rejected', () => {
  const c = character();
  c.educationStep.talent = new SelectedTalent('Bold');
  expect(lifepathTalentError(c, StepContext.Education, true)).toBeTruthy();
  c.educationStep.talent.department = Department.Command;
  c.upbringingStep.talent = SelectedTalent.createWithDepartment(
    'Bold',
    Department.Command,
  );
  expect(lifepathTalentError(c, StepContext.Education, true)).toMatch(
    /different option/,
  );
  c.educationStep.talent.department = Department.Conn;
  expect(lifepathTalentError(c, StepContext.Education, true)).toBeUndefined();
  c.careerStep.career = Career.Young;
  c.careerStep.talent = new SelectedTalent('Untapped Potential');
  expect(lifepathTalentError(c, StepContext.Career, true)).toBeTruthy();
  c.careerStep.talent.attribute = Attribute.Control;
  expect(lifepathTalentError(c, StepContext.Career, true)).toBeUndefined();
});

test('all four ordinary 2e talent slots must be resolved, and no choice leaks into finishing touches', () => {
  const c = fillTalents(character());
  expect(finalLifepathTalentErrors(c)).toEqual([]);
  const deferred = reduce(
    reduce(c, addCharacterTalent(undefined, StepContext.Education)),
    recordLifepathTalentProgress(StepContext.Education),
  );
  expect(finalLifepathTalentErrors(deferred)).toHaveLength(1);
  const resolved = reduce(
    deferred,
    addCharacterTalent(c.educationStep.talent, StepContext.Education),
  );
  expect(finalLifepathTalentErrors(resolved)).toEqual([]);
  expect(resolved.finishingStep.talent).toEqual(c.finishingStep.talent);
});

test('compressed serialization rehydrates pending flags and selected talents; older saves default to no deferral', () => {
  const c = reduce(
    character(),
    recordLifepathTalentProgress(StepContext.Education),
  );
  c.upbringingStep.talent = SelectedTalent.createWithDepartment(
    'Bold',
    Department.Command,
  );
  const json = marshaller.decode(marshaller.encodeMainCharacter(c));
  const restored = marshaller.decodeCharacter(json);
  expect(restored.educationStep.talentDeferred).toBe(true);
  expect(restored.upbringingStep.talent).toBeInstanceOf(SelectedTalent);
  expect(restored.upbringingStep.talent.department).toBe(Department.Command);
  delete json.deferredTalents;
  expect(marshaller.decodeCharacter(json).educationStep.talentDeferred).toBe(
    false,
  );
  expect(
    finalLifepathTalentErrors(marshaller.decodeCharacter(json)).length,
  ).toBeGreaterThan(0);
});

test('revisiting same education/career keeps deferral, replacing the step resets it', () => {
  let c = reduce(
    character(),
    recordLifepathTalentProgress(StepContext.Education),
  );
  c = reduce(c, setCharacterEducation(Track.Command, false));
  expect(c.educationStep.talentDeferred).toBe(true);
  c = reduce(c, setCharacterEducation(Track.Operations, false));
  expect(c.educationStep.talentDeferred).toBe(false);
  c = reduce(c, recordLifepathTalentProgress(StepContext.Career));
  c = reduce(c, setCharacterCareerLength(Career.Experienced));
  expect(c.careerStep.talentDeferred).toBe(true);
  c = reduce(c, setCharacterCareerLength(Career.Veteran));
  expect(c.careerStep.talentDeferred).toBe(false);
});

test('changing species drops stale deferral and normal page history remains usable', () => {
  const c = character();
  c.speciesStep.ability = new SpeciesAbility(
    Species.Human,
    Source.Core2ndEdition,
    ['Tough'],
  );
  let next = reduce(c, recordLifepathTalentProgress(StepContext.Species));
  const history = pushPage(
    [],
    PageIdentity.SpeciesDetails,
    PageIdentity.Environment,
  );
  expect(popPage(history).page).toBe(PageIdentity.SpeciesDetails);
  expect(next.speciesStep.talentDeferred).toBe(true);
  next = reduce(next, setCharacterSpecies(Species.Vulcan));
  expect(next.speciesStep.talentDeferred).toBe(false);
});

test.each([
  Stereotype.MainCharacter,
  Stereotype.SoloCharacter,
  Stereotype.SupportingCharacter,
  Stereotype.Npc,
])('1e and non-main-character paths ignore deferral (%s)', (stereotype) => {
  const c = character();
  c.stereotype = stereotype;
  if (stereotype === Stereotype.MainCharacter) c.version = 1;
  const next = reduce(c, recordLifepathTalentProgress(StepContext.Education));
  expect(next).toBe(c);
  expect(canDeferTalent(c, StepContext.Education)).toBe(false);
  expect(finalLifepathTalentErrors(c)).toEqual([]);
});

test('upbringing copy preserves deferred state and upstream notes through Redux and serialization', () => {
  const c = character();
  c.upbringingStep.notes = 'Grew up aboard a survey ship.';
  c.upbringingStep.talentDeferred = true;
  const stepCopy = c.upbringingStep.copy();
  expect(stepCopy).not.toBe(c.upbringingStep);
  expect(stepCopy.talentDeferred).toBe(true);
  expect(stepCopy.notes).toBe(c.upbringingStep.notes);
  stepCopy.notes = 'Changed copy';
  expect(c.upbringingStep.notes).toBe('Grew up aboard a survey ship.');
  const updated = reduce(c.copy(), setCharacterName('Compatibility test'));
  expect(updated.upbringingStep.talentDeferred).toBe(true);
  expect(updated.upbringingStep.notes).toBe(c.upbringingStep.notes);
  const restored = marshaller.decodeCharacter(
    marshaller.decode(marshaller.encodeMainCharacter(updated)),
  );
  expect(restored.upbringingStep.talentDeferred).toBe(true);
  expect(restored.upbringingStep.notes).toBe(c.upbringingStep.notes);
});

test.each([
  StepContext.Species,
  StepContext.EarlyOutlook,
  StepContext.Education,
  StepContext.Career,
])(
  'advancing records an unselected choice at origin %s without changing other choices',
  (context) => {
    const c = character();
    c.speciesStep = new SpeciesStep(Species.Betazoid);
    c.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
      Species.Betazoid,
    );
    const next = reduce(c, recordLifepathTalentProgress(context));
    expect(getLifepathTalentStep(next, context).talentDeferred).toBe(true);
    expect(getLifepathTalentStep(c, context).talentDeferred).toBe(false);
    expect(lifepathTalentError(next, context)).toBeUndefined();
    expect(lifepathTalentError(next, context, true)).toBeTruthy();
    const restored = marshaller.decodeCharacter(
      marshaller.decode(marshaller.encodeMainCharacter(next)),
    );
    expect(getLifepathTalentStep(restored, context).talentDeferred).toBe(true);
  },
);

test('advancing keeps incomplete extra selections for final review', () => {
  let c = character();
  c.educationStep.talent = new SelectedTalent('Bold');
  c = reduce(c, recordLifepathTalentProgress(StepContext.Education));
  expect(c.educationStep.talent.talent).toBe('Bold');
  expect(c.educationStep.talentDeferred).toBe(false);
  expect(lifepathTalentError(c, StepContext.Education)).toBeUndefined();
  expect(lifepathTalentError(c, StepContext.Education, true)).toBeTruthy();
  const t = c.educationStep.talent.copy();
  t.department = Department.Command;
  c = reduce(c, addCharacterTalent(t, StepContext.Education));
  expect(lifepathTalentError(c, StepContext.Education, true)).toBeUndefined();
});

test('career review can change Untapped Potential attribute without the reducer overwriting it', () => {
  const c = character();
  c.careerStep = new CareerStep(Career.Young);
  c.careerStep.talent = new SelectedTalent('Untapped Potential');
  c.careerStep.talent.attribute = Attribute.Control;
  const updated = c.careerStep.talent.copy();
  updated.attribute = Attribute.Insight;
  const next = reduce(c, addCharacterTalent(updated, StepContext.Career));
  expect(next.careerStep.talent.attribute).toBe(Attribute.Insight);
  expect(c.careerStep.talent.attribute).toBe(Attribute.Control);
});

test.each(['1e', 'solo'])(
  'recording skipped choices does not change %s characters',
  (mode) => {
    const c = character();
    if (mode === '1e') c.version = 1;
    else c.stereotype = Stereotype.SoloCharacter;
    const next = reduce(c, recordLifepathTalentProgress(StepContext.Education));
    expect(next.educationStep.talentDeferred).toBe(false);
  },
);

test('General Edit updates the upbringing talent without overwriting its focus', () => {
  const c = character();
  c.upbringingStep.focus = 'Computers';
  c.upbringingStep.talent = new SelectedTalent('Tough');
  const origin = c.talentAssemblies.find(
    (t) => t.context === AssemblyContext.EarlyOutlook,
  );
  const next = reduce(
    c,
    updateCharacterGeneralEditTalentChange(origin, new SelectedTalent('Bold')),
  );
  expect(next.upbringingStep.talent.talent).toBe('Bold');
  expect(next.upbringingStep.focus).toBe('Computers');
  expect(c.upbringingStep.talent.talent).toBe('Tough');
});

test.each([
  [Career.Veteran, 'Veteran'],
  [Career.Young, 'Untapped Potential'],
])(
  'career talents are offered only in the career length slot (%s)',
  (career, talent) => {
    const c = character();
    c.careerStep.career = career;
    expect(names(c, StepContext.Career)).toContain(talent);
    for (const context of [
      StepContext.EarlyOutlook,
      StepContext.Education,
      StepContext.FinishingTouches,
    ]) {
      expect(names(c, context)).not.toContain(talent);
    }
  },
);

test('final talent errors show stage names unescaped', () => {
  const errors = finalLifepathTalentErrors(character());
  expect(errors).toContain(
    'Upbringing / early outlook: Select a talent before finishing.',
  );
  expect(errors.join('\n')).not.toContain('&#x2F;');
});
