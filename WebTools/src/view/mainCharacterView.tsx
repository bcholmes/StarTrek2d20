import React from "react";
import { withRouter } from "react-router";
import { Era } from "../helpers/eras";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { CharacterSerializer } from "../common/characterSerializer";
import { CharacterType } from "../common/characterType";
import { withTranslation } from 'react-i18next';
import { BaseCharacterView } from "./baseCharacterView";
import { getNameAndShortRankOf } from "../helpers/ranks";
import { StatView } from "../components/StatView";
import store from "../state/store";
import { setCharacter } from "../state/characterActions";

class MainCharacterView extends BaseCharacterView {

    componentDidMount() {
        if (this.props.character.name) {
            if (this.props.character.rank) {
                document.title = this.props.character.rank?.localizedName + " " + this.props.character.name + " - STAR TREK ADVENTURES";
            } else {
                document.title = this.props.character.name + " - STAR TREK ADVENTURES";
            }
        }
    }

    render() {
        const { t } = this.props;
        return (<div>
            {this.renderTopFields()}

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
                        {this.renderWeapons()}

                        <Header level={2} className="mt-4">{t('Construct.other.equipment')}</Header>
                        {this.renderEquipment()}
                    </div>
                </div>
            </div>

            {(this.props.showButtons == null || this.props.showButtons === true)
                ? (<div className="d-flex justify-content-between">
                        <div className="mt-5 mb-3">
                            <Button className="button-small mr-3" onClick={() => this.showExportDialog() } buttonType={true}>{t('Common.button.exportPdf')}</Button>
                            <Button className="button-small mr-3" onClick={() => this.showVttExportDialog() } buttonType={true}>{t('Common.button.exportVtt')}</Button>
                        </div>
                        <div className="mt-5 mb-3">
                            <Button className="button-small" onClick={() => this.navigateToModification() } buttonType={true}>{t('Common.button.modify')}</Button>
                        </div>
                    </div>)
                : null}
       </div>);
    }

    renderStats() {
        const {character, t} = this.props;
        return (<>
            {super.renderStats()}
            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t('Construct.other.resistance')} value={character.resistance} className="col mb-1" colourClass="pink" showZero={true}/>
                <StatView name={t('Construct.other.reputation')} value={character.reputation} className="col mb-1" colourClass="pink" showZero={true}/>
                <StatView name={t('Construct.other.reprimands')} value={character.reprimands} className="col mb-1" colourClass="red" showZero={true}/>
            </div>
        </>)
    }

    navigateToModification() {
        const { history, character } = this.props;
        store.dispatch(setCharacter(character));
        history.push("/modify");
    }

    renderTopFields() {
        const { t, character } = this.props;
        return (<>
            <Header className="mb-4">{(character.name ? getNameAndShortRankOf(character) : "Unnamed Character")}</Header>

            {this.renderKlingonFields()}

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.species')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.speciesName}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank?.localizedName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.upbringing')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.upbringingStep ? character.upbringingStep.description : ""}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.environment')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{CharacterSerializer.serializeEnvironment(character.environmentStep?.environment, character.environmentStep?.otherSpecies, character.type)}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.pronouns ? character.pronouns  : undefined}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.assignment')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.renderAssignment()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{character.getAllTraits()}</div></div>
            </div>
        </>)

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

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(this.props.character, Era.NextGeneration), "sta-character", this.props.character);
    }
}

export default withTranslation()(withRouter(MainCharacterView));