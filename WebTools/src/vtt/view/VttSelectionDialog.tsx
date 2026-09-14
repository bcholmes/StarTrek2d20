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
}

export const VttSelectionModal: React.FC<IVttSelectionModalProperties> = ({
  construct,
}) => {
  const [vttType, setVttType] = useState<VttType>(VttType.Foundry);
  const [foundryPluginType, setFoundryPluginType] = useState<FoundryPluginType>(
    FoundryPluginType.Standard,
  );

  useEffect(() => {
    const dataJson = window.localStorage.getItem('settings.vttOptions');
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
    };
    persistVtt(newState);
    if (vttType !== t) {
      setVttType(t);
    }
    return newState;
  };

  const exportConstruct = () => {
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
      data['foundryPlugin'] = FoundryPluginType[state.foundryPluginType];
    }
    window.localStorage.setItem('settings.vttOptions', JSON.stringify(data));
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
          disabled={isExportDisabled()}
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
