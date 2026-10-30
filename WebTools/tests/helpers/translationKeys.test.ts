import fs from 'fs';
import path from 'path';

// Catches t('Some.key') calls whose key has no English text, which would show
// the raw key to users. Keys built by concatenation (ending in '.') are skipped.
const root = path.join(__dirname, '../../src');
const translations: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(root, 'i18n/locales/en/translations.json'), 'utf8'),
);

// Missing in upstream before this branch; tracked separately.
const knownMissing = new Set([
  'Construct.other.departmnet',
  'SoloCareerLengthDetailsPage.errorValue',
  'SoloEducationDetailsPage.errorValue',
  'StationMissionProfile.error.selectTalent',
]);

const hasKey = (key: string) =>
  key in translations ||
  `${key}_one` in translations ||
  `${key}_other` in translations;

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

test('every literal translation key used in src has English text', () => {
  const missing = new Set<string>();
  for (const file of sourceFiles(root)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\bt\(\s*'([A-Za-z0-9_.]+)'/g)) {
      const key = match[1];
      if (key.endsWith('.') || knownMissing.has(key) || hasKey(key)) continue;
      missing.add(`${key} (${path.relative(root, file)})`);
    }
  }
  expect([...missing]).toEqual([]);
});
