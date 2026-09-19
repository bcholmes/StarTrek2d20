import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { navigateTo } from '../../common/navigator';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { Header } from '../../components/header';
import { InstructionText } from '../../components/instructionText';
import { Era } from '../../helpers/erasEnum';
import { marshaller } from '../../helpers/marshaller';
import { SpeciesHelper } from '../../helpers/species';
import { Species } from '../../helpers/speciesEnum';
import { PageIdentity } from '../../pages/pageIdentity';
import type { NpcCharacterTypeModel } from '../model/npcCharacterType';
import { NpcCharacterType, NpcCharacterTypes } from '../model/npcCharacterType';
import { NpcGenerator } from '../model/npcGenerator';
import { NpcType, NpcTypes } from '../model/npcType';
import type { SpecializationModel } from '../model/specializations';
import { Specializations } from '../model/specializations';
import { hasAnySource, hasSource } from '../../state/contextFunctions';
import { Source } from '../../helpers/sources';
import { Specialization } from '../../common/specializationEnum';
import { LoadingButton } from '../../common/loadingButton';
import { CheckBox } from '../../components/checkBox';

interface INpcConfigurationPageProperties {
  era: Era;
}

const NpcConfigurationPageBase: React.FC<INpcConfigurationPageProperties> = ({
  era,
}) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<NpcCharacterTypeModel>(
    NpcCharacterTypes.instance.types[0],
  );
  const [selectedNpcType, setSelectedNpcType] = useState<NpcType>(
    NpcType.Notable,
  );
  const [selectedSpecies, setSelectedSpecies] = useState<Species>();
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<SpecializationModel>();
  const [loading, setLoading] = useState<boolean>(false);
  const [includeDescription, setIncludeDescription] = useState<boolean>(true);

  useEffect(() => {
    const value = window.localStorage.getItem('settings.ai');
    setIncludeDescription(value !== 'false');
  }, []);

  const updateIncludeDescription = (value: boolean) => {
    setIncludeDescription(value);
    window.localStorage.setItem('settings.ai', value ? 'true' : 'false');
  };

  const getSpecializations = () => {
    const result = [
      new DropDownElement(
        null,
        t('NpcConfigurationPage.option.anySpecialization'),
      ),
    ];
    Specializations.instance
      .getSpecializations(selectedType.type)
      .filter(
        (s) =>
          (s.type !== NpcCharacterType.Ferengi || era === Era.NextGeneration) &&
          hasAnySource([Source.DS9, Source.AlphaQuadrant]),
      )
      .filter(
        (s) =>
          s.id !== Specialization.TzenkethiSoldier ||
          hasAnySource([Source.AlphaQuadrant]),
      )
      .filter(
        (s) =>
          s.id !== Specialization.TholianWarrior ||
          hasAnySource([Source.IdwYearFive]),
      )
      .filter(
        (s) =>
          selectedSpecies == null ||
          s.species.length === 0 ||
          s.species.indexOf(selectedSpecies) >= 0,
      )
      .forEach((s) => result.push(new DropDownElement(s.id, s.localizedName)));
    return result;
  };

  const getStandardFederationSpeciesList = () => {
    const list = [
      Species.Andorian,
      Species.Bajoran,
      Species.Betazoid,
      Species.Bolian,
      Species.Denobulan,
      Species.Human,
      Species.Tellarite,
      Species.Trill,
      Species.Vulcan,
    ];
    return list
      .map((s) => SpeciesHelper.getSpeciesByType(s))
      .filter((s) => s.eras.includes(era));
  };

  const getStandardFederationSpeciesListAsTypes = () => {
    return getStandardFederationSpeciesList().map((s) => s.id);
  };

  const getSpeciesList = () => {
    if (
      selectedSpecialization != null &&
      selectedSpecialization?.species?.length
    ) {
      return selectedSpecialization.species
        .map((s) => SpeciesHelper.getSpeciesByType(s))
        .filter((s) => s.eras.includes(era));
    } else if (
      selectedType?.type === NpcCharacterType.RogueRuffianMercenary ||
      selectedType?.type === NpcCharacterType.MinorPolity
    ) {
      const items = [];
      Specializations.instance
        .getSpecializations(selectedType?.type)
        .forEach((s) => {
          if (
            selectedSpecialization == null ||
            selectedSpecialization?.id === s.id
          ) {
            const speciesList = s.species?.length
              ? s.species
              : getStandardFederationSpeciesListAsTypes();
            speciesList.forEach((s) => {
              if (items.indexOf(s) < 0) {
                items.push(s);
              }
            });
          }
        });
      return items
        .map((s) => SpeciesHelper.getSpeciesByType(s))
        .filter((s) => s.eras.includes(era));
    } else if (selectedType?.type === NpcCharacterType.KlingonDefenseForces) {
      const list =
        era === Era.NextGeneration
          ? [Species.Klingon]
          : hasSource(Source.SpeciesSourcebook)
            ? [Species.Klingon, Species.KlingonQuchHa_2E]
            : [Species.Klingon, Species.KlingonQuchHa];
      return list.map((s) => SpeciesHelper.getSpeciesByType(s));
    } else if (selectedType?.type === NpcCharacterType.Cardassian) {
      return [SpeciesHelper.getSpeciesByType(Species.Cardassian)];
    } else if (selectedType?.type === NpcCharacterType.Ferengi) {
      return [SpeciesHelper.getSpeciesByType(Species.Ferengi)];
    } else if (selectedType?.type === NpcCharacterType.Borg) {
      return [SpeciesHelper.getSpeciesByType(Species.Borg)];
    } else if (selectedType?.type === NpcCharacterType.RomulanEmpire) {
      return [
        SpeciesHelper.getSpeciesByType(Species.Romulan),
        SpeciesHelper.getSpeciesByType(Species.Reman),
      ];
    } else {
      return getStandardFederationSpeciesList();
    }
  };

  const getSpeciesDropDownList = () => {
    const result = [
      new DropDownElement(
        null,
        t('NpcConfigurationPage.option.anyMajorSpecies'),
      ),
    ];
    getSpeciesList()
      .sort((s1, s2) => {
        return s1.localizedName.localeCompare(s2.localizedName);
      })
      .forEach((s) => result.push(new DropDownElement(s.id, s.localizedName)));
    return result;
  };

  const selectSpecialization = (type: Specialization | string) => {
    if (type == null || type === '') {
      setSelectedSpecialization(undefined);
    } else {
      setSelectedSpecialization(
        Specializations.instance.getSpecialization(type as Specialization),
      );
    }
  };

  const selectType = (type: NpcCharacterTypeModel) => {
    setSelectedType(type);
    setSelectedSpecies(null);
    setSelectedSpecialization(null);
  };

  const selectSpecies = (species: Species | string | null) => {
    if (species == null || species === '') {
      setSelectedSpecies(undefined);
    } else {
      setSelectedSpecies(species as Species);
    }
  };

  const randomSpecies = () => {
    if (
      selectedType.type === NpcCharacterType.KlingonDefenseForces ||
      selectedType.type === NpcCharacterType.Cardassian ||
      selectedType.type === NpcCharacterType.Ferengi ||
      selectedType.type === NpcCharacterType.MinorPolity ||
      selectedType.type === NpcCharacterType.RomulanEmpire
    ) {
      const list = getSpeciesList();
      return list[Math.floor(Math.random() * list.length)].id;
    } else {
      return SpeciesHelper.generateSpecies();
    }
  };

  const createNpc = () => {
    setLoading(true);
    let specialization = selectedSpecialization;
    if (specialization == null) {
      const specializations = Specializations.instance.getSpecializations(
        selectedType.type,
      );
      specialization =
        specializations[Math.floor(Math.random() * specializations.length)];
    }
    let species = selectedSpecies;
    if (species == null && specialization.species?.length) {
      const list = specialization.species
        .map((s) => SpeciesHelper.getSpeciesByType(s))
        .filter((s) => s.eras.includes(era));
      species = list[Math.floor(Math.random() * list.length)].id;
    } else if (species == null) {
      species = randomSpecies();
    }
    NpcGenerator.createNpc(
      selectedNpcType,
      selectedType.type,
      SpeciesHelper.getSpeciesByType(species),
      specialization,
      era,
      includeDescription,
    ).then((character) => {
      const value = marshaller.encodeNpc(character);
      window.open('/view?s=' + value, '_blank');
      setLoading(false);
    });
  };

  return (
    <div className="page">
      <div className="container ms-0">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href="/index.html"
                onClick={(e) => navigateTo(e, PageIdentity.Home)}
              >
                {t('Page.title.home')}
              </a>
            </li>
            <li className="breadcrumb-item">
              <a
                href="/index.html"
                onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}
              >
                {t('Page.title.sourceSelection')}
              </a>
            </li>
            <li className="breadcrumb-item">
              <a
                href="/index.html"
                onClick={(e) => navigateTo(e, PageIdentity.Era)}
              >
                {t('Page.title.era')}
              </a>
            </li>
            <li className="breadcrumb-item">
              <a
                href="/index.html"
                onClick={(e) => navigateTo(e, PageIdentity.ToolSelection)}
              >
                {t('Page.title.toolSelection')}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t('Page.title.npcConfiguration')}
            </li>
          </ol>
        </nav>

        <Header>{t('Page.title.npcConfiguration')}</Header>

        <div className="my-4">
          <InstructionText text={t('NpcConfigurationPage.text')} />
        </div>

        <div className="row">
          <div className="col-md-6 mt-4">
            <Header level={2}>{t('NpcConfigurationPage.npcType')}</Header>

            <div className="my-4">
              <DropDownSelect
                items={NpcTypes.getNpcTypes().map(
                  (t) => new DropDownElement(t.type, t.localizedName),
                )}
                defaultValue={selectedNpcType}
                onChange={(type) => setSelectedNpcType(type as number)}
              />
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <Header level={2}>{t('Construct.other.characterType')}</Header>

            <div className="my-4">
              <DropDownSelect
                items={NpcCharacterTypes.instance.types.map(
                  (t) => new DropDownElement(t.type, t.localizedName),
                )}
                defaultValue={selectedType?.type ?? ''}
                onChange={(type) =>
                  selectType(
                    NpcCharacterTypes.instance.getType(
                      type as NpcCharacterType,
                    ),
                  )
                }
              />
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <Header level={2} className="mt-5">
              {t('Construct.other.species')}
            </Header>

            <div className="mt-4">
              <DropDownSelect
                items={getSpeciesDropDownList()}
                defaultValue={selectedSpecies ?? ''}
                onChange={(species) => selectSpecies(species)}
              />
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <Header level={2} className="mt-5">
              {t('NpcConfigurationPage.specialization')}
            </Header>

            <div className="mt-4">
              <DropDownSelect
                items={getSpecializations()}
                defaultValue={selectedSpecialization?.id ?? ''}
                onChange={(specialization) =>
                  selectSpecialization(specialization)
                }
              />
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <Header level={2} className="mt-5">
              {t('Construct.other.description')}
            </Header>

            <div className="mt-4">
              <CheckBox
                disabled={selectedNpcType === NpcType.Minor}
                isChecked={includeDescription}
                value={'includeDescription'}
                text={t('NpcConfigurationPage.includeDescription')}
                onChanged={() => updateIncludeDescription(!includeDescription)}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 text-end">
          <LoadingButton
            loading={loading}
            enabled={!loading}
            size="sm"
            onClick={() => createNpc()}
          >
            {t('Common.button.create')}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    era: state.context.era,
  };
}

export const NpcConfigurationPage = connect(mapStateToProps)(
  NpcConfigurationPageBase,
);
