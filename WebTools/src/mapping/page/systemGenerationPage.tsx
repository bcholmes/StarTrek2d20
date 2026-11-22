import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { SystemGenerationTable } from '../table/systemGenerator';
import { SpecialSectors, SpecialSectorTypeModel } from '../table/star';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { Link, useNavigate } from 'react-router';
import { hasSource } from '../../state/contextFunctions';
import { Source } from '../../helpers/sources';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/header';
import { STAMarkdown } from '../../components/staMarkdown';
import { SpaceRegion, SpaceRegionModel } from '../spaceRegion';
import { store } from '../../state/store';
import { setSector, setStarSystem } from '../../state/starActions';
import { Sector } from '../table/sector';
import { WorldClass, worldClasses, WorldClassModel } from '../table/worldClass';
import { GenerationSettings } from '../generationSettings';
import { SpectralClass, SpectralClassRegistry } from '../table/spectralClass';
import { spellCheck$ } from '@mdxeditor/editor';

enum GenerationType {
  Sector,
  System,
}

export const SystemGenerationPage = () => {
  const [region, setRegion] = useState(SpaceRegionModel.allRegions()[0].id);
  const [sectorType, setSectorType] = useState(SpecialSectors.GeneralExpanse);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState<GenerationType>(GenerationType.Sector);
  const [spectralClass, setSpectralClass] = useState<
    SpectralClass | undefined
  >();
  const [worldClass, setWorldClass] = useState<WorldClass | undefined>();

  const renderSectorTypeSection = () => {
    if (region === SpaceRegion.ShackletonExpanse) {
      const options = SpecialSectorTypeModel.allSpecialSectorTypes().map(
        (s) => new DropDownElement(s.id, s.name),
      );
      return (
        <div className="page-text mt-3">
          <DropDownSelect
            onChange={(e) => selectSectorType(e as SpecialSectors)}
            defaultValue={sectorType}
            items={options}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const generateSystemOrSector = () => {
    if (type === GenerationType.Sector) {
      generateSector();
    } else {
      generateSystem();
    }
  };

  const selectSectorType = (sectorType: SpecialSectors) => {
    setSectorType(sectorType);
  };

  const selectRegion = (region: SpaceRegion) => {
    setRegion(region);
  };

  const regionOptions = () => {
    return SpaceRegionModel.allRegions()
      .filter(
        (r) =>
          r.id !== SpaceRegion.ShackletonExpanse ||
          hasSource(Source.ShackletonExpanse),
      )
      .map((r) => {
        return new DropDownElement(r.id, r.localizedName);
      });
  };

  const spectralClassOptions = () => {
    return [
      new DropDownElement('', t('SystemGenerationPage.star.any')),
      new DropDownElement(
        SpectralClass.B,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.B)?.description,
      ),
      new DropDownElement(
        SpectralClass.A,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.A)?.description,
      ),
      new DropDownElement(
        SpectralClass.F,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.F)?.description,
      ),
      new DropDownElement(
        SpectralClass.G,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.G)?.description,
      ),
      new DropDownElement(
        SpectralClass.K,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.K)?.description,
      ),
      new DropDownElement(
        SpectralClass.M,
        SpectralClassRegistry.findBySpectralClass(SpectralClass.M)?.description,
      ),
    ];
  };

  const worldClassOptions = () => {
    return [
      new DropDownElement(
        '',
        t('SystemGenerationPage.worldClassification.any'),
      ),
      new DropDownElement(
        WorldClass.M,
        worldClasses[WorldClass.M].fullDescription,
      ),
      new DropDownElement(
        WorldClass.K,
        worldClasses[WorldClass.K].fullDescription,
      ),
      new DropDownElement(
        WorldClass.L,
        worldClasses[WorldClass.L].fullDescription,
      ),
      new DropDownElement(
        WorldClass.E,
        worldClasses[WorldClass.E].fullDescription,
      ),
      new DropDownElement(
        WorldClass.O,
        worldClasses[WorldClass.O].fullDescription,
      ),
      new DropDownElement(
        WorldClass.P,
        worldClasses[WorldClass.P].fullDescription,
      ),
    ];
  };

  const generateSector = () => {
    SystemGenerationTable.generateSector(
      SpaceRegionModel.for(region),
      region === SpaceRegion.ShackletonExpanse ? sectorType : undefined,
    );
    navigate('/tools/sector/details');
  };

  const generateSystem = () => {
    const spaceRegion = SpaceRegionModel.for(region);
    const settings = new GenerationSettings(
      spaceRegion,
      region === SpaceRegion.ShackletonExpanse ? sectorType : undefined,
    );
    settings.ecosphereWorldClass = worldClass;
    settings.spectralClass = spectralClass;
    const system = SystemGenerationTable.generateStarSystem(settings);
    system.id = SystemGenerationTable.generateStarSystemId(
      Math.floor(Math.random() * 10000),
    );
    system.rootName = Sector.randomId(spaceRegion.prefix);
    store.dispatch(setSector(null));
    store.dispatch(setStarSystem(system));
    navigate('/tools/sector/starSystem');
  };

  return (
    <LcarsFrame activePage={PageIdentity.SystemGeneration}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/tools">{t('Page.title.otherTools')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.systemGeneration')}
              </li>
            </ol>
          </nav>

          <main>
            <Header className="mt-4">{t('Page.title.systemGeneration')}</Header>

            <div className="my-4">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio1"
                  autoComplete="off"
                  checked={type === GenerationType.Sector}
                  onChange={(e) => setType(GenerationType.Sector)}
                />
                <label
                  className="btn btn-sm btn-outline-info"
                  htmlFor="btnradio1"
                >
                  {t('SystemGenerationPage.type.sector')}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio3"
                  autoComplete="off"
                  checked={type === GenerationType.System}
                  onChange={(e) => setType(GenerationType.System)}
                />
                <label
                  className="btn btn-sm btn-outline-info"
                  htmlFor="btnradio3"
                >
                  {t('SystemGenerationPage.type.system')}
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mt-3">
                <Header level={2}>{t('SystemGenerationPage.region')}</Header>

                <STAMarkdown>
                  {t('SystemGenerationPage.selectQuadrant')}
                </STAMarkdown>
                <div className="page-text">
                  <DropDownSelect
                    onChange={(e) => selectRegion(e as SpaceRegion)}
                    defaultValue={region}
                    items={regionOptions()}
                  />
                </div>
                {renderSectorTypeSection()}
              </div>
            </div>
            {type === GenerationType.System ? (
              <div className="row">
                <div className="col-12 col-md-6 mt-3">
                  <Header level={2}>{t('SystemGenerationPage.star')}</Header>

                  <STAMarkdown>
                    {t('SystemGenerationPage.star.instruction')}
                  </STAMarkdown>
                  <DropDownSelect
                    onChange={(e) =>
                      setSpectralClass(
                        e === '' ? undefined : (e as SpectralClass),
                      )
                    }
                    defaultValue={spectralClass}
                    items={spectralClassOptions()}
                  />
                </div>
                <div className="col-12 col-md-6 mt-3">
                  <Header level={2}>
                    {t('SystemGenerationPage.worldClassification')}
                  </Header>

                  <STAMarkdown>
                    {t('SystemGenerationPage.worldClassification.instruction')}
                  </STAMarkdown>
                  <DropDownSelect
                    onChange={(e) =>
                      setWorldClass(e === '' ? undefined : (e as WorldClass))
                    }
                    defaultValue={worldClass}
                    items={worldClassOptions()}
                  />
                </div>
              </div>
            ) : undefined}
            <div className="mt-5 text-end">
              <Button onClick={generateSystemOrSector}>
                {t(
                  type === GenerationType.Sector
                    ? 'SystemGenerationPage.generateSector'
                    : 'SystemGenerationPage.generateSystem',
                )}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </LcarsFrame>
  );
};
