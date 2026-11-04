import type { Career } from './careerEnum';
import type { Department } from './department';
import type { Species } from './speciesEnum';
import type { TalentCategory } from './talentCategory';
import type { TalentModel } from './talentModel';

// Filters talents by the categorization on each talent model: a category,
// optionally narrowed to one department, species or career within it. An
// empty filter matches every talent. Shared by the Talents Overview page and
// the talent selection lists.
export interface TalentFilter {
  category?: TalentCategory;
  type?: Department | Species | Career;
}

export const ALL_TALENTS: TalentFilter = {};

export function matchesTalentFilter(
  talent: TalentModel,
  filter: TalentFilter,
): boolean {
  if (filter.category == null) return true;
  if (talent.category?.category !== filter.category) return false;
  return filter.type == null || talent.category.includes(filter.type);
}

export function isSameTalentFilter(a: TalentFilter, b: TalentFilter) {
  return a.category === b.category && a.type === b.type;
}
