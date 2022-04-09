import React from "react";
import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Era } from "../helpers/eras";
import { RanksHelper } from "../helpers/ranks";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Skill } from "../helpers/skills";
import { SpeciesHelper } from "../helpers/species";
import { Button } from "./button";
import { CharacterSheetDialog } from "./characterSheetDialog";
import { Header } from "./header";
import { StatView } from "./StatView";
import { WeaponView } from "./weaponView";

interface ISupportingCharacterViewProperties {
    character: Character;
}

export class SupportingCharacterView extends React.Component<ISupportingCharacterViewProperties, {}> {

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
        return (<div className="container ml-0">
            <Header>{this.getRankAbbreviation() + ' ' + (this.props.character.name ? this.props.character.name : "Unnamed Character")}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Pronouns:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.pronouns ? this.props.character.pronouns  : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">Department:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.role}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Rank:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.rank}</div></div>

                <div className="col-md-2 view-field-label pb-2">Species:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.renderSpecies()}</div></div>
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

                </div>
                <div className="col-xl-6">
                    <Header level={2} className="mt-4">Focuses</Header>
                    {this.renderFocuses()}
                    <Header level={2} className="mt-4">Weapons</Header>
                    {this.renderWeapons()}
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button text="Export to PDF" className="button-small" onClick={() => this.showExportDialog() } buttonType={true}/>
            </div>
       </div>);
    }

    getRankAbbreviation() {
        if (this.props.character.rank) {
            let rank = RanksHelper.getRankByName(this.props.character.rank);
            return (rank && rank.abbreviation) ? rank.abbreviation : "";
        } else {
            return "";
        }
    }

    renderSpecies() {
        if (this.props.character.species) {
            let species = SpeciesHelper.getSpeciesByType(this.props.character.species);
            return species ? species.name : undefined;
        } else {
            return undefined;
        }
    }

    renderFocuses() {
        if (this.props.character.focuses) {
            return this.props.character.focuses.map((f, i) => (<div className="text-white view-border-bottom py-2" key={'focus-' + i}>{f}</div>));
        } else {
            return undefined;
        }
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(this.props.character, Era.NextGeneration), "character", this.props.character);

    }

    renderWeapons() {
        let weapons = this.props.character.determineWeapons().map((w, i) => {
            let dice = w.dice;
            dice += this.props.character.skills[Skill.Security].expertise;
            return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} />); 
        });
        return (<div>{weapons}</div>);
    }

}