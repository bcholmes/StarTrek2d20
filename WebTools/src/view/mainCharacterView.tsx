import React from "react";
import { Era } from "../helpers/eras";
import { RanksHelper } from "../helpers/ranks";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Skill } from "../helpers/skills";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { WeaponView } from "../components/weaponView";
import { CharacterSerializer } from "../common/characterSerializer";
import { CharacterType } from "../common/characterType";
import { withTranslation } from 'react-i18next';
import { BaseCharacterView } from "./baseCharacterView";

class MainCharacterView extends BaseCharacterView {

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
            <Header className="mb-4">{this.getRankAbbreviation() + ' ' + (this.props.character.name ? this.props.character.name : "Unnamed Character")}</Header>

            {this.renderKlingonFields()}

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.species')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.speciesName}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.rank}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.upbringing')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.upbringing ? (this.props.character.upbringing?.name + (this.props.character.acceptedUpbringing ? " (A)" : " (R)")) : ""}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.environment')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{CharacterSerializer.serializeEnvironment(this.props.character.environment, this.props.character.otherSpeciesWorld, this.props.character.type)}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.character.pronouns ? this.props.character.pronouns  : undefined}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.assignment')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.renderAssignment()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.props.character.getAllTraits()}</div></div>
            </div>

            <div className="row">
                <div className="col-xl-6 mt-4">
                    {this.renderStats()}

                    {this.renderValues()}
                    {this.renderTalents()}

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

                    <div>
                        <Header level={2} className="mt-4">{t('Construct.other.weapons')}</Header>
                        {this.renderWeapons()}

                        <Header level={2} className="mt-4">{t('Construct.other.equipment')}</Header>
                        {this.renderEquipment()}
                    </div>
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button text={t('Common.button.exportPdf')} className="button-small" onClick={() => this.showExportDialog() } buttonType={true}/>
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

    renderEquipment() {
        if (this.props.character.equipment) {
            return this.props.character.equipment.map((e, i) => (<div className="text-white view-border-bottom py-2" key={'equipment-' + i}>{e}</div>));
        } else {
            return undefined;
        }
    }

    renderValues() {
        const { t } = this.props;
        if (this.props?.character?.values?.length) {
            return (<>
                <Header level={2} className="mt-4">{t('Construct.other.values')}</Header>
                {this.props.character.values.map((v, i) => (<div className="text-white view-border-bottom py-2" key={'value-' + i}>{v}</div>))}
                </>);
        } else {
            return undefined;
        }
    }

    renderTalents() {
        const { t } = this.props;
        if (this.props.character?.getTalentNameList()?.length) {
            return (<>
                <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
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
}

export default withTranslation()(MainCharacterView);