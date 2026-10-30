import React from 'react';
import { t } from 'i18next';
import type { Character } from '../common/character';
import type { StepContext } from '../state/characterActions';
import { addCharacterTalent } from '../state/characterActions';
import { store } from '../state/store';
import {
  canDeferTalent,
  finalLifepathTalentErrors,
  getLifepathTalentChoices,
  getLifepathTalentStep,
  lifepathTalentContexts,
  lifepathTalentError,
  lifepathTalentLabel,
  requiresLifepathTalent,
  supportsDeferredTalents,
} from '../helpers/lifepathTalents';
import { TalentEditView } from './talentEditView';
import { Header } from './header';

export const OptionalTalentNote: React.FC<{
  character: Character;
  context: StepContext;
}> = ({ character, context }) =>
  canDeferTalent(character, context) ? (
    <p>{t('LifepathTalentReview.optional')}</p>
  ) : null;

export const LifepathTalentReview: React.FC<{ character: Character }> = ({
  character,
}) => {
  if (!supportsDeferredTalents(character)) return null;
  const errors = finalLifepathTalentErrors(character);
  return (
    <section className="my-4" aria-label={t('LifepathTalentReview.title')}>
      <Header level={2}>{t('LifepathTalentReview.title')}</Header>
      <p>{t('LifepathTalentReview.instruction')}</p>
      <p role="status">
        {errors.length
          ? t('LifepathTalentReview.remaining', { count: errors.length })
          : t('LifepathTalentReview.complete')}
      </p>
      <div className="row">
        {lifepathTalentContexts
          .filter((c) => requiresLifepathTalent(character, c))
          .map((context) => (
            <TalentEditView
              key={context}
              heading={lifepathTalentLabel(context)}
              character={character}
              talent={getLifepathTalentStep(character, context)?.talent}
              choices={getLifepathTalentChoices(character, context).map(
                (t) => t.talentModel,
              )}
              error={lifepathTalentError(character, context, true)}
              onChange={(talent) =>
                store.dispatch(addCharacterTalent(talent, context))
              }
            />
          ))}
      </div>
    </section>
  );
};
