import React, { useEffect, useState } from 'react';
import { Header } from '../components/header';
import { useTranslation } from 'react-i18next';
import { StressOrShieldsView } from './stressOrShieldsView';
import { CharacterStatBlock } from './characterStatBlock';
import type { ICharacterPageProperties } from '../common/iCharacterPageProperties';
import { VttSelectionDialog } from '../vtt/view/VttSelectionDialog';
import { WeaponBlockView } from './weaponBlockView';
import { FocusBlockView } from './focusBlockView';
import { ValuesBlockView } from './valuesBlockView';
import { TalentsBlockView } from './talentsBlockView';
import { SpeciesAbilityBlockView } from './speciesAbilityBlockView';
import { LoadingButton } from '../common/loadingButton';
import Button from 'react-bootstrap/Button';
import { EditableHeader } from '../mapping/view/editableHeader';
import { useNavigate } from 'react-router';
import { marshaller } from '../helpers/marshaller';
import { EquipmentBlockView } from './equipmentBlockView';
import { STAMarkdown } from '../components/staMarkdown';

export const NpcView: React.FC<ICharacterPageProperties> = ({ character }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (character.name) {
      if (character.rank) {
        document.title =
          character.rank?.localizedName +
          ' ' +
          character.name +
          ' - STAR TREK ADVENTURES';
      } else {
        document.title = character.name + ' - STAR TREK ADVENTURES';
      }
    }
  }, [character.rank, character.name]);

  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState(false);
  const changeName = (text: string) => {
    character.name = text;
    const blob = marshaller.encodeCharacter(character);
    navigate('/view?s=' + blob, { replace: true });
  };

  function renderTopFields() {
    return (
      <>
        <EditableHeader
          prefix={character.rank?.localizedAbbreviation}
          text={character.name ?? t('Construct.other.unnamedCharacter')}
          onChange={(text) => changeName(text)}
        />

        {character.description?.length ? (
          <STAMarkdown>{character.description}</STAMarkdown>
        ) : undefined}

        <div className="row mt-4" style={{ alignItems: 'baseline' }}>
          <div className="col-md-2 view-field-label pb-2">
            {t('Construct.other.pronouns')}:
          </div>
          <div className="col-md-4 text-white">
            <div className="view-border-bottom pb-2">
              {character.pronouns ? character.pronouns : undefined}
            </div>
          </div>

          <div className="col-md-2 view-field-label pb-2">
            {character.npcGenerationStep?.specialization != null
              ? t('NpcConfigurationPage.specialization')
              : t('Construct.other.characterRole')}
            :
          </div>
          <div className="col-md-4 text-white">
            <div className="view-border-bottom pb-2">
              {character.role == null
                ? character.jobAssignment
                : character.role}
            </div>
          </div>

          {character.rank ? (
            <>
              <div className="col-md-2 view-field-label pb-2">
                {t('Construct.other.rank')}:
              </div>
              <div className="col-md-4 text-white">
                <div className="view-border-bottom pb-2">
                  {character.rank?.localizedName}
                </div>
              </div>
            </>
          ) : undefined}

          <div className="col-md-2 view-field-label pb-2">
            {t('Construct.other.species')}:
          </div>
          <div className="col-md-4 text-white">
            <div className="view-border-bottom pb-2">
              {character.localizedSpeciesName}
            </div>
          </div>
        </div>

        <div className="row" style={{ alignItems: 'baseline' }}>
          <div className="col-md-2 view-field-label pb-2">
            {t('Construct.other.traits')}:
          </div>
          <div className="col-md-10 text-white">
            <div className="view-border-bottom pb-2">
              {character.getAllTraits()}
            </div>
          </div>
        </div>
      </>
    );
  }

  function showExportDialog() {
    setLoadingExport(true);
    import(
      /* webpackChunkName: 'export' */ '../components/characterSheetDialog'
    ).then(({ CharacterSheetDialog }) => {
      import(/* webpackChunkName: 'export' */ '../exportpdf/sheets').then(
        ({ CharacterSheetRegistry }) => {
          setLoadingExport(false);
          CharacterSheetDialog.show(
            CharacterSheetRegistry.getCharacterSheets(character),
            'sta-npc',
            character,
          );
        },
      );
    });
  }

  function showVttExportDialog() {
    VttSelectionDialog.instance.show(character);
  }

  return (
    <main>
      {renderTopFields()}
      <div className="row">
        <div className="col-xl-6 mt-4">
          <CharacterStatBlock character={character} />

          <SpeciesAbilityBlockView character={character} />
          <TalentsBlockView construct={character} />
        </div>
        <div className="col-xl-6">
          <div className="row">
            {character.isStressTrackPresent ||
            character.isPersonalThreatTrackPresent ? (
              <>
                {character.isStressTrackPresent ? (
                  <div className="col-xl-6 mt-4">
                    <Header level={2}>{t('Construct.other.stress')}</Header>
                    <StressOrShieldsView value={character.stress} />
                  </div>
                ) : undefined}

                {character.isPersonalThreatTrackPresent ? (
                  <div className="col-xl-6 mt-4">
                    <Header level={2}>
                      {t('Construct.other.personalThreat')}
                    </Header>
                    <StressOrShieldsView
                      value={character.personalThreat}
                      rows={1}
                    />
                  </div>
                ) : undefined}
                {character.focuses?.length ? (
                  <div className="col-xl-6 mt-4">
                    <Header level={2}>{t('Construct.other.focuses')}</Header>

                    <FocusBlockView character={character} />
                  </div>
                ) : undefined}
              </>
            ) : character.focuses?.length ? (
              <div className="col-12 mt-4">
                <Header level={2}>{t('Construct.other.focuses')}</Header>
                <FocusBlockView character={character} />
              </div>
            ) : undefined}
          </div>

          <ValuesBlockView character={character} />
          <WeaponBlockView construct={character} />
          <Header level={2} className="mt-4">
            {t('Construct.other.equipment')}
          </Header>
          <EquipmentBlockView character={character} />
        </div>
      </div>

      <div className="button-container mt-5 mb-3">
        <LoadingButton
          loading={loadingExport}
          className="btn-sm me-3"
          onClick={() => showExportDialog()}
        >
          {t('Common.button.exportPdf')}
        </LoadingButton>
        <Button
          size="sm"
          className="me-3"
          onClick={() => showVttExportDialog()}
        >
          {t('Common.button.exportVtt')}
        </Button>
      </div>
    </main>
  );
};
