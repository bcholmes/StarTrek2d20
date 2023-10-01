import React, { useState } from 'react';
import { DropDownInput } from "../components/dropDownInput";
import { AliasModel } from "../helpers/aliases";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentModel, TalentsHelper } from "../helpers/talents";
import { SourcesHelper } from "../helpers/sources";
import { SpeciesHelper } from "../helpers/species";
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

class TalentViewModel {
    name: string;
    description: string;
    source: string;
    aliases: AliasModel[];
    category: string;
    prerequisites: string;
    displayName: string;

    constructor(name: string, displayName: string, description: string, source: string, category: string, prerequisites: string, aliases: AliasModel[]) {
        this.name = name;
        this.description = description;
        this.source = source;
        this.category = category;
        this.prerequisites = prerequisites;
        this.aliases = aliases;
        this.displayName = displayName;
    }

    matches(term) {
        term = term.toLowerCase().replace("’", "'");
        return this.name.toLowerCase().replace("’", "'").indexOf(term) >= 0 || this.description.toLowerCase().replace("’", "'").indexOf(term) >= 0 || this.category.toLowerCase().indexOf(term) >= 0 || this.matchesAlias(term);
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
        let sourceString = SourcesHelper.getSourceName(TalentsHelper.getSourceForTalentModel(talent));

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

        return new TalentViewModel(talent.name, talent.localizedDisplayName, talent.description, sourceString, category, prerequisites, talent.aliases);
    }
}

const TalentsOverviewPage = () => {
    const ALL: string = "All";
    let _categories: string[] = [];
    let _allTalents: TalentViewModel[] = [];
    let _talents: { [category: string]: TalentViewModel[] } = {};
    const [category, setCategory] = useState(ALL);
    const [search, setSearch] = useState('');

    const navigate = useNavigate();

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

        _categories.push(ALL);
        for (let sk in Object.keys(Skill).filter(skill => !isNaN(Number(Skill[skill])))) {
            if (skillFilter.indexOf(Number(sk)) === -1) {
                let s = SkillsHelper.getSkillName(Number(sk));
                _categories.push(s);
            }
        }

        _categories.push("General");
        _categories.push("Career");
        _categories.push("Enhancement");
        _categories.push("Starship");
        _categories.push("Starbase");
        _categories.push("Esoteric");

        for (let sp in Object.keys(Species).filter(species => !isNaN(Number(Species[species])))) {
            const species = SpeciesHelper.getSpeciesByType(Number(sp));
            if (species && species.talents.length > 0) {
                if (_categories.indexOf(species.name) === -1) {
                    _categories.push(species.name);
                }
            }
        }

        _categories = _categories.sort((a, b) => {
            if (a === 'All') {
                return -1;
            } else if (b === 'All') {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });

        for (var c = 0; c < _categories.length; c++) {
            const category = _categories[c];
            if (!_talents[category]) {
                _talents[category] = [];
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
            if (category !== ALL) {
                const talents = TalentsHelper.getTalents();
                for (let i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    if (talent.category === category) {
                        _talents[category].push(TalentViewModel.from(talent, category));
                    } else if (talent.category.indexOf("/") >= 0) {
                        let c = talent.category.split('/');
                        if (c.indexOf(category) >= 0) {
                            _talents[category].push(TalentViewModel.from(talent, category));
                        }
                    }
                }
            }

            _talents[category].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    const onCategoryChanged = (index: number) => {
        setCategory(_categories[index]);
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
                <td className="d=none d-md-table-cell">{t.category}</td>
                <td>{lines} {prerequsites} {info}</td>
            </tr>
        );
    });

    const { t } = useTranslation();

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.talentsOverview')}</li>
                </ol>
            </nav>
            <div className="float-top">
                <div className="talent-filter">
                    <DropDownInput items={_categories} defaultValue={category} onChange={(index) => { onCategoryChanged(index); }} />
                </div>
                <div className="talent-filter">
                    <input type="text" id="search" onChange={(e) => { searchChanged(e); }} value={search} placeholder="Search..." autoComplete="off"/>
                </div>
            </div>
            <div className="page">
                <table className="selection-list">
                    <tbody>
                        {talents}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TalentsOverviewPage;