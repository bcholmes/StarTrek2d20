import * as React from 'react';
import { DropDownInput } from "../components/dropDownInput";
import { AliasModel } from "../helpers/aliases";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentModel, TalentsHelper } from "../helpers/talents";
import { Source, SourcesHelper } from "../helpers/sources";
import { SpeciesHelper } from "../helpers/species";
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Species } from '../helpers/speciesEnum';
import { context } from '../common/context';

class TalentViewModel {
    name: string;
    description: string;
    source: string;
    aliases: AliasModel[];
    category: string;
    prerequisites: string;

    constructor(name: string, description: string, source: string, category: string, prerequisites: string, aliases: AliasModel[]) {
        this.name = name;
        this.description = description;
        this.source = source;
        this.category = category;
        this.prerequisites = prerequisites;
        this.aliases = aliases;
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

        return new TalentViewModel(talent.name, talent.description, sourceString, category, prerequisites, talent.aliases);
    }
}

export class TalentsOverviewPage extends React.Component<{}, {}> {
    static ALL: string = "All";
    private _categories: string[] = [];
    private _category: string = "";
    private _allTalents: TalentViewModel[] = [];
    private _talents: { [category: string]: TalentViewModel[] } = {};
    private _search: string = '';

    constructor(props: {}) {
        super(props);

        //SetHeaderText("Talents");

        this.setupSources();
        this.setupCategories();
        this.loadTalents();
    }

    selectTalents() {
        if (this._search.length === 0) {
            return this._category === TalentsOverviewPage.ALL ? this._allTalents : this._talents[this._category];
        } else {
            let talents = [];
            for (let i = 0; i < this._allTalents.length; i++) {
                const talent = this._allTalents[i];
                if (talent.matches(this._search)) {
                    talents.push(talent);
                }
            }
            
            return talents;
        }
    }

    render() {
        const talentList = this.selectTalents();
        const talents = talentList.map((t, i) => {
            const info = t.aliases.map((a) => {
                return (
                    <p key={'talent-' + i}><i>The talent is known as </i><b>{a.name}</b><i> in the
                    </i> {SourcesHelper.getSourceName([a.source])} <i>book.</i></p>
                )
            });
            let prerequsites = undefined;
            if (t.prerequisites) {
                prerequsites = (<div style={{ fontWeight: "bold" }}>{t.prerequisites}</div>);
            }
            let description = replaceDiceWithArrowhead(t.description);
            return (
                <tr key={i}>
                    <td className="selection-header">
                        {t.name}
                        <div className="selection-header-small">
                            ({t.source})
                        </div>
                    </td>
                    <td className="d=none d-md-table-cell">{t.category}</td>
                    <td>{description} {prerequsites} {info}</td>
                </tr>
            );
        });

        return (
            <div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Talents Overview</li>
                    </ol>
                </nav>
                <div className="float-top">
                    <div className="talent-filter">
                        <DropDownInput items={this._categories} defaultValue={this._category} onChange={(index) => { this.onCategoryChanged(index); }} />
                    </div>
                    <div className="talent-filter">
                        <input type="text" id="search" onChange={(e) => { this.searchChanged(e); }} value={this._search} placeholder="Search..." autoComplete="off"/>
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

    private searchChanged(event) {
        this._search = event.target.value;
        if (this._search.length > 0) {
            this._category = TalentsOverviewPage.ALL;
        }
        this.forceUpdate();
    }

    private setupSources() {
        for (let source in Object.keys(Source).filter(src => !isNaN(Number(Source[src])))) {
            let src = Number(source);
            context.addSource(src);
        }
    }

    private setupCategories() {
        var skillFilter = [6];

        this._categories.push(TalentsOverviewPage.ALL);
        for (let sk in Object.keys(Skill).filter(skill => !isNaN(Number(Skill[skill])))) {
            if (skillFilter.indexOf(Number(sk)) === -1) {
                let s = SkillsHelper.getSkillName(Number(sk));
                this._categories.push(s);
            }
        }

        this._categories.push("General");
        this._categories.push("Career");
        this._categories.push("Enhancement");
        this._categories.push("Starship");
        this._categories.push("Esoteric");

        for (let sp in Object.keys(Species).filter(species => !isNaN(Number(Species[species])))) {
            const species = SpeciesHelper.getSpeciesByType(Number(sp));
            if (species && species.talents.length > 0) {
                if (this._categories.indexOf(species.name) === -1) {
                    this._categories.push(species.name);
                }
            }
        }

        this._categories = this._categories.sort((a, b) => {
            if (a === 'All') {
                return -1;
            } else if (b === 'All') {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });
        this._category = this._categories[0];

        for (var c = 0; c < this._categories.length; c++) {
            const category = this._categories[c];
            if (!this._talents[category]) {
                this._talents[category] = [];
            }
        }
    }

    private loadTalents() {
        
        const talentsList = TalentsHelper.getTalents();
        for (const key in talentsList) {
            const talents = talentsList[key];
            for (var i = 0; i < talents.length; i++) {
                const talent = talents[i];
                const skill = SkillsHelper.findSkill(key);
                const category = skill !== Skill.None ? ("" + skill) : talent.category;
                const model = TalentViewModel.from(talent, category);
                this._allTalents.push(model);
            }
        }
        this._allTalents.sort((left, right): number => {
            if (left.name < right.name) return -1;
            if (left.name > right.name) return 1;
            return 0;
        });
        for (let c = 0; c < this._categories.length; c++) {
            const category = this._categories[c];
            const skill = SkillsHelper.toSkill(category);
            if (skill !== Skill.None) {
                const talents = TalentsHelper.getTalents()[skill];
                for (let i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    this._talents[category].push(TalentViewModel.from(talent, category));
                }
            }
            else if (category !== TalentsOverviewPage.ALL) {
                const talents = TalentsHelper.getTalents()[Skill.None];
                for (let i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    if (talent.category === category) {
                        this._talents[category].push(TalentViewModel.from(talent, category));
                    }
                }
            }

            this._talents[category].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    private getSource(talent: string) {
        return SourcesHelper.getSourceName(TalentsHelper.getSourceForTalent(talent));
    }

    private prerequisitesToString(pre: {}[]) {
        return "";
    }

    private onCategoryChanged(index: number) {
        this._category = this._categories[index];
        this._search = '';
        this.forceUpdate();
    }
}
