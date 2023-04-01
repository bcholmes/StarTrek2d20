import React from "react";
import { withRouter } from "react-router";
import { Era } from "../helpers/eras";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { BaseCharacterView } from "./baseCharacterView";
import { withTranslation } from 'react-i18next';
import { getNameAndShortRankOf } from "../helpers/ranks";
import { marshaller } from "../helpers/marshaller";
import { Construct } from "../common/construct";
import { FoundryVttExporter } from "../vtt/foundryVttExporter";

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
            {this.renderTopFields()}
            <div className="row">
                <div className="col-xl-6 mt-4">
                    {this.renderStats()}

                    {this.renderValues()}
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

                    {this.renderWeapons()}
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button className="button-small mr-3" onClick={() => this.showExportDialog() } buttonType={true}>{t('Common.button.exportPdf')}</Button>
                <Button className="button-small mr-3" onClick={() => this.exportToJson(this.props.character, 'character') } buttonType={true}>{t('Common.button.exportVtt')}</Button>
            </div>
       </div>);
    }

    renderTopFields() {
        const { t, character } = this.props;
        return (<>
            <Header>{(character.name ? getNameAndShortRankOf(character) : "Unnamed Character")}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.pronouns ? character.pronouns  : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">Department:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.role == null ? character.jobAssignment : character.role}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank}</div></div>

                <div className="col-md-2 view-field-label pb-2">Species:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.speciesName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{character.getAllTraits()}</div></div>
            </div>
        </>)
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(this.props.character, Era.NextGeneration), "sta-character", this.props.character);
    }
}

export default withTranslation()(withRouter(SupportingCharacterView));