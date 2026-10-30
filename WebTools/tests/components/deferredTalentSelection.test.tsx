import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  Character,
  CareerStep,
  EducationStep,
  FinishingStep,
} from '../../src/common/character';
import { Stereotype } from '../../src/common/construct';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Track } from '../../src/helpers/trackEnum';
import { Career } from '../../src/helpers/careerEnum';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';
import { TalentsHelper } from '../../src/helpers/talents';
import { setSources } from '../../src/state/contextActions';
import { setCharacter, StepContext } from '../../src/state/characterActions';
import { store } from '../../src/state/store';
import {
  OptionalTalentNote,
  LifepathTalentReview,
} from '../../src/components/deferredTalentSelection';
import { TalentEditView } from '../../src/components/talentEditView';
import { ModalControl } from '../../src/components/modal';
import { AdditionalTalentInfo } from '../../src/supportingcharacters/modify/additionalTalentInfo';
import { lifepathTalentError } from '../../src/helpers/lifepathTalents';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../src/components/richTextEditor', () => ({
  RichTextEditor: ({ initialText }) => (
    <div data-testid="rich-text">{initialText}</div>
  ),
}));
jest.mock('../../src/components/modal', () => ({
  ModalControl: { show: jest.fn(), hide: jest.fn() },
}));
Object.defineProperty(global, 'window', {
  value: { localStorage: { getItem: () => null, setItem: () => {} } },
  writable: true,
});

function createCharacter() {
  const c = new Character();
  c.version = 2;
  c.educationStep = new EducationStep(Track.Command);
  c.finishingStep = new FinishingStep();
  return c;
}
beforeAll(async () => {
  await i18next.use(initReactI18next).init({
    lng: 'en',
    resources: { en: { translation: translations } },
    interpolation: { escapeValue: false },
  });
});
beforeEach(() => {
  store.dispatch(setSources([Source.Core2ndEdition]));
  jest.clearAllMocks();
});

function findElements(element: any, type: any): React.ReactElement<any>[] {
  if (!element || typeof element !== 'object') return [];
  if (Array.isArray(element))
    return element.flatMap((e) => findElements(e, type));
  return [
    ...(element.type === type ? [element] : []),
    ...findElements(element.props?.children, type),
  ];
}
function reviewCards(c: Character) {
  return findElements(LifepathTalentReview({ character: c }), TalentEditView);
}

test('optional note explains skipping without requiring a choose-later button', () => {
  const html = renderToStaticMarkup(
    <OptionalTalentNote
      character={createCharacter()}
      context={StepContext.Education}
    />,
  );
  expect(html).toContain('select this talent now or leave it');
  expect(html).not.toContain('<button');
});

test('review includes selected and empty origins plus the final talent, without expanded selection lists', () => {
  const c = createCharacter();
  c.educationStep.talent = new SelectedTalent('Tough');
  const html = renderToStaticMarkup(<LifepathTalentReview character={c} />);
  expect(html).toContain('Education');
  expect(html).toContain('Finishing touches');
  expect(html).toContain('Tough');
  expect(html).toContain('No talent selected');
  expect(html).toContain('1 talent choice needs attention');
  expect(html).not.toContain('Advisor');
  expect(html).not.toContain('<details');
  expect(reviewCards(c)).toHaveLength(2);
});

test('review edits write to their origin and clear saved deferral without touching the final talent', () => {
  const c = createCharacter();
  c.educationStep.talentDeferred = true;
  store.dispatch(setCharacter(c));
  const card = reviewCards(c).find((e) => e.props.heading === 'Education');
  card.props.onChange(new SelectedTalent('Tough'));
  const updated = store.getState().character.currentCharacter;
  expect(updated.educationStep.talent.talent).toBe('Tough');
  expect(updated.educationStep.talentDeferred).toBe(false);
  expect(updated.finishingStep.talent).toBeUndefined();
});

test('shared selector receives only the options allowed by the original stage', () => {
  const c = createCharacter();
  c.careerStep = new CareerStep(Career.Young);
  const card = reviewCards(c).find((e) => e.props.heading === 'Career length');
  expect(card.props.choices.map((t) => t.name)).toEqual(['Untapped Potential']);
  const element = TalentEditView(card.props) as React.ReactElement<any>;
  element.props.children[1].props.children.props.onClick();
  const contents = (ModalControl.show as jest.Mock).mock.calls[0][2];
  const picker = contents.props.children[0];
  expect(picker.props.talents.map((t) => t.name)).toEqual([
    'Untapped Potential',
  ]);
});

test('Bold uses General Edit department controls and keeps the chosen department on its origin', () => {
  const c = createCharacter();
  c.educationStep.talent = new SelectedTalent('Bold');
  store.dispatch(setCharacter(c));
  const card = reviewCards(c).find((e) => e.props.heading === 'Education');
  const editor = TalentEditView(card.props);
  const fields = findElements(editor, AdditionalTalentInfo)[0];
  const department = AdditionalTalentInfo(
    fields.props,
  ) as React.ReactElement<any>;
  department.props.onDepartmentSelection(Department.Science);
  const updated = store.getState().character.currentCharacter;
  expect(updated.educationStep.talent.department).toBe(Department.Science);
  expect(updated.finishingStep.talent).toBeUndefined();
  expect(
    lifepathTalentError(updated, StepContext.Education, true),
  ).toBeUndefined();
  expect(lifepathTalentError(c, StepContext.Education, true)).toBeTruthy();
});

test('closing the shared selection modal without choosing preserves existing details', () => {
  const c = createCharacter();
  const talent = new SelectedTalent('Bold');
  talent.department = Department.Command;
  const onChange = jest.fn();
  const editor = TalentEditView({
    character: c,
    heading: 'Education',
    talent,
    choices: [TalentsHelper.getTalent('Bold')],
    onChange,
  }) as React.ReactElement<any>;
  editor.props.children[1].props.children.props.onClick();
  const contents = (ModalControl.show as jest.Mock).mock.calls[0][2];
  contents.props.children[1].props.children.props.onClick();
  expect(onChange).not.toHaveBeenCalled();
  expect(talent.department).toBe(Department.Command);
  expect(ModalControl.hide).toHaveBeenCalled();
});

test('shared editor exposes custom talent fields rather than leaving them impossible to complete', () => {
  const c = createCharacter();
  const talent = new SelectedTalent('Custom Talent');
  const html = renderToStaticMarkup(
    <TalentEditView
      character={c}
      heading="Education"
      talent={talent}
      choices={[]}
      onChange={() => {}}
    />,
  );
  expect(html).toContain('rich-text');
  expect(html).toContain('<input');
});

test.each(['1e', 'solo'])(
  'lifepath review and skip notice are absent in %s',
  (mode) => {
    const c = createCharacter();
    if (mode === '1e') c.version = 1;
    else c.stereotype = Stereotype.SoloCharacter;
    expect(
      renderToStaticMarkup(
        <OptionalTalentNote character={c} context={StepContext.Education} />,
      ),
    ).toBe('');
    expect(renderToStaticMarkup(<LifepathTalentReview character={c} />)).toBe(
      '',
    );
  },
);
