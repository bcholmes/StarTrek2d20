import { useTranslation } from 'react-i18next';
import { LogEntry, LogValueEntry, ValueUseType } from '../../common/logEntry';
import type { ICharacterProperties } from '../../solo/page/soloCharacterProperties';
import { Button } from 'react-bootstrap';
import { InputFieldAndLabel } from '../../common/inputFieldAndLabel';
import { useState } from 'react';
import { LogEntryValueView } from './logEntryValueView';
import { Header } from '../../components/header';
import { Dialog } from '../../components/dialog';
import { RichTextEditor } from '../../components/richTextEditor';
import { STAMarkdown } from '../../components/staMarkdown';

class SelectedLogValueEntry {
  logEntry: LogValueEntry;
  selected: boolean;

  constructor(logEntry: LogValueEntry) {
    this.logEntry = logEntry;
  }
}

interface ICharacterLogEntryViewProperties extends ICharacterProperties {
  onNextStep: () => void;
  onPreviousStep: () => void;
  saveLogEntry: (logEntry: LogEntry) => void;
}

export const CharacterLogEntryView: React.FC<
  ICharacterLogEntryViewProperties
> = ({ character, onNextStep, onPreviousStep, saveLogEntry }) => {
  const initializeLogValueEntries = () => {
    return character.values.map((v) => {
      const result = new SelectedLogValueEntry(new LogValueEntry(v));
      result.selected = false;
      return result;
    });
  };

  const { t } = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [values, setValues] = useState<SelectedLogValueEntry[]>(
    initializeLogValueEntries(),
  );
  const [directives, setDirectives] = useState<string[]>(['', '', '']);

  const createLogEntryAndNext = () => {
    const valuesUsed = values.filter((v) => v.selected).map((v) => v.logEntry);
    if (title.length === 0) {
      Dialog.show('Please select a title');
    } else if (details.length === 0) {
      Dialog.show('Please provide some mission details');
    } else if (
      valuesUsed.filter(
        (v) => v.useType === ValueUseType.Challenged && !v.newValue?.length,
      ).length
    ) {
      Dialog.show('Please provide a new value for any challenged values.');
    } else {
      const entry = new LogEntry((character.logEntries?.length ?? 0) + 1);
      entry.adventureTitle = title;
      entry.missionDescription = details;
      entry.notes = notes;
      entry.directivesUsed = directives.filter((d) => d?.length);
      entry.valuesUsed = valuesUsed;
      saveLogEntry(entry);
      onNextStep();
    }
  };

  const modifyValue = (index: number, value?: LogValueEntry) => {
    const temp = [...values];
    const entry = new SelectedLogValueEntry(
      value === undefined ? values[index].logEntry : value,
    );
    entry.selected = value !== undefined;

    temp[index] = entry;
    setValues(temp);
  };

  const modifyDirective = (directive: string, index: number) => {
    const temp = [...directives];
    temp[index] = directive;
    let last = 0;

    temp.forEach((d, i) => {
      if (d?.length) {
        last = i;
      }
    });

    last += 3;
    for (let i = temp.length; i < last; i++) {
      temp.push('');
    }
    setDirectives(temp);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6">
          <STAMarkdown className="mt-4">
            {t('CharacterLogEntry.instruction')}
          </STAMarkdown>

          <div className="my-3">
            <InputFieldAndLabel
              id="title"
              value={title}
              labelName="Adventure Title"
              onChange={setTitle}
            />
          </div>

          <div className="my-3">
            <RichTextEditor
              initialText={details}
              placeholder="Mission details"
              onChange={setDetails}
            />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <STAMarkdown className="mt-4">
            {t('CharacterLogEntry.notes.instruction')}
          </STAMarkdown>

          <div className="my-3">
            <RichTextEditor
              initialText={notes}
              placeholder="Notes (optional)"
              onChange={setNotes}
            />
          </div>
        </div>

        <div className="col-12">
          <Header level={2} className="mt-4">
            {t('Construct.other.values')}
          </Header>
          <STAMarkdown className="mt-4">
            {t('CharacterLogEntry.values.instruction')}
          </STAMarkdown>

          <table className="selection-list">
            {values.map((v, i) => (
              <LogEntryValueView
                value={v.logEntry}
                selected={v.selected}
                character={character}
                onChange={(value) => modifyValue(i, value)}
                key={'value-' + i}
              />
            ))}
          </table>
        </div>

        <div className="col-12 col-lg-6">
          <Header level={2} className="mt-4">
            {t('Common.text.directives')}
          </Header>
          <STAMarkdown className="mt-4">
            {t('CharacterLogEntry.directives.instruction')}
          </STAMarkdown>
          {directives.map((d, i) => (
            <InputFieldAndLabel
              id={'directive-' + i}
              labelName={t('Common.text.directive')}
              className="mt-3"
              value={d}
              onChange={(directive) => modifyDirective(directive, i)}
              key={'directive-' + i}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 d-flex justify-content-between">
        <Button size="sm" onClick={() => onPreviousStep()}>
          {t('Common.button.previous')}
        </Button>
        <Button size="sm" onClick={() => createLogEntryAndNext()}>
          {t('Common.button.next')}
        </Button>
      </div>
    </>
  );
};
