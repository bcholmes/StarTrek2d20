import React from "react";
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
import { Construct } from "../common/construct";
import { marshaller } from "../helpers/marshaller";

declare function download(bytes: any, fileName: any, contentType: any): any;

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
                ? (<div className="button-container mt-5 mb-3">
                        <Button className="button-small mr-3" onClick={() => this.showExportDialog() } buttonType={true}>{t('Common.button.exportPdf')}</Button>
                        <Button className="button-small mr-3" onClick={() => this.exportToJson(this.props.character, 'character') } buttonType={true}>{t('Common.button.exportJson')}</Button>
                    </div>)
                : null}
       </div>);
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
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.upbringing')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.upbringingStep ? (character.upbringingStep.upbringing?.name + (character.upbringingStep.acceptedUpbringing ? " (A)" : " (R)")) : ""}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.environment')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{CharacterSerializer.serializeEnvironment(character.environment, character.otherSpeciesWorld, character.type)}</div></div>
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

    exportToJson(construct: Construct, suffix: string) {
        const json = marshaller.encodeMainCharacterAsJson(this.props.character);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        var escaped = construct.name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') ?? "sta";
        download(jsonBytes, escaped + '-' + suffix + ".json", "application/json");
    }
}

export default withTranslation()(MainCharacterView);