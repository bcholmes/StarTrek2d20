import React from "react";
import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Era } from "../helpers/eras";
import { RanksHelper } from "../helpers/ranks";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Skill } from "../helpers/skills";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { WeaponView } from "../components/weaponView";
import { CharacterSerializer } from "../common/characterSerializer";
import { CharacterType } from "../common/characterType";

interface IMainCharacterViewProperties {
    character: Character;
}

export class MainCharacterView extends React.Component<IMainCharacterViewProperties, {}> {

    componentDidMount() {
        if (this.props.character.name) {
            if (this.props.character.rank) {
                document.title = this.props.character.rank + " " + this.props.character.name + " - STAR TREK ADVENTURES";
            } else {
                document.title = this.props.character.name + " - STAR TREK ADVENTURES";
            }
        }
    }

    render() {
        return (<div>
            <Header className="mb-4">{this.getRankAbbreviation() + ' ' + (this.props.character.name ? this.props.character.name : "Unnamed Character")}</Header>

            {this.renderKlingonFields()}

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Species:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.speciesName}</div></div>

                <div className="col-md-2 view-field-label pb-2">Rank:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.rank}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>

                <div className="col-md-2 view-field-label pb-2">Upbringing:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.upbringing ? (this.props.character.upbringing?.name + (this.props.character.acceptedUpbringing ? " (A)" : " (R)")) : ""}</div></div>

                <div className="col-md-2 view-field-label pb-2">Environment:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{CharacterSerializer.serializeEnvironment(this.props.character.environment, this.props.character.otherSpeciesWorld, this.props.character.type)}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Pronouns:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.pronouns ? this.props.character.pronouns  : undefined}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Assignment:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.renderAssignment()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Traits:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.props.character.getAllTraits()}</div></div>
            </div>

            <div className="row">
                <div className="col-xl-6 mt-4">
                    <Header level={2}>Systems</Header>

                    <div className="row row-cols-1 row-cols-md-3 mt-3">
                        <StatView name="Control" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Control].value : undefined} className="col mb-1" />
                        <StatView name="Fitness" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Fitness].value : undefined} className="col mb-1" />
                        <StatView name="Presence" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Presence].value : undefined} className="col mb-1" />
                        <StatView name="Daring" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Daring].value : undefined} className="col mb-1" />
                        <StatView name="Insight" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Insight].value : undefined} className="col mb-1" />
                        <StatView name="Reason" value={this.props.character.attributes ? this.props.character.attributes[Attribute.Reason].value : undefined} className="col mb-1" />
                    </div>

                    <Header level={2} className="mt-4">Departments</Header>
                    <div className="row row-cols-1 row-cols-md-3 mt-3">
                        <StatView name="Command" value={this.props.character.skills ? this.props.character.skills[Skill.Command].expertise : undefined} className="col mb-1" />
                        <StatView name="Security" value={this.props.character.skills ? this.props.character.skills[Skill.Security].expertise : undefined} className="col mb-1" />
                        <StatView name="Science" value={this.props.character.skills ? this.props.character.skills[Skill.Science].expertise : undefined} className="col mb-1" />
                        <StatView name="Conn" value={this.props.character.skills ? this.props.character.skills[Skill.Conn].expertise : undefined} className="col mb-1" />
                        <StatView name="Engineering" value={this.props.character.skills ? this.props.character.skills[Skill.Engineering].expertise : undefined} className="col mb-1" />
                        <StatView name="Medicine" value={this.props.character.skills ? this.props.character.skills[Skill.Medicine].expertise : undefined} className="col mb-1" />
                    </div>

                    {this.renderValues()}
                    {this.renderTalents()}

                </div>


                <div className="col-xl-6">
                    <div className="row">

                        <div className="col-xl-6 mt-4">
                            <Header level={2}>Stress</Header>
                            {this.renderStress()}
                        </div>

                        <div className="col-xl-6 mt-4">
                            <Header level={2}>Focuses</Header>
                            {this.renderFocuses()}
                        </div>

                    </div>

                    <div>
                        <Header level={2} className="mt-4">Weapons</Header>
                        {this.renderWeapons()}
                    </div>
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button text="Export to PDF" className="button-small" onClick={() => this.showExportDialog() } buttonType={true}/>
            </div>
       </div>);
    }

    renderKlingonFields() {
        if (this.props.character.type === CharacterType.KlingonWarrior) {
            return (<div className="row" style={{alignItems: "baseline"}}>
                    <div className="col-md-2 view-field-label pb-2">Lineage:</div>
                    <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.lineage}</div></div>

                    <div className="col-md-2 view-field-label pb-2">House:</div>
                    <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.house}</div></div>
                </div>);
        } else {
            return undefined;
        }
    }

    getRankAbbreviation() {
        if (this.props.character.rank) {
            let rank = RanksHelper.getRankByName(this.props.character.rank);
            return (rank && rank.abbreviation) ? rank.abbreviation : "";
        } else {
            return "";
        }
    }

    renderAssignment() {
        let result = "";
        if (this.props.character.role) {
            result = this.props.character.role;
        } else if (this.props.character.jobAssignment) {
            result = this.props.character.jobAssignment;
        }

        if (this.props.character.assignedShip) {
            if (result.length > 0) {
                result += ", ";
            }
            result += this.props.character.assignedShip;
        }
        return result;
    }

    renderFocuses() {
        if (this.props.character.focuses) {
            return this.props.character.focuses.map((f, i) => (<div className="text-white view-border-bottom py-2" key={'focus-' + i}>{f}</div>));
        } else {
            return undefined;
        }
    }

    renderValues() {
        if (this.props.character.values) {
            return (<>
                <Header level={2} className="mt-4">Values</Header>
                {this.props.character.values.map((v, i) => (<div className="text-white view-border-bottom py-2" key={'value-' + i}>{v}</div>))}
                </>);
        } else {
            return undefined;
        }
    }

    renderTalents() {
        if (this.props.character.talents) {
            return (<>
                <Header level={2} className="mt-4">Talents</Header>
                {this.props.character.getTalentNameList().map((t, i) => (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>{t}</div>))}
                </>);
        } else {
            return undefined;
        }
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(this.props.character, Era.NextGeneration), "character", this.props.character);

    }

    renderWeapons() {
        let weapons = this.props.character.determineWeapons().map((w, i) => {
            let dice = w.dice;
            dice += this.props.character.skills[Skill.Security].expertise;
            return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} />);
        });
        return (<div>{weapons}</div>);
    }

    renderStress() {
        let stress = this.props.character.stress;
        if (stress) {
            let iterator = [];
            for (let i = 1; i <= Math.max(25, Math.ceil(stress / 5) * 5); i++) {
                iterator.push(i);
            }

            const pills = iterator.map(i => {
                if (i <= stress) {
                    return (<div className="empty-pill mb-2" key={'stress-' + i}></div>);
                } else {
                    return (<div className="empty-pill solid mb-2" key={'stress-' + i}></div>);
                }
            });
            return (<div className="d-flex flex-wrap mt-3 mb-2">
                    {pills}
                </div>);
        } else {
            return undefined;
        }
    }
}