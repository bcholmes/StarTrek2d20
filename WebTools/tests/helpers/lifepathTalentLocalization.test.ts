import i18next from 'i18next';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  Character,
  CareerStep,
  EducationStep,
} from '../../src/common/character';
import { Track } from '../../src/helpers/trackEnum';
import { StepContext } from '../../src/state/stepContext';
import {
  lifepathTalentLabel,
  lifepathTalentError,
  finalLifepathTalentErrors,
} from '../../src/helpers/lifepathTalents';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import { SpeciesStep } from '../../src/common/character';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Department } from '../../src/helpers/department';
import { setSources } from '../../src/state/contextActions';
import { Source } from '../../src/helpers/sources';
import { store } from '../../src/state/store';

Object.defineProperty(global, 'window', {
  value: { localStorage: { getItem: () => null, setItem: () => {} } },
  writable: true,
});
beforeAll(async () => {
  // A deliberately small test language proves runtime lookup and fallback;
  // these are test resources, not a translation of the application.
  await i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: translations },
      de: {
        translation: {
          'LifepathTalentReview.origin.education': 'Ausbildung',
          'LifepathTalentReview.error.missing': 'Talent auswählen.',
          'LifepathTalentReview.originError': '{{error}} ({{origin}})',
        },
      },
    },
  });
});
beforeEach(() => {
  store.dispatch(setSources([Source.Core2ndEdition]));
});
afterEach(async () => {
  await i18next.changeLanguage('en');
});
function character() {
  const c = new Character();
  c.speciesStep = new SpeciesStep(Species.Human);
  c.speciesStep.ability = new SpeciesAbility(Species.Human);
  c.version = 2;
  c.educationStep = new EducationStep(Track.Command);
  return c;
}
test('origin labels and final errors follow a language change without recreating the character', async () => {
  const c = character();
  expect(lifepathTalentLabel(StepContext.Education)).toBe('Education');
  await i18next.changeLanguage('de');
  expect(lifepathTalentLabel(StepContext.Education)).toBe('Ausbildung');
  expect(lifepathTalentError(c, StepContext.Education, true)).toBe(
    'Talent auswählen.',
  );
  expect(finalLifepathTalentErrors(c)).toEqual([
    'Talent auswählen. (Ausbildung)',
  ]);
  expect(lifepathTalentLabel(StepContext.Career)).toBe('Career length');
});
test.each(['missing', 'ineligible', 'details', 'duplicate'])(
  'review error %s uses the translation resource',
  async (key) => {
    const c = character();
    if (key === 'ineligible')
      c.educationStep.talent = new SelectedTalent('Not a real talent');
    if (key === 'details') {
      c.educationStep.talent = new SelectedTalent('Tough');
      c.educationStep.talent.focuses = ['   '];
    }
    if (key === 'duplicate') {
      c.educationStep.talent = SelectedTalent.createWithDepartment(
        'Bold',
        Department.Conn,
      );
      c.careerStep = new CareerStep();
      c.careerStep.talent = SelectedTalent.createWithDepartment(
        'Bold',
        Department.Conn,
      );
    }
    expect(lifepathTalentError(c, StepContext.Education, true)).toBe(
      i18next.t('LifepathTalentReview.error.' + key),
    );
  },
);
