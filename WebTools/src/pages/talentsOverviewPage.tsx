import React = require("react");
import { SetHeaderText } from "../common/extensions";
import { DropDownInput } from "../components/dropDownInput";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentsHelper } from "../helpers/talents";
import { Source, SourcesHelper } from "../helpers/sources";
import { character } from "../common/character";
import { Species, SpeciesHelper } from "../helpers/species";

class TalentViewModel {
    name: string;
    description: string;
    source: string;
    category: string;
    prerequisites: string;

    constructor(name: string, description: string, source: string, category: string, prerequisites: string) {
        this.name = name;
        this.description = description;
        this.source = source;
        this.prerequisites = prerequisites;
        this.category = category;
    }

    matches(term) {
        term = term.toLowerCase();
        return this.name.toLowerCase().indexOf(term) >= 0 || this.description.toLowerCase().indexOf(term) >= 0 || this.category.toLowerCase().indexOf(term) >= 0;
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

        SetHeaderText("Talents");

        this.setupSources();
        this.setupCategories();
        this.loadTalents();
    }

    selectTalents() {
        if (this._search.length == 0) {
            return this._category == TalentsOverviewPage.ALL ? this._allTalents : this._talents[this._category];
        } else {
            var talents = [];
            for (var i = 0; i < this._allTalents.length; i++) {
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
            return (
                <tr key={i}>
                    <td className="selection-header">
                        {t.name}
                        <div className="selection-header-small">
                            ({t.source})
                        </div>
                    </td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                </tr>
            );
        });

        return (
            <div>
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
            character.addSource(src);
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

        for (let sp in Object.keys(Species).filter(species => !isNaN(Number(Species[species])))) {
            const species = SpeciesHelper.getSpeciesByType(Number(sp));
            if (species.talents.length > 0) {
                if (this._categories.indexOf(species.name) === -1) {
                    this._categories.push(species.name);
                }
            }
        }

        this._categories = this._categories.sort((a, b) => a.localeCompare(b));
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
                const model = new TalentViewModel(talent.name, talent.description, this.getSource(talent.name), 
                        skill !== Skill.None ? ("" + skill) : talent.category, this.prerequisitesToString(talent.prerequisites));
                this._allTalents.push(model);
            }
        }
        this._allTalents.sort((left, right): number => {
            if (left.name < right.name) return -1;
            if (left.name > right.name) return 1;
            return 0;
        });
        for (var c = 0; c < this._categories.length; c++) {
            const category = this._categories[c];
            const skill = SkillsHelper.toSkill(category);
            if (skill !== Skill.None) {
                const talents = TalentsHelper.getTalents()[skill];
                for (var i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    const model = new TalentViewModel(talent.name, talent.description, this.getSource(talent.name), category, this.prerequisitesToString(talent.prerequisites));
                    this._talents[category].push(model);
                }
            }
            else if (category != TalentsOverviewPage.ALL) {
                const talents = TalentsHelper.getTalents()[Skill.None];
                for (var i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    if (talent.category === category) {
                        const model = new TalentViewModel(talent.name, talent.description, this.getSource(talent.name), category, this.prerequisitesToString(talent.prerequisites));
                        this._talents[category].push(model);
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