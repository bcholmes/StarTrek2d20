import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  Character,
  SpeciesStep,
  UpbringingStep,
} from '../../src/common/character';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbilityList } from '../../src/helpers/speciesAbility';
import { EarlyOutlook, UpbringingsHelper } from '../../src/helpers/upbringings';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { EarlyOutlookDetailsPage } from '../../src/pages/earlyOutlookDetailsPage';
import { setSources } from '../../src/state/contextActions';
import { setCharacter } from '../../src/state/characterActions';
import { store } from '../../src/state/store';
import { Navigation } from '../../src/common/navigator';
import { Dialog } from '../../src/components/dialog';
import { PageIdentity } from '../../src/pages/pageIdentity';

const mockButtons: Record<string, () => void> = {};
jest.mock('react-bootstrap/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }) => {
    mockButtons[String(children)] = onClick;
    return <button>{children}</button>;
  },
}));
jest.mock('react-redux', () => ({ connect: () => (component) => component }));
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../src/components/staMarkdown', () => ({
  STAMarkdown: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../src/components/richTextEditor', () => ({
  RichTextEditor: () => null,
}));
jest.mock('../../src/components/characterCreationBreadcrumbs', () => ({
  CharacterCreationBreadcrumbs: () => null,
}));
jest.mock('../../src/components/pageHistoryBasedPreviousButton', () => ({
  PageHistoryBasedPreviousButton: () => null,
}));
jest.mock('../../src/common/navigator', () => ({
  Navigation: { navigateToPage: jest.fn() },
}));
jest.mock('../../src/components/dialog', () => ({
  Dialog: { show: jest.fn() },
}));
Object.defineProperty(global, 'window', {
  value: { localStorage: { getItem: () => null, setItem: () => {} } },
  writable: true,
});

beforeAll(async () => {
  await i18next
    .use(initReactI18next)
    .init({ lng: 'en', resources: { en: { translation: translations } } });
});
beforeEach(() => {
  jest.clearAllMocks();
  store.dispatch(setSources([Source.Core2ndEdition]));
});
function character() {
  const c = new Character();
  c.version = 2;
  c.speciesStep = new SpeciesStep(Species.Human);
  c.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
    Species.Human,
  );
  c.upbringingStep = new UpbringingStep(
    UpbringingsHelper.getUpbringing(EarlyOutlook.MilitaryOrExploration),
  );
  c.upbringingStep.discipline = Department.Command;
  c.upbringingStep.focus = 'Computers';
  return c;
}
function next(c: Character) {
  store.dispatch(setCharacter(c));
  renderToStaticMarkup(
    <EarlyOutlookDetailsPage {...({ character: c } as any)} />,
  );
  mockButtons.Next();
}
test('Next skips an unselected 2e talent and records its origin', () => {
  next(character());
  expect(Dialog.show).not.toHaveBeenCalled();
  expect(Navigation.navigateToPage).toHaveBeenCalledWith(PageIdentity.Career);
  expect(
    store.getState().character.currentCharacter.upbringingStep.talentDeferred,
  ).toBe(true);
});
test('Next allows Bold department details to be completed at final review', () => {
  const c = character();
  c.upbringingStep.talent = new SelectedTalent('Bold');
  next(c);
  expect(Navigation.navigateToPage).toHaveBeenCalledWith(PageIdentity.Career);
  expect(
    store.getState().character.currentCharacter.upbringingStep.talent.talent,
  ).toBe('Bold');
});
test('skipping talents does not bypass focus validation', () => {
  const c = character();
  c.upbringingStep.focus = '';
  next(c);
  expect(Dialog.show).toHaveBeenCalled();
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
test('first edition still requires the talent before continuing', () => {
  const c = character();
  c.version = 1;
  next(c);
  expect(Dialog.show).toHaveBeenCalled();
  expect(Navigation.navigateToPage).not.toHaveBeenCalled();
});
