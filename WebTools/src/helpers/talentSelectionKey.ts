import type { TalentModel } from './talentModel';

// Some species talents share a name with a department talent. Keep their row
// identities separate, and stable when the visible list is filtered or sorted.
export function talentSelectionKey(talent: TalentModel) {
  return JSON.stringify([
    talent.name,
    talent.category.category,
    talent.category.type,
    talent.sources,
  ]);
}
