import React, { useState } from 'react';
import { DropDownElement, DropDownSelect } from '../components/dropDownInput';
import { Department } from '../helpers/department';
import type { TalentModel } from '../helpers/talentModel';
import { TalentsHelper } from '../helpers/talents';
import { Source, SourcesHelper } from '../helpers/sources';
import { SpeciesHelper } from '../helpers/species';
import { replaceDiceWithArrowhead } from '../common/arrowhead';
import type { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { hasSource } from '../state/contextFunctions';
import Markdown from 'react-markdown';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import { Button } from 'react-bootstrap';
import { TalentCategory } from '../helpers/talentCategory';
import {
  matchesTalentFilter,
  type TalentFilter,
} from '../helpers/talentFilter';

enum TalentVersion {
  FirstEdition,
  SecondEdition,
  Both,
}

class TalentViewModel {
  name: string;
  talent: TalentModel;
  prerequisites: string;
  localizedName: string;

  constructor(
    name: string,
    localizedName: string,
    prerequisites: string,
    talent: TalentModel,
  ) {
    this.name = name;
    this.prerequisites = prerequisites;
    this.localizedName = localizedName;
    this.talent = talent;
  }

  get aliases() {
    return this.talent.aliases;
  }

  get source() {
    return SourcesHelper.getSourceName(
      TalentsHelper.getSourceForTalentModel(this.talent),
    );
  }

  matches(term) {
    term = term.toLowerCase().replace('’', "'");
    return (
      this.name.toLowerCase().replace('’', "'").indexOf(term) >= 0 ||
      this.localizedName.toLowerCase().replace('’', "'").indexOf(term) >= 0 ||
      this.talent.localizedDescription
        .toLowerCase()
        .replace('’', "'")
        .indexOf(term) >= 0 ||
      this.talent.localizedDescription2e
        .toLowerCase()
        .replace('’', "'")
        .indexOf(term) >= 0 ||
      this.talent.localizedCategoryString.toLowerCase().indexOf(term) >= 0 ||
      this.matchesAlias(term)
    );
  }
  matchesAlias(term) {
    let result = false;
    for (let i = 0; i < this.aliases.length; i++) {
      const alias = this.aliases[i];
      result = alias.name.toLowerCase().replace('’', "'").indexOf(term) >= 0;
      if (result) {
        break;
      }
    }
    return result;
  }

  get version() {
    let first = false;
    let second = this.talent.is2eSupported;
    const sources = SourcesHelper.getSources();

    this.talent.sources.forEach((s) => {
      const source = sources.filter((src) => src.id === s)[0];
      if (source.version === 1) {
        first = true;
      } else if (source.version === 2) {
        second = true;
      }
    });
    if (first && second) {
      return TalentVersion.Both;
    } else if (second) {
      return TalentVersion.SecondEdition;
    } else {
      return TalentVersion.FirstEdition;
    }
  }

  static from(talent: TalentModel) {
    let prerequisites = '';
    talent.prerequisites.forEach((p) => {
      const desc = p.describe();
      if (desc) {
        if (prerequisites === '') {
          prerequisites = desc;
        } else {
          prerequisites += ', ' + desc;
        }
      }
    });

    return new TalentViewModel(
      talent.name,
      talent.localizedName,
      prerequisites,
      talent,
    );
  }
}

export const TalentsOverviewPage = () => {
  const allTalents: TalentViewModel[] = [];
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [version, setVersion] = useState<TalentVersion>(TalentVersion.Both);
  const [categoryType, setCategoryType] = useState<TalentCategory | undefined>(
    undefined,
  );
  const [department, setDepartment] = useState<Department | undefined>(
    undefined,
  );
  const [species, setSpecies] = useState<Species | undefined>(undefined);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const selectTalents = () => {
    const filter: TalentFilter = {
      category: categoryType,
      type:
        categoryType === TalentCategory.Department
          ? department
          : categoryType === TalentCategory.Species
            ? species
            : undefined,
    };
    const talents = [];
    for (let i = 0; i < allTalents.length; i++) {
      const talent = allTalents[i];
      if (search.length && !talent.matches(search)) {
        // don't include
      } else if (
        version === TalentVersion.FirstEdition &&
        talent.version === TalentVersion.SecondEdition
      ) {
        // don't include
      } else if (
        version === TalentVersion.SecondEdition &&
        talent.version === TalentVersion.FirstEdition
      ) {
        // don't include
      } else if (!matchesTalentFilter(talent.talent, filter)) {
        // don't include
      } else {
        talents.push(talent);
      }
    }

    return talents;
  };

  const getVersionElements = () => {
    return [
      new DropDownElement(TalentVersion.Both, 'Both 1e and 2e'),
      new DropDownElement(TalentVersion.FirstEdition, '1e'),
      new DropDownElement(TalentVersion.SecondEdition, '2e'),
    ];
  };

  const onVersionChanged = (v: TalentVersion) => {
    setVersion(v);
  };

  const onCategoryTypeChanged = (c?: TalentCategory) => {
    setCategoryType(c);
    if (c !== TalentCategory.Department) {
      setDepartment(undefined);
    }
    if (c !== TalentCategory.Species) {
      setSpecies(undefined);
    }
  };
  const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();

    navigate('/');
  };

  const searchChanged = (event) => {
    setSearch(event.target.value);
  };

  const getCategoryTypes = () => {
    return [
      new DropDownElement('', ''),
      new DropDownElement(TalentCategory.General, t('TalentCategory.general')),
      new DropDownElement(TalentCategory.Career, t('TalentCategory.career')),
      new DropDownElement(
        TalentCategory.Esoteric,
        t('TalentCategory.esoteric'),
      ),
      new DropDownElement(
        TalentCategory.Enhancement,
        t('TalentCategory.enhancement'),
      ),
      new DropDownElement(
        TalentCategory.Starship,
        t('TalentCategory.starship'),
      ),
      new DropDownElement(
        TalentCategory.Starbase,
        t('TalentCategory.starbase'),
      ),
      new DropDownElement(
        TalentCategory.Department,
        t('TalentCategory.department'),
      ),
      new DropDownElement(TalentCategory.Species, t('TalentCategory.species')),
    ];
  };

  const getDepartments = () => {
    return [
      new DropDownElement('', ''),
      new DropDownElement(
        Department.Command,
        t('Construct.discipline.command'),
      ),
      new DropDownElement(Department.Conn, t('Construct.discipline.conn')),
      new DropDownElement(
        Department.Engineering,
        t('Construct.discipline.engineering'),
      ),
      new DropDownElement(
        Department.Medicine,
        t('Construct.discipline.medicine'),
      ),
      new DropDownElement(
        Department.Science,
        t('Construct.discipline.science'),
      ),
      new DropDownElement(
        Department.Security,
        t('Construct.discipline.security'),
      ),
    ];
  };

  const getSpecies = () => {
    const speciesList: Species[] = [];
    allTalents.forEach((t) => {
      if (t.talent.category.category === TalentCategory.Species) {
        t.talent.category.type.forEach((s) => {
          if (!speciesList.includes(s as Species)) {
            speciesList.push(s as Species);
          }
        });
      }
    });
    const dropDowns = speciesList.map(
      (s) =>
        new DropDownElement(s, SpeciesHelper.getSpeciesByType(s).localizedName),
    );

    dropDowns.sort(DropDownElement.compare);

    dropDowns.unshift(new DropDownElement('', ''));
    return dropDowns;
  };

  const loadTalents = () => {
    const talentsList = TalentsHelper.getTalents();
    for (let i = 0; i < talentsList.length; i++) {
      const talent = talentsList[i];
      const sources = TalentsHelper.getSourceForTalent(talent.name);

      let available = sources && sources.length > 0 ? false : true;
      sources.forEach((s) => {
        const source = SourcesHelper.getSources()[s];
        available = available || source.available;
      });

      if (available) {
        const model = TalentViewModel.from(talent);
        allTalents.push(model);
      }
    }
    allTalents.sort((left, right): number => {
      if (left.localizedName < right.localizedName) return -1;
      if (left.localizedName > right.localizedName) return 1;
      return 0;
    });
  };

  loadTalents();

  const talentList = selectTalents();

  const talents = talentList.map((t, i) => {
    const info = t.aliases.map((a, ai) => {
      return (
        <div className="mt-3" key={'talent-' + ai}>
          <i>The talent is known as </i>
          <b>{a.name}</b>
          <i> in the</i> {SourcesHelper.getSourceName([a.source], true)}{' '}
          <i>book.</i>
        </div>
      );
    });
    let prerequsites = undefined;
    if (t.prerequisites) {
      prerequsites = (
        <div style={{ fontWeight: 'bold' }}>{t.prerequisites}</div>
      );
    }

    const description =
      hasSource(Source.Core2ndEdition) && version !== TalentVersion.FirstEdition
        ? t.talent.localizedDescription2e
        : t.talent.localizedDescription;

    const lines = description.includes(CHALLENGE_DICE_NOTATION) ? (
      description.split('\n').map((l, i) => {
        return (
          <div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>
            {replaceDiceWithArrowhead(l)}
          </div>
        );
      })
    ) : (
      <Markdown className="markdown-sm">{description}</Markdown>
    );

    return (
      <tr key={i}>
        <td className="selection-header">
          {t.localizedName}
          <div className="selection-header-small">({t.source})</div>
        </td>
        <td className="d-none d-md-table-cell">
          {t.talent.localizedCategoryString}
        </td>
        <td>
          {lines} {prerequsites} {info}
        </td>
      </tr>
    );
  });

  return (
    <div className="page container ms-0">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/index.html" onClick={(e) => goToHome(e)}>
              {t('Page.title.home')}
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {t('Page.title.talentsOverview')}
          </li>
        </ol>
      </nav>
      <main>
        <div className="row">
          <div className="col-md-6 mt-3">
            <label className="visually-hidden" htmlFor="search">
              Search
            </label>
            <input
              type="search"
              id="search"
              onChange={(e) => {
                searchChanged(e);
              }}
              value={search}
              placeholder="Search..."
              autoComplete="off"
            />
          </div>
          {showAdvanced ? undefined : (
            <div className="col-md-6 mt-3 text-end">
              <Button
                variant="link"
                className="text-secondary px-0"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Advanced
              </Button>
            </div>
          )}
        </div>
        {showAdvanced ? (
          <div className="row mb-4">
            <div className="col-12 col-md-2 mt-3">
              <label className="visually-hidden" htmlFor="category">
                Version
              </label>
              <DropDownSelect
                id="talentVersion"
                items={getVersionElements()}
                className="w-auto"
                defaultValue={version}
                onChange={(value) => {
                  onVersionChanged(value as TalentVersion);
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <label className="visually-hidden" htmlFor="category">
                Category
              </label>
              <DropDownSelect
                id="categoryType"
                items={getCategoryTypes()}
                className="w-auto"
                defaultValue={categoryType}
                onChange={(value) => {
                  onCategoryTypeChanged(
                    value === '' ? undefined : (value as TalentCategory),
                  );
                }}
              />
            </div>
            {categoryType === TalentCategory.Department ? (
              <div className="col-12 col-md-2 mt-3">
                <label className="visually-hidden" htmlFor="department">
                  {t('Construct.other.departmnet')}
                </label>
                <DropDownSelect
                  id="department"
                  items={getDepartments()}
                  className="w-auto"
                  defaultValue={department}
                  onChange={(value) => {
                    setDepartment(
                      value === '' ? undefined : (value as Department),
                    );
                  }}
                />
              </div>
            ) : undefined}
            {categoryType === TalentCategory.Species ? (
              <div className="col-12 col-md-2 mt-3">
                <label className="visually-hidden" htmlFor="department">
                  Species
                </label>
                <DropDownSelect
                  id="species"
                  items={getSpecies()}
                  className="w-auto"
                  defaultValue={species}
                  onChange={(value) => {
                    setSpecies(value === '' ? undefined : (value as Species));
                  }}
                />
              </div>
            ) : undefined}
          </div>
        ) : undefined}

        <div>
          <table className="selection-list">
            <thead className="visually-hidden">
              <tr>
                <th>{t('Construct.other.talent')}</th>
                <th className="d-none d-md-table-cell">Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{talents}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
