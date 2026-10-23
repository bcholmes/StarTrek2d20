import React from 'react';
import i18next from 'i18next';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  Character,
  CareerStep,
  EducationStep,
  FinishingStep,
} from '../../src/common/character';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import { SpeciesStep } from '../../src/common/character';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Track } from '../../src/helpers/trackEnum';
import { Career } from '../../src/helpers/careerEnum';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';
import { CharacterType } from '../../src/common/characterType';
import { Stereotype } from '../../src/common/construct';
import { Navigation } from '../../src/common/navigator';
import { Dialog } from '../../src/components/dialog';
import { store } from '../../src/state/store';
import {
  setCharacter,
  addCharacterTalent,
  StepContext,
} from '../../src/state/characterActions';
import { setSources } from '../../src/state/contextActions';
import { EducationDetailsPage } from '../../src/pages/educationDetailsPage';
import { CareerLengthDetailsPage } from '../../src/pages/careerLengthDetailsPage';
import { NoviceOrCadetExperiencePage } from '../../src/pages/noviceOrCadetExperiencePage';
import { FinishPage } from '../../src/pages/finishPage';
import { PageIdentity } from '../../src/pages/pageIdentity';
import { marshaller } from '../../src/helpers/marshaller';

jest.mock('react-redux', () => ({ connect: () => (component) => component }));
jest.mock('../../src/components/staMarkdown', () => ({
  STAMarkdown: () => null,
}));
jest.mock('react-router', () => ({ Link: () => null }));
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: i18next.t }),
}));
jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }));
jest.mock('../../src/components/richTextEditor', () => ({
  RichTextEditor: () => null,
}));
jest.mock('../../src/components/dialog', () => ({
  Dialog: { show: jest.fn() },
}));
jest.mock('../../src/common/navigator', () => ({
  Navigation: { navigateToPage: jest.fn() },
}));
Object.defineProperty(global, 'window', {
  value: {
    localStorage: { getItem: () => null, setItem: jest.fn() },
    open: jest.fn(),
  },
  writable: true,
});
beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});
beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(React, 'useState')
    .mockImplementation(((initial: any) => [initial, jest.fn()]) as any);
  jest.spyOn(React, 'useEffect').mockImplementation(() => {});
  store.dispatch(setSources([Source.Core, Source.Core2ndEdition]));
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

function character(version = 2) {
  const c = new Character();
  c.speciesStep = new SpeciesStep(Species.Human);
  c.speciesStep.ability = new SpeciesAbility(Species.Human);
  c.version = version;
  c.educationStep = new EducationStep(Track.Command);
  c.educationStep.attributes = [
    Attribute.Control,
    Attribute.Daring,
    Attribute.Reason,
  ];
  c.educationStep.primaryDiscipline = Department.Command;
  c.educationStep.disciplines = [Department.Conn, Department.Science];
  c.educationStep.focuses = ['Diplomacy', 'History', 'Leadership'];
  c.educationStep.value = 'We learn together';
  c.careerStep = new CareerStep(Career.Experienced);
  return c;
}
function elements(node: any): any[] {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(elements);
  return [node, ...elements(node.props?.children)];
}
function page(component, c: Character) {
  store.dispatch(setCharacter(c));
  return (component as any)({ character: c });
}
function click(tree, text = 'Next') {
  const button = elements(tree).find(
    (e) => e.props?.onClick && e.props.children === text,
  );
  expect(button).toBeDefined();
  button.props.onClick();
}

test('1e education blocks a missing talent after all other fields are complete', () => {
  click(page(EducationDetailsPage, character(1)));
  expect(Dialog.show).toHaveBeenCalledWith(i18next.t('Common.error.talent'));
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
test('2e main education allows skipping and records the missing choice', () => {
  click(page(EducationDetailsPage, character()));
  expect(Dialog.show).not.toHaveBeenCalled();
  expect(Navigation.navigateToPage).toHaveBeenCalledWith(
    PageIdentity.CareerLength,
  );
  expect(
    store.getState().character.currentCharacter.educationStep.talentDeferred,
  ).toBe(true);
});
test('2e education still blocks missing non-talent requirements', () => {
  const c = character();
  c.educationStep.value = '';
  click(page(EducationDetailsPage, c));
  expect(Dialog.show).toHaveBeenCalledWith(i18next.t('Common.error.value'));
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
test('1e education still requires the details of a selected Bold talent', () => {
  const c = character(1);
  c.educationStep.talent = new SelectedTalent('Bold');
  click(page(EducationDetailsPage, c));
  expect(Dialog.show).toHaveBeenCalled();
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
test.each([1, 2])(
  'career missing-talent validation remains edition-specific (%s)',
  (version) => {
    click(page(CareerLengthDetailsPage, character(version)));
    if (version === 1) {
      expect(Dialog.show).toHaveBeenCalled();
      expect(Navigation.navigateToPage).not.toHaveBeenCalled();
    } else {
      expect(Dialog.show).not.toHaveBeenCalled();
      expect(Navigation.navigateToPage).toHaveBeenCalledWith(
        PageIdentity.CareerEvent1,
      );
    }
  },
);
test.each([CharacterType.Starfleet, CharacterType.Cadet])(
  'novice/cadet assigns fixed talent, explains only its attribute may wait, and preserves revisits (%s)',
  (type) => {
    const c = character();
    c.type = type;
    c.careerStep = new CareerStep(Career.Young);
    (React.useEffect as jest.Mock).mockImplementation((effect) => effect());
    const tree = page(NoviceOrCadetExperiencePage, c);
    const text = elements(tree)
      .map((e) => e.props?.children)
      .filter((c) => typeof c === 'string')
      .join(' ');
    expect(text).toContain('assigned automatically');
    expect(text).not.toContain('select this talent now or leave it');
    expect(
      store.getState().character.currentCharacter.careerStep.talent.talent,
    ).toBe('Untapped Potential');
    click(tree);
    expect(Dialog.show).not.toHaveBeenCalled();
    const revisit = store.getState().character.currentCharacter.copy();
    revisit.careerStep.talent.attribute = Attribute.Control;
    page(NoviceOrCadetExperiencePage, revisit);
    expect(
      store.getState().character.currentCharacter.careerStep.talent.attribute,
    ).toBe(Attribute.Control);
  },
);
test('non-main novice still requires an attribute before advancing', () => {
  const c = character();
  c.stereotype = Stereotype.SupportingCharacter;
  click(page(NoviceOrCadetExperiencePage, c));
  expect(Dialog.show).toHaveBeenCalledWith(
    i18next.t('NoviceOrCadetExperiencePage.attribute.error'),
  );
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
test('delayed view refuses a talent that becomes incomplete after the first validation', () => {
  jest.useFakeTimers();
  const c = new Character();
  c.speciesStep = new SpeciesStep(Species.Human);
  c.speciesStep.ability = new SpeciesAbility(Species.Human);
  c.version = 2;
  c.pastime = [];
  c.finishingStep = new FinishingStep();
  c.finishingStep.talent = new SelectedTalent('Tough');
  const encode = jest.spyOn(marshaller, 'encodeMainCharacter');
  click(page(FinishPage, c), i18next.t('Common.button.view'));
  expect(Dialog.show).not.toHaveBeenCalled();
  store.dispatch(addCharacterTalent(undefined, StepContext.FinishingTouches));
  jest.runAllTimers();
  expect(Dialog.show).toHaveBeenCalled();
  expect(encode).not.toHaveBeenCalled();
  expect(window.open).not.toHaveBeenCalled();
});
