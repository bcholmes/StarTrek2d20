import React from "react";
import { Starship } from "../common/starship";
import { CharacterType } from "../common/characterType";
import { Department } from "../helpers/departments";
import { Era } from "../helpers/eras";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { System } from "../helpers/systems";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { OutlineImage } from "../components/outlineImage";
import { StatView } from "../components/StatView";
import WeaponView from "../components/weaponView";
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from "../common/translationKey";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";

const NBSP = '\u00A0';

interface IStarshipViewProperties extends WithTranslation {
    starship: Starship;
}

class StarshipView extends React.Component<IStarshipViewProperties, {}> {

    componentDidMount() {
        if (this.props.starship.name) {
            document.title = this.props.starship.name + " - STAR TREK ADVENTURES";
        }
    }

    render() {
        const { t } = this.props;

        let name = "";
        if (this.props.starship.name) {
            name = this.props.starship.name;

            if (this.props.starship.type !== CharacterType.KlingonWarrior && this.props.starship.registry) {
                name += ' • ' + this.props.starship.registry;
            }
        } else {
            name = t('ViewPage.unnamedStarship');
        }

        return (<main>
            <Header>{name}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.spaceFrame')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.localizedClassName ? this.props.starship.localizedClassName : NBSP}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.serviceDate')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.serviceYear? this.props.starship.serviceYear : NBSP}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.missionProfile')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.missionProfileModel ? this.props.starship.missionProfileModel.localizedName : NBSP}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.refits')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2 small">{this.refitAsString()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.getAllTraits()}</div></div>
            </div>

            <div className="row">
                <div className="col-xl-6 mt-4">
                    <Header level={2}>{t('Construct.other.systems')}</Header>

                    <div className="row row-cols-1 row-cols-md-3 mt-3">
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Comms]))} value={this.props.starship.getSystemValue(System.Comms)} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Engines]))} value={this.props.starship.getSystemValue(System.Engines)} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Structure]))} value={this.props.starship.getSystemValue(System.Structure)} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Computer]))} value={this.props.starship.getSystemValue(System.Computer)} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Sensors]))} value={this.props.starship.getSystemValue(System.Sensors)} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Weapons]))} value={this.props.starship.getSystemValue(System.Weapons)} className="col mb-2" />
                    </div>

                    <Header level={2} className="mt-4">{t('Construct.other.departments')}</Header>
                    <div className="row row-cols-1 row-cols-md-3 mt-3">
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Command]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Command] : undefined} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Security]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Security] : undefined} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Science]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Science] : undefined} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Conn]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Conn] : undefined} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Engineering]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Engineering] : undefined} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Medicine]))} value={this.props.starship.departments ? this.props.starship.departments[Department.Medicine] : undefined} className="col mb-2" />
                    </div>

                    <div className="mt-3">
                        <OutlineImage starship={this.props.starship} size="lg" />

                        <div className="row row-cols-1 row-cols-xl-3 mb-2">
                            <StatView showZero={true} name={t('Construct.other.resistance')} value={this.props.starship.resistance} className="col mb-2" colourClass="red" />
                            <StatView showZero={true} name={t('Construct.other.scale')} value={this.props.starship.scale} className="col mb-2" colourClass="red" />
                        </div>
                    </div>
                    {this.renderTalentNames()}

                </div>
                <div className="col-xl-6 mt-4">
                    <div className="row">
                        <div className="col-xl-6">
                            <Header level={2}>{t('Construct.other.shields')}</Header>
                            {this.renderShields()}
                        </div>
                        <div className="col-xl-6">
                            <Header level={2}><>{t('Construct.other.power')} / {t('Construct.other.crew')}</></Header>
                            <div className="row row-cols-1 row-cols-1 mb-1 mt-3">
                                <StatView showZero={true} name={t('Construct.other.power')} value={this.props.starship.power} className="col" />
                            </div>
                            <div className="row row-cols-1 row-cols-1 mb-2">
                                <StatView showZero={true} name={t('Construct.other.crew')} value={this.props.starship.crewSupport} className="col" />
                            </div>
                        </div>
                    </div>
                    <Header level={2} className="mt-4">{t('Construct.other.weapons')}</Header>
                    {this.renderWeapons()}
                </div>
            </div>

            <div className="button-container mt-5 mb-3">
                <Button className="button-small me-3" onClick={() => this.showExportDialog() }>{t('Common.button.exportPdf')}</Button>
                <Button className="button-small me-3" onClick={() => this.showVttExportDialog() }>{t('Common.button.exportVtt')}</Button>
            </div>
       </main>);
    }

    private refitAsString() {
        let refitString = this.props.starship.refitsAsString();
        return  refitString === "" ? NBSP : refitString;
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(this.props.starship, Era.NextGeneration), "starship", this.props.starship);
    }

    private getAllTraits() {
        let traits = this.props.starship.getAllTraits();
        return traits === "" ? NBSP : traits;
    }

    renderTalentNames() {
        const { t } = this.props;
        let talentNames = this.props.starship.getTalentSelectionList().filter(t => !t.talent.specialRule).map(t => t.description);
        let specialRuleNames = this.props.starship.getTalentSelectionList().filter(t => t.talent.specialRule).map(t => t.description);

        return (<>
                {talentNames?.length
                    ? (<>
                        <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
                        {talentNames.map((t, i) => (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>{t}</div>))}
                    </>)
                    : null}
                {specialRuleNames?.length
                    ? (<>
                        <Header level={2} className="mt-4">{t('Construct.other.specialRules')}</Header>
                        {specialRuleNames.map((t, i) => (<div className="text-white view-border-bottom py-2" key={'special-' + i}>
                            {t === "Mission Pod" && this.props.starship?.missionPodModel ? (t + ": " + this.props.starship.missionPodModel.name) : t}
                            </div>))}
                    </>)
                    : null}
            </>);
    }

    renderShields() {
        let shield = this.props.starship.shields;
        if (shield) {
            let iterator = [];
            for (let i = 1; i <= Math.max(25, Math.ceil(shield / 5) * 5); i++) {
                iterator.push(i);
            }

            const pills = iterator.map(i => {
                if (i <= shield) {
                    return (<div className="empty-pill mb-2" key={'shield-' + i}></div>);
                } else {
                    return (<div className="empty-pill solid mb-2" key={'shield-' + i}></div>);
                }
            });
            return (<div className="d-flex flex-wrap mt-3 mb-2">
                    {pills}
                </div>);
        } else {
            return undefined;
        }
    }

    renderWeapons() {
        let weapons = this.props.starship.determineWeapons().map((w, i) => {
            let dice = w.dice;
            if (w.scaleApplies && this.props.starship.scale) {
                dice += this.props.starship.scale;
            }
            if (w.isTractorOrGrappler) {
                dice = this.props.starship.scale - 1;
                if (this.props.starship.hasTalent("High-Power Tractor Beam")) {
                    dice += 2;
                }
            }
            if (!w.isTractorOrGrappler && this.props.starship.departments) {
                dice += this.props.starship.departments[Department.Security];
            }
            return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} />);
        });
        return (<div>{weapons}</div>);
    }

    showVttExportDialog() {
        VttSelectionDialog.instance.show(this.props.starship);
    }
}

export default withTranslation()(StarshipView);