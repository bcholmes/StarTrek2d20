import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { Header } from '../components/header';
import { StatView } from '../components/StatView';
import { Attribute } from '../helpers/attributes';
import { marshaller } from '../helpers/marshaller';
import { getNameAndShortRankOf } from '../helpers/ranks';
import { Department } from '../helpers/department';
import {
  removeGMTrackedCharacter,
  setGMTrackedCharacterStress,
} from '../state/gmTrackerActions';
import { store } from '../state/store';
import type { CharacterWithTracking } from './model/characterWithTracking';
import { IconButton } from '../components/iconButton';

interface IGMCharacterViewProperties {
  tracking: CharacterWithTracking;
}

export const GMCharacterView: React.FC<IGMCharacterViewProperties> = ({
  tracking,
}) => {
  const { t } = useTranslation();
  const character = tracking.character;

  const renderJob = () => {
    let result = '';
    if (character.assignment) {
      result += character.assignment;
    }
    return result.length ? ', ' + result : '';
  };

  const renderStress = () => {
    const stress = tracking?.character?.stress;
    if (character.isStressTrackPresent && stress) {
      const iterator = [];
      for (let i = 1; i <= stress; i++) {
        iterator.push(i);
      }

      const pills = iterator.map((i) => {
        return (
          <div
            className="empty-pill compact mb-1 text-center text-white"
            role="button"
            key={'stress-' + i}
            onClick={() => changeStress(i + 1)}
          >
            {i < tracking.currentStress ? (
              <i className="bi bi-check"></i>
            ) : null}
          </div>
        );
      });
      return (
        <div>
          <p className="small mb-0">
            <b>{t('Construct.other.stress')}</b>
          </p>
          <div className="d-flex flex-wrap mb-1">{pills}</div>
        </div>
      );
    } else if (character.isPersonalThreatTrackPresent) {
      const iterator = [];
      for (let i = 1; i <= character.personalThreat; i++) {
        iterator.push(i);
      }

      const pills = iterator.map((i) => {
        return (
          <div
            className="empty-pill compact mb-1 text-center text-white"
            key={'threat-' + i}
            onClick={() => {}}
          ></div>
        );
      });
      return (
        <div>
          <p className="small mb-0">
            <b>{t('Construct.other.personalThreat')}</b>
          </p>
          <div className="d-flex flex-wrap mb-1">{pills}</div>
        </div>
      );
    } else {
      return undefined;
    }
  };

  const changeStress = (i: number) => {
    let stress = i;
    if (i === tracking.currentStress && i > 0) {
      stress--;
    }
    store.dispatch(setGMTrackedCharacterStress(tracking, stress));
  };

  const viewCharacter = () => {
    const value = marshaller.encodeCharacter(tracking?.character);
    window.open('/view?s=' + value, '_blank');
  };

  const removeCharacter = () => {
    store.dispatch(removeGMTrackedCharacter(tracking));
  };

  return (
    <div className="mb-2">
      <Header level={2}>{getNameAndShortRankOf(character)}</Header>
      <div className="text-white">
        {character.speciesName}
        {renderJob()}
      </div>
      <div className="d-lg-flex justify-content-start " style={{ gap: '1rem' }}>
        <div className="mb-2" style={{ width: '380px' }}>
          <div className="row row-cols-1 row-cols-md-3 mt-1">
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Control]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Control]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Fitness]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Fitness]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Presence]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Presence]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Daring]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Daring]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Insight]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Insight]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.attribute.', Attribute[Attribute.Reason]),
              )}
              value={
                character.attributes
                  ? character.attributes[Attribute.Reason]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
          </div>

          <div className="row row-cols-1 row-cols-md-3 mt-1">
            <StatView
              name={t(
                makeKey(
                  'Construct.discipline.',
                  Department[Department.Command],
                ),
              )}
              value={
                character.departments
                  ? character.departments[Department.Command]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey(
                  'Construct.discipline.',
                  Department[Department.Security],
                ),
              )}
              value={
                character.departments
                  ? character.departments[Department.Security]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey(
                  'Construct.discipline.',
                  Department[Department.Science],
                ),
              )}
              value={
                character.departments
                  ? character.departments[Department.Science]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey('Construct.discipline.', Department[Department.Conn]),
              )}
              value={
                character.departments
                  ? character.departments[Department.Conn]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey(
                  'Construct.discipline.',
                  Department[Department.Engineering],
                ),
              )}
              value={
                character.departments
                  ? character.departments[Department.Engineering]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
            <StatView
              name={t(
                makeKey(
                  'Construct.discipline.',
                  Department[Department.Medicine],
                ),
              )}
              value={
                character.departments
                  ? character.departments[Department.Medicine]
                  : undefined
              }
              className="col mb-1"
              size="sm"
              showZero={true}
            />
          </div>
        </div>

        <div className="mb-2" style={{ width: '180px' }}>
          {renderStress()}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-lg-9">
          <div className="text-white">
            <b>{t('Construct.other.focuses')}:</b>{' '}
            {character.focuses?.map((f, i) => (i > 0 ? ', ' : '') + f)}
          </div>
          {character.values?.length ? (
            <div className="text-white">
              <b>{t('Construct.other.values')}:</b>{' '}
              {character.values?.map((f, i) => (i > 0 ? ', ' : '') + f)}
            </div>
          ) : undefined}
          <div className="text-white">
            <b>{t('Construct.other.talents')}:</b>{' '}
            {character
              .getTalentNameList()
              ?.map((t, i) => (i > 0 ? ', ' : '') + t)}
          </div>
        </div>
        <div className="col-lg-3 text-end">
          <IconButton onClick={() => viewCharacter()} icon="eyeglasses" />
          <IconButton
            variant="danger"
            onClick={() => removeCharacter()}
            icon="trash"
          />
        </div>
      </div>
    </div>
  );
};
