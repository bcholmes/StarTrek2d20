import React = require("react");
import { SetHeaderText } from "../common/extensions";
import { DropDownInput } from "../components/dropDownInput";
import { AliasModel } from "../helpers/aliases";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentModel, TalentsHelper } from "../helpers/talents";
import { Source, SourcesHelper } from "../helpers/sources";
import { character } from "../common/character";
import { Species, SpeciesHelper } from "../helpers/species";

class TalentViewModel {
    name: string;
    description: string;
    source: string;
    aliases: AliasModel[];

    constructor(name: string, description: string, source: string, aliases: AliasModel[]) {
        this.name = name;
        this.description = description;
        this.source = source;
        this.aliases = aliases;
    }

    static from(talent: TalentModel) {
        let sourceString = SourcesHelper.getSourceName(TalentsHelper.getSourceForTalentModel(talent));

        return new TalentViewModel(talent.name, talent.description, sourceString, talent.aliases);
    }
}

export class TalentsOverviewPage extends React.Component<{}, {}> {
    private _categories: string[] = [];
    private _category: string = "";
    private _talents: { [category: string]: TalentViewModel[] } = {};

    constructor(props: {}) {
        super(props);

        SetHeaderText("Talents");

        this.setupSources();
        this.setupCategories();
        this.loadTalents();
    }

    render() {
        const talents = this._talents[this._category].map((t, i) => {
            const info = t.aliases.map((a, i) => {
                return (
                    <p><i>The talent is known as </i><b>{a.name}</b><i> in the
                    </i> {SourcesHelper.getSourceName([a.source])} <i>book.</i></p>
                )
            });

            return (
                <tr key={i}>
                    <td className="selection-header">
                        {t.name}
                        <div className="selection-header-small">
                            ({t.source})
                        </div>
                    </td>
                    <td>{t.description} {info}</td>
                </tr>
            );
        });

        return (
            <div>
                <div className="float-top">
                    <DropDownInput items={this._categories} defaultValue={this._category} onChange={(index) => { this.onCategoryChanged(index); }} />
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

    private setupSources() {
        for (let source in Object.keys(Source).filter(src => !isNaN(Number(Source[src])))) {
            let src = Number(source);
            character.addSource(src);
        }
    }

    private setupCategories() {
        var skillFilter = [6];

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
        for (var c = 0; c < this._categories.length; c++) {
            const category = this._categories[c];
            const skill = SkillsHelper.toSkill(category);
            if (skill !== Skill.None) {
                const talents = TalentsHelper.getTalents()[skill];
                for (var i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    this._talents[category].push(TalentViewModel.from(talent));
                }
            }
            else {
                const talents = TalentsHelper.getTalents()[Skill.None];
                for (var i = 0; i < talents.length; i++) {
                    const talent = talents[i];
                    if (talent.category === category) {
                        this._talents[category].push(TalentViewModel.from(talent));
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
        this.forceUpdate();
    }
}
