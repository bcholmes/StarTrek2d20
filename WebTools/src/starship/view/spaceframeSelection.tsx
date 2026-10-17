import React, { useState } from 'react';

import type { CharacterType } from '../../common/characterType';
import type { Starship } from '../../common/starship';
import { CheckBox } from '../../components/checkBox';
import { Department } from '../../helpers/department';
import { Source } from '../../helpers/sources';
import type { SpaceframeModel } from '../../helpers/spaceframeModel';
import { SpaceframeHelper } from '../../helpers/spaceframes';
import { System } from '../../helpers/systems';
import { hasAnySource } from '../../state/contextFunctions';
import { useTranslation } from 'react-i18next';
import { StatView } from '../../components/StatView';
import type { SpaceframeVariant } from '../../helpers/spaceframeVariant';
import { SpaceframeVariantModel } from '../../helpers/spaceframeVariant';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import type { Spaceframe } from '../../helpers/spaceframeEnum';
import { Alert } from 'react-bootstrap';

interface ISpaceframeSelectionProperties {
  serviceYear: number;
  starship: Starship;
  type: CharacterType;
  initialSelection?: SpaceframeModel;
  onSelection: (s: SpaceframeModel, variant?: SpaceframeVariant) => void;
}

export const SpaceframeSelection: React.FC<ISpaceframeSelectionProperties> = ({
  starship,
  initialSelection,
  onSelection,
}) => {
  const { t } = useTranslation();
  const [allowAllFrames, setAllowAllFrames] = useState<boolean>(false);

  const renderNotice = () => {
    if (hasAnySource([Source.UtopiaPlanitia])) {
      return <p>{t('SpaceframeSelectionPage.note')}</p>;
    } else {
      return undefined;
    }
  };

  const overrideCheckbox = (
    <CheckBox
      isChecked={allowAllFrames}
      text={t('SpaceframeSelectionPage.ignoreEndOfService')}
      value={!allowAllFrames}
      onChanged={(e) => setAllowAllFrames(!allowAllFrames)}
    />
  );

  const spaceframes = SpaceframeHelper.instance().getSpaceframes(
    starship,
    allowAllFrames,
  );
  spaceframes.sort((s1, s2) => {
    if (s1.localizedName === s2.localizedName) {
      return s2.id - s1.id;
    } else {
      return s1.localizedName.localeCompare(s2.localizedName);
    }
  });

  const chooseDefaultVariant = (spaceframe: Spaceframe) => {
    if (SpaceframeVariantModel.hasVariants(spaceframe)) {
      const variants = SpaceframeVariantModel.variantsBySpaceframe(spaceframe);
      return variants?.length ? variants[0]?.id : undefined;
    } else {
      return undefined;
    }
  };

  const variantOptions = (spaceframe: Spaceframe) => {
    return SpaceframeVariantModel.variantsBySpaceframe(spaceframe).map(
      (v) => new DropDownElement(v.id, v.localizedName),
    );
  };

  const frames = spaceframes.map((f, i) => {
    const talents = f.talents.map((t, ti) => {
      if (t === null) {
        console.log(f.name);
      }

      return t.talentModel.isAvailableForServiceYear(starship) ? (
        <div key={ti} style={{ padding: '2px' }}>
          {t.displayNameWithMultiple}
        </div>
      ) : undefined;
    });

    return (
      <tbody key={i}>
        <tr>
          <td>
            <div className="selection-header">{f.localizedName}</div>{' '}
            {f.errata ? (
              <div style={{ maxWidth: '14rem' }}>
                {t('SpaceframeSelectionPage.errata')}
              </div>
            ) : undefined}
          </td>
          <td className="d-none d-md-table-cell">
            <div
              className="row row-cols-1 row-cols-lg-3"
              style={{ maxWidth: '32rem' }}
            >
              <StatView
                name={t('Construct.system.comms')}
                value={f.systems[System.Comms]}
                className="col mb-1"
                showZero={true}
              />
              <StatView
                name={t('Construct.system.computer')}
                value={f.systems[System.Computer]}
                className="col mb-1"
                showZero={true}
              />
              <StatView
                name={t('Construct.system.engines')}
                value={f.systems[System.Engines]}
                className="col mb-1"
                showZero={true}
              />
              <StatView
                name={t('Construct.system.sensors')}
                value={f.systems[System.Sensors]}
                className="col mb-1"
                showZero={true}
              />
              <StatView
                name={t('Construct.system.structure')}
                value={f.systems[System.Structure]}
                className="col mb-1"
                showZero={true}
              />
              <StatView
                name={t('Construct.system.weapons')}
                value={f.systems[System.Weapons]}
                className="col mb-1"
                showZero={true}
              />
            </div>
            <div
              className="row row-cols-1 row-cols-lg-3 mt-2 mb-2"
              style={{ maxWidth: '32rem' }}
            >
              <StatView
                name={t('Construct.department.command')}
                value={f.departments[Department.Command]}
                className="col mb-1"
                showZero={false}
              />
              <StatView
                name={t('Construct.department.security')}
                value={f.departments[Department.Security]}
                className="col mb-1"
                showZero={false}
              />
              <StatView
                name={t('Construct.department.science')}
                value={f.departments[Department.Science]}
                className="col mb-1"
                showZero={false}
              />
              <StatView
                name={t('Construct.department.conn')}
                value={f.departments[Department.Conn]}
                className="col mb-1"
                showZero={false}
              />
              <StatView
                name={t('Construct.department.engineering')}
                value={f.departments[Department.Engineering]}
                className="col mb-1"
                showZero={false}
              />
              <StatView
                name={t('Construct.department.medicine')}
                value={f.departments[Department.Medicine]}
                className="col mb-1"
                showZero={false}
              />
            </div>
          </td>

          <td
            className="d-none d-md-table-cell"
            style={{ verticalAlign: 'top', textAlign: 'center' }}
          >
            {f.scale}
          </td>
          <td
            className="d-none d-md-table-cell"
            style={{ verticalAlign: 'top' }}
          >
            {talents}
          </td>
          <td>
            <CheckBox
              isChecked={initialSelection?.id === f.id}
              text=""
              value={f.id}
              onChanged={(e) => onSelection(f, chooseDefaultVariant(f.id))}
            />
          </td>
        </tr>
        {initialSelection?.id === f.id &&
        SpaceframeVariantModel.hasVariants(initialSelection.id) ? (
          <tr className="d-none d-md-table-row">
            <td></td>
            <td colSpan={3}>
              <div className="my-3 d-flex justify-content-start align-items-baseline">
                <div className="me-3">
                  {t('SpaceframeSelectionPage.variant')}
                </div>
                <DropDownSelect
                  defaultValue={starship.spaceframeStep.variant}
                  onChange={(v) => onSelection(f, v as SpaceframeVariant)}
                  items={variantOptions(f.id)}
                />
              </div>
            </td>
            <td></td>
          </tr>
        ) : undefined}
      </tbody>
    );
  });

  return (
    <div>
      {spaceframes?.length ? (
        <>
          {renderNotice()}
          {overrideCheckbox}
          <table className="selection-list w-100">
            <thead>
              <tr>
                <td></td>
                <td className="d-none d-md-table-cell text-center">
                  {t('Construct.other.stats')}
                </td>
                <td className="d-none d-md-table-cell text-center">
                  {t('Construct.other.scale')}
                </td>
                <td className="d-none d-md-table-cell">
                  {t('Construct.other.talents')}
                </td>
                <td></td>
              </tr>
            </thead>
            {frames}
          </table>
        </>
      ) : (
        <Alert variant="dark" className="bg-dark text-white border-dark p-3">
          {t('SpaceframeSelectionPage.noFrames')}
        </Alert>
      )}
    </div>
  );
};
