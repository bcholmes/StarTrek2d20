import React, { useEffect, useState } from 'react';
import { Character } from '../../common/character';
import type { Construct } from '../../common/construct';
import { Starship } from '../../common/starship';
import Button from 'react-bootstrap/Button';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { ModalControl } from '../../components/modal';
import { FoundryVttExporter } from '../foundryVttExporter';
import { VttType, VttTypes } from '../vttType';
import { FantasyGroundsVttExporter } from '../fantasyGroundsVttExport';
import { Roll20VttExporter } from '../roll20VttExporter';
import { FoundryPluginType } from '../foundryPluginType';
import { Station } from '../../common/station';
import { MapToolVttExporter } from '../mapToolVttExporter';
import {
  MAPTOOL_FRAMEWORK_NAMES,
  MapToolFrameworkType,
  mapToolExportOptions,
  mapToolFrameworkByName,
} from '../mapToolFrameworkType';

declare function download(
  bytes: Uint8Array | ArrayBuffer,
  fileName: string,
  contentType: string,
): void;

interface IVttSelectionModalProperties {
  construct: Construct;
}

interface IVttSelectionState {
  vttType: VttType;
  foundryPluginType?: FoundryPluginType;
  mapToolFramework?: MapToolFrameworkType;
  mapToolCharacterType?: string;
  mapToolStarshipType?: string;
}

const VTT_OPTIONS_STORAGE_KEY = 'settings.vttOptions';

export const VttSelectionModal: React.FC<IVttSelectionModalProperties> = ({
  construct,
}) => {
  const [vttType, setVttType] = useState<VttType>(VttType.Foundry);
  const [foundryPluginType, setFoundryPluginType] = useState<FoundryPluginType>(
    FoundryPluginType.Standard,
  );
  const [mapToolFramework, setMapToolFramework] =
    useState<MapToolFrameworkType>(MapToolFrameworkType.FreemanSta2e);
  const [mapToolCharacterType, setMapToolCharacterType] =
    useState<string>('Basic');
  const [mapToolStarshipType, setMapToolStarshipType] =
    useState<string>('Basic');
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    const dataJson = window.localStorage.getItem(VTT_OPTIONS_STORAGE_KEY);
    let data = {};
    try {
      data = dataJson ? JSON.parse(dataJson) : {};
    } catch (e) {
      // ignore
    }

    const type = VttTypes.instance.getTypeByTypeName(data['vttType'])?.type;
    if (type != null) {
      setVttType(type);
    }
    const pluginType = data['foundryPluginType'] ?? FoundryPluginType.Standard;
    setFoundryPluginType(pluginType);
    setMapToolFramework(mapToolFrameworkByName(data['mapToolFramework']));
    setMapToolCharacterType(data['mapToolCharacterType'] || 'Basic');
    setMapToolStarshipType(data['mapToolStarshipType'] || 'Basic');
  }, []);

  const getFoundryPluginOptions = () => {
    return [
      new DropDownElement(
        FoundryPluginType.Standard,
        'Star Trek Adventure 2d20 1e&2e plugin',
      ),
      new DropDownElement(FoundryPluginType.ELH, "ELH's STA 2e plugin"),
    ];
  };

  const renderVttSpecificSettings = () => {
    if (vttType === VttType.Roll20) {
      return (
        <div className="mt-4">
          <p>
            Roll20 doesn't have a standard way to import characters into STA
            games. This exporter was designed to work with a browser plugin
            called the{' '}
            <a
              href="https://justas-d.github.io/roll20-enhancement-suite/index.html"
              target="_blank"
              rel="noreferrer"
            >
              VTT Enhancement Suite
            </a>
            .
          </p>
        </div>
      );
    } else if (vttType === VttType.Foundry) {
      return (
        <div className="mt-4">
          <p>
            Which version of the Star Trek Adventures Game System do you use?
          </p>
          <DropDownSelect
            defaultValue={foundryPluginType}
            items={getFoundryPluginOptions()}
            onChange={(val) => {
              setFoundryPluginType(val as FoundryPluginType);
              selectVttType(vttType, val as FoundryPluginType);
            }}
          />
        </div>
      );
    } else if (vttType === VttType.MapTool) {
      const persistMapTool = (changes: Partial<IVttSelectionState>) =>
        persistVtt({
          vttType,
          foundryPluginType,
          mapToolFramework,
          mapToolCharacterType,
          mapToolStarshipType,
          ...changes,
        });
      return (
        <div className="mt-4">
          <p>
            Exports a token file (.rptok). Drag it onto a map in MapTool. Every
            stat is a token property, lists such as talents and weapons are JSON
            properties (talents include their full text), and the token's notes
            hold a readable sheet. Characters made in the Token Creator use that
            portrait.
          </p>
          <p>Which MapTool framework do you use?</p>
          <DropDownSelect
            defaultValue={mapToolFramework}
            items={[
              MapToolFrameworkType.FreemanSta2e,
              MapToolFrameworkType.Custom,
            ].map((f) => new DropDownElement(f, MAPTOOL_FRAMEWORK_NAMES[f]))}
            onChange={(val) => {
              setMapToolFramework(val as MapToolFrameworkType);
              persistMapTool({ mapToolFramework: val as MapToolFrameworkType });
            }}
          />
          {mapToolFramework === MapToolFrameworkType.FreemanSta2e ? (
            <p className="mt-3">
              Characters use the <strong>STA2e Character</strong> token type and
              starships use <strong>STA2e Ship</strong>. The framework sets the
              token up the first time it loads it.
            </p>
          ) : (
            <>
              <p className="mt-3">
                Type the token types from your campaign (Campaign Properties,
                Token Properties). <strong>Basic</strong> works in any campaign.
              </p>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="w-100">
                    Characters
                    <input
                      type="text"
                      className="form-control text-dark"
                      value={mapToolCharacterType}
                      onChange={(e) => {
                        setMapToolCharacterType(e.target.value);
                        persistMapTool({
                          mapToolCharacterType: e.target.value,
                        });
                      }}
                    />
                  </label>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="w-100">
                    Starships
                    <input
                      type="text"
                      className="form-control text-dark"
                      value={mapToolStarshipType}
                      onChange={(e) => {
                        setMapToolStarshipType(e.target.value);
                        persistMapTool({ mapToolStarshipType: e.target.value });
                      }}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      );
    } else {
      return undefined;
    }
  };

  const selectVttType = (t: VttType, p?: FoundryPluginType) => {
    if (p == null) {
      p = foundryPluginType;
    }
    const newState = {
      vttType: t,
      foundryPluginType: p,
      mapToolFramework,
      mapToolCharacterType,
      mapToolStarshipType,
    };
    persistVtt(newState);
    if (vttType !== t) {
      setVttType(t);
    }
    return newState;
  };

  const exportConstruct = () => {
    if (vttType === VttType.MapTool) {
      exportToMapTool();
      return;
    }
    if (construct instanceof Character) {
      if (vttType === VttType.Foundry) {
        exportCharacterToFoundryVtt(construct as Character);
      } else if (vttType === VttType.FantasyGrounds) {
        exportCharacterToFantasyGrounds(construct as Character);
      } else if (vttType === VttType.Roll20) {
        exportCharacterToRoll20(construct as Character);
      }
    }
    if (construct instanceof Starship) {
      if (vttType === VttType.Foundry) {
        exportStarshipToFoundryVtt(construct as Starship);
      } else if (vttType === VttType.Roll20) {
        exportStarshipToRoll20(construct as Starship);
      }
    }
    if (construct instanceof Station) {
      if (vttType === VttType.Foundry) {
        exportStationToFoundryVtt(construct as Station);
      }
    }
    VttSelectionDialog.instance.hide();
  };

  const exportCharacterToFoundryVtt = (character: Character) => {
    const json = FoundryVttExporter.instance.exportCharacter(
      character,
      foundryPluginType,
    );
    const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

    const escaped = sanitizeName(character.name, 'sta-character');
    download(jsonBytes, escaped + '-foundry-vtt.json', 'application/json');
  };

  const exportCharacterToRoll20 = (character: Character) => {
    const json = Roll20VttExporter.instance.exportCharacter(character);
    const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

    const escaped = sanitizeName(character.name, 'sta-character');
    download(jsonBytes, escaped + '-roll20-vtt.json', 'application/json');
  };

  const exportStarshipToRoll20 = (starship: Starship) => {
    const json = Roll20VttExporter.instance.exportStarship(starship);
    const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

    const escaped = sanitizeName(starship.name, 'sta-starship');
    download(jsonBytes, escaped + '-roll20-vtt.json', 'application/json');
  };

  const exportCharacterToFantasyGrounds = (character: Character) => {
    const xml = FantasyGroundsVttExporter.instance.exportCharacter(character);
    const escaped = sanitizeName(character.name, 'sta-character');
    download(
      new TextEncoder().encode(xml),
      escaped + '-fantasy-grounds.xml',
      'application/xml',
    );
  };

  const exportStarshipToFoundryVtt = (starship: Starship) => {
    const json = FoundryVttExporter.instance.exportStarship(
      starship,
      foundryPluginType,
    );
    const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

    const escaped = sanitizeName(starship.name, 'sta-starship');
    download(jsonBytes, escaped + '-foundry-vtt.json', 'application/json');
  };

  const exportStationToFoundryVtt = (station: Station) => {
    const json = FoundryVttExporter.instance.exportStation(
      station,
      foundryPluginType,
    );
    const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

    const escaped = sanitizeName(station.name, 'sta-station');
    download(jsonBytes, escaped + '-foundry-vtt.json', 'application/json');
  };

  const exportToMapTool = async () => {
    setBusy(true);
    try {
      const { renderCharacterTokenImage, renderStarshipTokenImage } =
        await import('../mapToolTokenImage');
      const options = mapToolExportOptions(
        mapToolFramework,
        mapToolCharacterType,
        mapToolStarshipType,
      );
      let bytes: Uint8Array;
      let fileName: string;
      if (construct instanceof Starship) {
        const data = MapToolVttExporter.instance.exportStarship(
          construct,
          options,
        );
        bytes = MapToolVttExporter.instance.packageToken(
          data,
          await renderStarshipTokenImage(construct),
        );
        fileName = sanitizeName(construct.name, 'sta-starship');
      } else if (construct instanceof Character) {
        const data = MapToolVttExporter.instance.exportCharacter(
          construct,
          options,
        );
        bytes = MapToolVttExporter.instance.packageToken(
          data,
          await renderCharacterTokenImage(construct),
        );
        fileName = sanitizeName(construct.name, 'sta-character');
      } else {
        return;
      }
      download(bytes, fileName + '.rptok', 'application/zip');
    } finally {
      setBusy(false);
    }
  };

  const sanitizeName = (name: string, defaultName: string) => {
    return (
      name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') ||
      defaultName
    );
  };

  const persistVtt = (state: IVttSelectionState) => {
    const data = {
      vttType: VttType[state.vttType],
    };
    if (state.foundryPluginType != null) {
      data['foundryPluginType'] = FoundryPluginType[state.foundryPluginType];
    }
    if (state.mapToolFramework != null) {
      data['mapToolFramework'] = MapToolFrameworkType[state.mapToolFramework];
    }
    if (state.mapToolCharacterType != null) {
      data['mapToolCharacterType'] = state.mapToolCharacterType;
    }
    if (state.mapToolStarshipType != null) {
      data['mapToolStarshipType'] = state.mapToolStarshipType;
    }
    window.localStorage.setItem(VTT_OPTIONS_STORAGE_KEY, JSON.stringify(data));
  };

  const isExportDisabled = () => {
    return (
      (vttType === VttType.FantasyGrounds &&
        !(construct instanceof Character)) ||
      (vttType !== VttType.Foundry && construct instanceof Station) ||
      (foundryPluginType !== FoundryPluginType.Standard &&
        construct instanceof Station)
    );
  };

  return (
    <div>
      <p>Select the Virtual Table Top implementation that you use.</p>
      <p>
        Don't see the one you like? With luck, more will be added over time.
      </p>

      <DropDownSelect
        defaultValue={vttType}
        items={VttTypes.instance
          .getTypes()
          .map((t) => new DropDownElement(t.type, t.name))}
        onChange={(t) => selectVttType(t as number)}
      />

      {renderVttSpecificSettings()}

      <div className="mt-5 text-center">
        <Button
          size="sm"
          onClick={() => exportConstruct()}
          disabled={busy || isExportDisabled()}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export class VttSelectionDialog {
  private static singleton: VttSelectionDialog;

  static get instance() {
    if (VttSelectionDialog.singleton == null) {
      VttSelectionDialog.singleton = new VttSelectionDialog();
    }
    return VttSelectionDialog.singleton;
  }

  show(construct: Construct) {
    ModalControl.show(
      'lg',
      () => {},
      React.createElement(VttSelectionModal, {
        construct: construct,
      }),
      'Virtual Table Top',
    );
  }

  hide() {
    ModalControl.hide();
  }
}
