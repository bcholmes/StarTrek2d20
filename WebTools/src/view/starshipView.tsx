import React, { lazy, Suspense, useEffect, useState } from "react";
import { Starship } from "../common/starship";
import { CharacterType } from "../common/characterType";
import { Department } from "../helpers/departments";
import { System } from "../helpers/systems";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { useTranslation } from 'react-i18next';
import { makeKey } from "../common/translationKey";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";
import TalentsBlockView from "./talentsBlockView";
import WeaponBlockView from "./weaponBlockView";
import { LoadingButton } from "../common/loadingButton";

const OutlineImage = lazy(() => import(/* webpackChunkName: 'spaceframeOutline' */ '../components/outlineImage'));


const NBSP = '\u00A0';

interface IStarshipViewProperties {
    starship: Starship;
}

const StarshipView: React.FC<IStarshipViewProperties> = ({starship}) => {

    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        if (starship.name) {
            document.title = starship.name + " - STAR TREK ADVENTURES";
        }
    })

    const refitAsString = () => {
        let refitString = starship.refitsAsString();
        return  refitString === "" ? NBSP : refitString;
    }

    const showExportDialog = () => {
        setLoadingExport(true);
        import(/* webpackChunkName: 'export' */ '../components/characterSheetDialog').then(({CharacterSheetDialog}) => {
            import(/* webpackChunkName: 'export' */ '../helpers/sheets').then(({CharacterSheetRegistry}) => {
                setLoadingExport(false);
                CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(starship), "starship", starship);
            });
        });
    }

    const getAllTraits = () => {
        let traits = starship.getAllTraits();
        return traits === "" ? NBSP : traits;
    }

    const renderTalentNames = () => {
        return <TalentsBlockView construct={starship} />
    }

    const renderShields = () => {
        let shield = starship.shields;
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

    const renderWeapons = () => {
        return (<div><WeaponBlockView construct={starship} /></div>);
    }

    const showVttExportDialog = () => {
        VttSelectionDialog.instance.show(starship);
    }

    const { t } = useTranslation();

    let name = "";
    if (starship.name) {
        name = starship.name;

        if (starship.type === CharacterType.Starfleet && starship.registry) {
            name += ' • ' + starship.registry;
        }
    } else {
        name = t('ViewPage.unnamedStarship');
    }

    return (<main>
        <Header>{name}</Header>
        <div className="row mt-4" style={{alignItems: "baseline"}}>
            <div className="col-md-2 view-field-label pb-2">{t('Construct.other.spaceFrame')}:</div>
            <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{starship.localizedClassName ? starship.localizedClassName : NBSP}</div></div>

            <div className="col-md-2 view-field-label pb-2">{t('Construct.other.serviceDate')}:</div>
            <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{starship.serviceYear? starship.serviceYear : NBSP}</div></div>
        </div>

        <div className="row" style={{alignItems: "baseline"}}>
            <div className="col-md-2 view-field-label pb-2">{t('Construct.other.missionProfile')}:</div>
            <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{starship.missionProfileStep?.type ? starship.missionProfileStep?.type?.localizedName : NBSP}</div></div>

            <div className="col-md-2 view-field-label pb-2">{t('Construct.other.refits')}:</div>
            <div className="col-md-4 text-white"><div className="view-border-bottom pb-2 small">{refitAsString()}</div></div>
        </div>

        <div className="row" style={{alignItems: "baseline"}}>
            <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
            <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{getAllTraits()}</div></div>
        </div>

        <div className="row">
            <div className="col-xl-6 mt-4">
                <Header level={2}>{t('Construct.other.systems')}</Header>

                <div className="row row-cols-1 row-cols-md-3 mt-3">
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Comms]))} value={starship.getSystemValue(System.Comms)} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Engines]))} value={starship.getSystemValue(System.Engines)} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Structure]))} value={starship.getSystemValue(System.Structure)} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Computer]))} value={starship.getSystemValue(System.Computer)} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Sensors]))} value={starship.getSystemValue(System.Sensors)} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.system.', System[System.Weapons]))} value={starship.getSystemValue(System.Weapons)} className="col mb-2" />
                </div>

                <Header level={2} className="mt-4">{t('Construct.other.departments')}</Header>
                <div className="row row-cols-1 row-cols-md-3 mt-3">
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Command]))} value={starship.departments ? starship.departments[Department.Command] : undefined} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Security]))} value={starship.departments ? starship.departments[Department.Security] : undefined} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Science]))} value={starship.departments ? starship.departments[Department.Science] : undefined} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Conn]))} value={starship.departments ? starship.departments[Department.Conn] : undefined} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Engineering]))} value={starship.departments ? starship.departments[Department.Engineering] : undefined} className="col mb-2" />
                    <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Medicine]))} value={starship.departments ? starship.departments[Department.Medicine] : undefined} className="col mb-2" />
                </div>

                <div className="mt-3">
                    <Suspense fallback={<div className="mt-4 text-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}>
                        <OutlineImage starship={starship} size="lg" />
                    </Suspense>

                    <div className="row row-cols-1 row-cols-xl-3 mb-2">
                        <StatView showZero={true} name={t('Construct.other.resistance')} value={starship.resistance} className="col mb-2" colourClass="red" />
                        <StatView showZero={true} name={t('Construct.other.scale')} value={starship.scale} className="col mb-2" colourClass="red" />
                    </div>
                </div>
                {renderTalentNames()}

            </div>
            <div className="col-xl-6 mt-4">
                <div className="row">
                    <div className="col-xl-6">
                        <Header level={2}>{t('Construct.other.shields')}</Header>
                        {renderShields()}
                    </div>
                    <div className="col-xl-6">
                        <Header level={2}><>{t('Construct.other.power')} / {t('Construct.other.crew')}</></Header>
                        <div className="row row-cols-1 row-cols-1 mb-1 mt-3">
                            <StatView showZero={true} name={t('Construct.other.power')} value={starship.power} className="col" />
                        </div>
                        <div className="row row-cols-1 row-cols-1 mb-2">
                            <StatView showZero={true} name={t('Construct.other.crew')} value={starship.crewSupport} className="col" />
                        </div>
                    </div>
                </div>
                {renderWeapons()}
            </div>
        </div>

        <div className="button-container mt-5 mb-3">
            <LoadingButton loading={loadingExport} className="button-small me-3" onClick={() => showExportDialog() }>{t('Common.button.exportPdf')}</LoadingButton>
            <Button className="button-small me-3" onClick={() => showVttExportDialog() }>{t('Common.button.exportVtt')}</Button>
        </div>
    </main>);

}

export default StarshipView;