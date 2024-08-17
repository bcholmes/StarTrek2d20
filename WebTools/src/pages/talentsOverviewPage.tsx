import React, { useState } from 'react';
import { DropDownElement, DropDownSelect } from "../components/dropDownInput";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentModel, TalentsHelper } from "../helpers/talents";
import { Source, SourcesHelper } from "../helpers/sources";
import { SpeciesHelper } from "../helpers/species";
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toCamelCase } from '../common/camelCaseUtil';
import { hasSource } from '../state/contextFunctions';

class TalentViewModel {
    name: string;
    talent: TalentModel;
    description: string;
    category: string;
    prerequisites: string;
    displayName: string;

    constructor(name: string, displayName: string, description: string, category: string, prerequisites: string, talent: TalentModel) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.prerequisites = prerequisites;
        this.displayName = displayName;
        this.talent = talent;
    }

    get aliases() {
        return this.talent.aliases;
    }

    get source() {
        return SourcesHelper.getSourceName(TalentsHelper.getSourceForTalentModel(this.talent));
    }

    matches(term) {
        term = term.toLowerCase().replace("’", "'");
        return this.name.toLowerCase().replace("’", "'").indexOf(term) >= 0
            || this.displayName.toLowerCase().replace("’", "'").indexOf(term) >= 0
            || this.description.toLowerCase().replace("’", "'").indexOf(term) >= 0
            || this.category.toLowerCase().indexOf(term) >= 0 || this.matchesAlias(term)
            || this.talent.localizedCategory.toLowerCase().indexOf(term) >= 0 || this.matchesAlias(term);
    }
    matchesAlias(term) {
        var result = false;
        for (var i = 0; i < this.aliases.length; i++) {
            const alias = this.aliases[i];
            result = alias.name.toLowerCase().replace("’", "'").indexOf(term) >= 0;
            if (result) {
                break;
            }
        }
        return result;
    }
    static from(talent: TalentModel, category: string) {
        let prerequisites = "";
        talent.prerequisites.forEach((p) => {
            let desc = p.describe();
            if (desc) {
                if (prerequisites === "") {
                    prerequisites = desc;
                } else {
                    prerequisites += (", " + desc);
                }
            }
        });

        return new TalentViewModel(talent.name, talent.localizedDisplayName,
            hasSource(Source.Core2ndEdition) ? talent.localizedDescription2e : talent.localizedDescription,
            category, prerequisites, talent);
    }
}

const TalentsOverviewPage = () => {
    const ALL: string = "All";
    let _categories: DropDownElement[] = [];
    let _allTalents: TalentViewModel[] = [];
    let _talents: { [category: string]: TalentViewModel[] } = {};
    const [category, setCategory] = useState(ALL);
    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    const { t } = useTranslation();

    const selectTalents = () => {
        if (search.length === 0) {
            return category === ALL ? _allTalents : _talents[category];
        } else {
            let talents = [];
            for (let i = 0; i < _allTalents.length; i++) {
                const talent = _allTalents[i];
                if (talent.matches(search)) {
                    talents.push(talent);
                }
            }

            return talents;
        }
    }

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/");
    }

    const searchChanged = (event) => {
        let searchValue = event.target.value;
        setSearch(event.target.value);
        if (searchValue.length > 0) {
            setCategory(ALL);
        }
    }

    const setupCategories = () => {
        var skillFilter = [6];

        _categories.push(new DropDownElement(ALL, ALL));
        for (let sk in Object.keys(Skill).filter(skill => !isNaN(Number(Skill[skill])))) {
            if (skillFilter.indexOf(Number(sk)) === -1) {
                let s = SkillsHelper.getSkillName(Number(sk));
                _categories.push(new DropDownElement(s, t('Construct.discipline.' + toCamelCase(Skill[sk]))));
            }
        }

        _categories.push(new DropDownElement("General", t('TalentCategory.general')));
        _categories.push(new DropDownElement("Career", t('TalentCategory.career')));
        _categories.push(new DropDownElement("Enhancement", t('TalentCategory.enhancement')));
        _categories.push(new DropDownElement("Starship", t('TalentCategory.starship')));
        _categories.push(new DropDownElement("Starbase", t('TalentCategory.starbase')));
        _categories.push(new DropDownElement("Esoteric", t('TalentCategory.esoteric')));

        for (let sp in Object.keys(Species).filter(species => !isNaN(Number(Species[species])))) {
            const species = SpeciesHelper.getSpeciesByType(Number(sp));
            if (species && species.talents.length > 0) {
                _categories.filter(d => d.value === species.name)
                if (_categories.filter(d => d.value === species.name).length === 0) {
                    _categories.push(new DropDownElement(species.name, species.localizedName));
                }
            }
        }

        _categories = _categories.sort((a, b) => {
            if (a.name === ALL) {
                return -1;
            } else if (b.name === ALL) {
                return 1;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        for (var c = 0; c < _categories.length; c++) {
            const category = _categories[c];
            if (!_talents[category.value]) {
                _talents[category.value] = [];
            }
        }
    }

    const loadTalents = () => {

        const talentsList = TalentsHelper.getTalents();
        for (var i = 0; i < talentsList.length; i++) {
            const talent = talentsList[i];
            const sources = TalentsHelper.getSourceForTalent(talent.name);

            let available = (sources && sources.length > 0) ? false : true;
            sources.forEach(s => {
                let source = SourcesHelper.getSources()[s];
                available = available || source.available;
            });

            if (available) {
                const model = TalentViewModel.from(talent, talent.category);
                _allTalents.push(model);
            }
        }
        _allTalents.sort((left, right): number => {
            if (left.name < right.name) return -1;
            if (left.name > right.name) return 1;
            return 0;
        });
        for (let c = 0; c < _categories.length; c++) {
            const category = _categories[c];
            if (category.value !== ALL) {
                const talents = TalentsHelper.getTalents();
                for (let i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    if (talent.category === category.value) {
                        _talents[category.value].push(TalentViewModel.from(talent, category.value as string));
                    } else if (talent.category.indexOf("/") >= 0) {
                        let c = talent.category.split('/');
                        if (c.indexOf(category.value) >= 0) {
                            _talents[category.value].push(TalentViewModel.from(talent, category.value as string));
                        }
                    }
                }
            }

            _talents[category.value].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    const onCategoryChanged = (value: string) => {
        setCategory(value);
        setSearch('');
    }

    setupCategories();
    loadTalents();


    const talentList = selectTalents();

    const talents = talentList.map((t, i) => {
        const info = t.aliases.map((a, ai) => {
            return (
                <div className="mt-3" key={'talent-' + ai}><i>The talent is known as </i><b>{a.name}</b><i> in the
                </i> {SourcesHelper.getSourceName([a.source], true)} <i>book.</i></div>
            )
        });
        let prerequsites = undefined;
        if (t.prerequisites) {
            prerequsites = (<div style={{ fontWeight: "bold" }}>{t.prerequisites}</div>);
        }
        let lines = t.description.split('\n').map((l, i) => {
            return (<div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>{replaceDiceWithArrowhead(l)}</div>);
        });
        return (
            <tr key={i}>
                <td className="selection-header">
                    {t.displayName}
                    <div className="selection-header-small">
                        ({t.source})
                    </div>
                </td>
                <td className="d=none d-md-table-cell">{t.talent.localizedCategory}</td>
                <td>{lines} {prerequsites} {info}</td>
            </tr>
        );
    });

    return (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.talentsOverview')}</li>
                </ol>
            </nav>
            <main>
                <div className="row">
                    <div className="col-md-6 mt-3">
                        <label className="visually-hidden" htmlFor='category'>Category</label>
                        <DropDownSelect id="category" items={_categories} defaultValue={category} onChange={(value) => { onCategoryChanged(value as string); }} />
                    </div>
                    <div className="col-md-6 mt-3 text-end">
                        <label className="visually-hidden" htmlFor='search'>Search</label>
                        <input type="search" id="search" onChange={(e) => { searchChanged(e); }} value={search} placeholder="Search..." autoComplete="off"/>
                    </div>
                </div>
                <div>
                    <table className="selection-list">
                        <thead className="visually-hidden">
                            <tr>
                                <th>{t('Construct.other.talent')}</th>
                                <th>Category</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {talents}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default TalentsOverviewPage;