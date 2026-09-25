import type { MapToolExportOptions } from './mapToolVttExporter';

// MapTool frameworks the export can target. A framework decides which campaign
// token types (Campaign Properties > Token Properties) the tokens use.
export enum MapToolFrameworkType {
  FreemanSta2e,
  Custom,
}

export const MAPTOOL_FRAMEWORK_NAMES: Record<MapToolFrameworkType, string> = {
  [MapToolFrameworkType.FreemanSta2e]: "Freeman's STA2E Framework",
  [MapToolFrameworkType.Custom]: 'Custom (type in the token types)',
};

const PRESETS: Partial<
  Record<MapToolFrameworkType, Required<MapToolExportOptions>>
> = {
  [MapToolFrameworkType.FreemanSta2e]: {
    characterPropertyType: 'STA2e Character',
    starshipPropertyType: 'STA2e Ship',
  },
};

export function mapToolFrameworkByName(
  name: string | undefined,
): MapToolFrameworkType {
  const value = MapToolFrameworkType[name as keyof typeof MapToolFrameworkType];
  return value ?? MapToolFrameworkType.FreemanSta2e;
}

export function mapToolExportOptions(
  framework: MapToolFrameworkType,
  customCharacterType: string,
  customStarshipType: string,
): MapToolExportOptions {
  return (
    PRESETS[framework] ?? {
      characterPropertyType: customCharacterType?.trim() || 'Basic',
      starshipPropertyType: customStarshipType?.trim() || 'Basic',
    }
  );
}
