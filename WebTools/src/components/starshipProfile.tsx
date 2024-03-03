import React from "react";
import { connect } from "react-redux";
import { Era, ErasHelper } from "../helpers/eras";
import store from "../state/store";
import { CharacterTypeModel } from "../common/characterType";
import { useTranslation } from "react-i18next";
import { Stereotype } from "../common/construct";
import { Source } from "../helpers/sources";
import { System } from "../helpers/systems";
import { Department } from "../helpers/departments";
import { Starship } from "../common/starship";

interface IStarshipProfileProperties {
    era?: Era;
    showProfile: boolean;
    close: () => void;
}

const StarshipProfile: React.FC<IStarshipProfileProperties> = ({showProfile, era, close}) => {

    const { t } = useTranslation();
    let starship = store.getState().starship?.starship as Starship;
    let containerClass = showProfile ? "sheet-container sheet-container-visible pe-3" :  "sheet-container sheet-container-hidden pe-3";
    const eraModel = era != null ? ErasHelper.getEra(era) : null;

    const talents = starship?.getTalentSelectionList().map((t, i) => {
        let name = starship?.stereotype === Stereotype.SoloStarship ? t.talent.localizedNameForSource(Source.CaptainsLog) : t.talent.localizedDisplayName;
        return (<div key={'talent-' + i}>{name}</div>)
    });

    return (
        <div id="character-sheet">
            <div id="character-sheet" className={showProfile ? 'sheet-visible' : 'sheet-hidden'}>
                <div className="sheet-bg" id="sheet-bg" style={{ display: showProfile ? '' : "none" }} onClick={() => close()}></div>
                <div className={containerClass} id="sheet-container">

                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Page.title.starshipTypeSelection')}</div>
                                <div className="sheet-data">
                                    {CharacterTypeModel.getByType(starship?.type)?.localizedName}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-2">
                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.era')}</div>
                                <div className="sheet-data">
                                    {eraModel?.localizedName ?? ""}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-2">
                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.name')}</div>
                                <div className="sheet-data">{starship?.name ?? ""}</div>
                            </div>

                            {starship?.stereotype === Stereotype.SoloStarship
                                ? undefined
                                : (<div className="sheet-panel d-flex">
                                        <div className="sheet-label-purple text-uppercase">{t('Construct.other.serviceDate')}</div>
                                        <div className="sheet-data">{starship?.serviceYear ?? ""}</div>
                                    </div>)}

                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.registry')}</div>
                                <div className="sheet-data">{starship?.registry ?? ""}</div>
                            </div>

                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.spaceFrame')}</div>
                                <div className="sheet-data">{starship?.localizedClassName ?? ""}</div>
                            </div>

                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.scale')}</div>
                                <div className="sheet-data">{starship?.spaceframeModel?.scale ?? ""}</div>
                            </div>

                            {starship?.stereotype === Stereotype.SoloStarship
                                ? undefined
                                : (<div className="sheet-panel d-flex">
                                        <div className="sheet-label-purple text-uppercase">{t('Construct.other.serviceDate')}</div>
                                        <div className="sheet-data">{starship?.missionProfileModel?.localizedName ?? ""}</div>
                                    </div>)}

                            {starship?.stereotype === Stereotype.SoloStarship
                                ? undefined
                                : (<div className="sheet-panel d-flex">
                                        <div className="sheet-label-purple text-uppercase">{t('Construct.other.refits')}</div>
                                        <div className="sheet-data">{starship?.refitsAsString() ?? ""}</div>
                                    </div>)}

                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.traits')}</div>
                                <div className="sheet-data">{starship?.getAllTraits() ?? ""}</div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-2">

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.comms')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Comms)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.computer')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Computer)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.engines')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Engines)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.sensors')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Sensors)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.structure')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Structure)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.system.weapons')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.getSystemValue(System.Weapons)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.command')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Command]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.conn')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Conn]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.security')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Security]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.engineering')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Engineering]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.science')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Science]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.department.medicine')}</div>
                                            <div className="sheet-data text-center">
                                                {starship?.departments[Department.Medicine]}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                        <div className="col-md-6 mb-2">
                            <div className="sheet-panel d-flex">
                                <div className="sheet-label-purple text-uppercase">{t('Construct.other.talents')}</div>
                                <div className="sheet-data">
                                {talents}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era,
    };
}

export default connect(mapStateToProps)(StarshipProfile);