import React from 'react';
import { Button } from 'react-bootstrap';
import { t } from 'i18next';
import type { Character } from '../common/character';
import type { SelectedTalent } from '../common/selectedTalent';
import type { TalentModel } from '../helpers/talentModel';
import { AdditionalTalentInfo } from '../supportingcharacters/modify/additionalTalentInfo';
import { Header } from './header';
import { ModalControl } from './modal';
import { SelectedTalentDescriptionView } from './selectedTalentDescriptionView';
import { SimpleTalentSelectionList } from './simpleTalentSelectionList';

interface TalentEditViewProps {
  character: Character;
  heading: string;
  talent?: SelectedTalent;
  choices: TalentModel[];
  onChange: (talent?: SelectedTalent) => void;
  error?: string;
}

// Shared by General Edit and lifepath review, including talent-specific fields.
export const TalentEditView: React.FC<TalentEditViewProps> = ({
  character,
  heading,
  talent,
  choices,
  onChange,
  error,
}) => {
  const showSelection = () => {
    ModalControl.show(
      'xl',
      undefined,
      <div>
        <SimpleTalentSelectionList
          heading={t('Construct.other.talents')}
          allowDeselect={false}
          construct={character}
          talents={[...choices]}
          initialSelection={talent?.name}
          onSelection={(selection) => {
            onChange(
              selection && selection.name === talent?.name
                ? talent.copy()
                : selection,
            );
            ModalControl.hide();
          }}
        />
        <div className="text-center mt-4">
          <Button size="sm" onClick={() => ModalControl.hide()}>
            {t('Common.button.ok')}
          </Button>
        </div>
      </div>,
      t('ModifySupportingCharacter.talentModal.title'),
    );
  };

  return (
    <section className="col-12 col-md-6" aria-label={heading}>
      <Header level={2} className="my-4">
        {heading}
      </Header>
      <div className="text-end">
        <Button size="sm" variant="outline-primary" onClick={showSelection}>
          {talent ? t('Common.button.modify') : t('Common.button.select')}
        </Button>
      </div>
      {talent ? (
        <>
          <SelectedTalentDescriptionView
            talent={talent}
            version={character.version}
          />
          <AdditionalTalentInfo
            key={talent.name}
            character={character}
            talentSelection={talent}
            setTalentSelection={onChange}
            simpleHeader={true}
          />
        </>
      ) : (
        <p>{t('TalentEdit.unselected')}</p>
      )}
      {error && (
        <p className="text-warning" role="status">
          {error}
        </p>
      )}
    </section>
  );
};
