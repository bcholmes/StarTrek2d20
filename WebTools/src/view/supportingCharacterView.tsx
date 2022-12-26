import React from "react";
import { Era } from "../helpers/eras";
import { RanksHelper } from "../helpers/ranks";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Skill } from "../helpers/skills";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { WeaponView } from "../components/weaponView";
import { BaseCharacterView } from "./baseCharacterView";
import { withTranslation } from 'react-i18next';

class SupportingCharacterView extends BaseCharacterView {

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
        const { t } = this.props;
        return (<div>
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
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.speciesName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Traits:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.props.character.getAllTraits()}</div></div>
            </div>

            <div className="row">
                <div className="col-xl-6 mt-4">
                    {this.renderStats()}
                </div>
                <div className="col-xl-6">
                    <div className="row">

                        <div className="col-xl-6 mt-4">
                            <Header level={2}>{t('Construct.other.stress')}</Header>
                            {this.renderStress()}
                        </div>

                        <div className="col-xl-6 mt-4">
                            <Header level={2}>{t('Construct.other.focuses')}</Header>
                            {this.renderFocuses()}
                        </div>

                    </div>

                    <Header level={2} className="mt-4">{t('Construct.other.weapons')}</Header>
                    {this.renderWeapons()}
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button text={t('Common.button.exportPdf')} className="button-small" onClick={() => this.showExportDialog() } buttonType={true}/>
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

export default withTranslation()(SupportingCharacterView);