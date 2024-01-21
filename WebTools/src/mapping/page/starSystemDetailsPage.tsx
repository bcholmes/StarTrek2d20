import React from 'react';
import { connect } from 'react-redux';
import { preventDefaultAnchorEvent } from '../../common/navigator';
import { Button } from '../../components/button';
import { Header } from '../../components/header';
import { setStarSystemName } from '../../state/starActions';
import store from '../../state/store';
import { PdfExporter } from '../export/pdfExporter';
import { StarSystem } from '../table/starSystem';
import { EditableHeader } from '../view/editableHeader';
import NotablePhenomenonView from '../view/notablePhenomenonView';
import StarView from '../view/starView';
import SystemMapLowerView from '../view/systemMapLowerView';
import SystemMapUpperView from '../view/systemMapUpperView';
import WorldView from '../view/worldView';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

declare function download(bytes: any, fileName: any, contentType: any): any;

interface IStarSystemDetailsPageProperties {
    starSystem?: StarSystem;
}

const StarSystemDetailsPage: React.FC<IStarSystemDetailsPageProperties> = ({starSystem}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()

    const renderWorlds = (title: string, from: number, to?: number) => {
        let worlds = starSystem.worldsAndSatelliteWorlds.filter(w => w.orbitalRadius >= from && (to == null || w.orbitalRadius < to));
        if (worlds.length > 0) {
            let list = worlds.map((w,i) => <WorldView world={w} system={starSystem} key={'world-' + w.orbitId}/>);
            return (<div>
                <div className="page-text my-3">{title}</div>
                <div className="row row-cols-1 row-cols-md-2">
                    {list}
                </div>
            </div>);
        } else {
            return undefined;
        }
    }

    const exportPdf = async () => {

        let pdfDoc = await new PdfExporter().createStarSystemPdf(starSystem);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, "System-" + starSystem.name + ".pdf", "application/pdf");
    }

    if (!starSystem) {
        navigate("/systemGenerator");
    } else {
        return (
            <div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/systemGenerator"))}>{t('Page.title.systemGeneration')}</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/sectorDetails"))}>{t('Page.title.sectorDetails')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.starSystemDetails')}</li>
                    </ol>
                </nav>

                <EditableHeader prefix="System" text={starSystem.name} onChange={(text) => store.dispatch(setStarSystemName(text))}/>

                <div className="row my-4">
                    <div className="col-md-2 view-field-label pb-2">{t('StarSystem.common.coordinates') + ":"}</div>
                    <div className="col-md-4 text-white">
                        <div className="view-border-bottom pb-2">
                            {starSystem ? starSystem.sectorCoordinates.description : ""}
                        </div>
                    </div>
                </div>

                <div className="my-4 d-none d-md-block">
                    <SystemMapUpperView system={starSystem} />
                    <SystemMapLowerView system={starSystem} />
                </div>

                <div>
                    <div className="row row-cols-1 row-cols-md-2">
                        <NotablePhenomenonView phenomenon={starSystem ? starSystem.phenomenon : undefined} />
                        <StarView star={starSystem ? starSystem.star : undefined} title={t('StarSystem.common.primaryStar')} />
                        <StarView star={starSystem ? starSystem.companionStar : undefined} title={t('StarSystem.common.companionStar')}
                            companionType={starSystem.companionType} orbitalRadius={starSystem.companionOrbitalRadius}/>
                    </div>
                </div>
                <div className="mt-5">
                    <Header level={2} className="mb-4">{t('StarSystem.common.worlds')}</Header>
                    <div>
                        {renderWorlds(t('StarSystem.common.innerZone'), 0, starSystem.gardenZoneInnerRadius)}
                        {renderWorlds(t('StarSystem.common.ecosphere'), starSystem.gardenZoneInnerRadius, starSystem.gardenZoneOuterRadius)}
                        {renderWorlds(t('StarSystem.common.outerZone'), starSystem.gardenZoneOuterRadius)}
                    </div>
                </div>

                <div>
                    <Button buttonType={true} className="me-2 btn btn-primary btn-sm" text="Back to Sector" onClick={() => navigate("/sectorDetails") } />
                    <Button onClick={() => exportPdf()} text={t('Common.button.exportPdf')} className="btn btn-primary btn-sm me-2" buttonType={true} />
                </div>
            </div>);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starSystem: state.star.starSystem
    };
}

export default connect(mapStateToProps)(StarSystemDetailsPage);