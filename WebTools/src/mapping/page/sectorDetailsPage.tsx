import React from "react";
import { connect } from "react-redux";
import { preventDefaultAnchorEvent } from "../../common/navigator";
import { Header } from "../../components/header";
import { setSectorName, setStar } from "../../state/starActions";
import store from "../../state/store";
import { EditableHeader } from "../view/editableHeader";
import LcarsDecorationLeftView from "../view/lcarsDecorationLeft";
import LcarsDecorationRightView from "../view/lcarsDecorationRight";
import SectorMapView from "../view/sectorMapView";
import SystemView from "../view/systemView";
import { Button } from "../../components/button";
import { Sector } from "../table/sector";
import { StarSystem } from "../table/starSystem";
import { PDFDocument } from "pdf-lib";
import { PdfExporter } from "../export/pdfExporter";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

declare function download(bytes: any, fileName: any, contentType: any): any;

interface ISectorDetailsPageProperties {
    sector: Sector;
}

const SectorDetailsPage: React.FC<ISectorDetailsPageProperties> = ({sector}) => {

    const exportPdf = async () => {
        const existingPdfBytes = await fetch("/static/pdf/TNG_Sector_Map.pdf").then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        await new PdfExporter().populate(pdfDoc, sector);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, "Sector-" + sector.name + ".pdf", "application/pdf");
    }

    const showSystem = (system: StarSystem) => {
        store.dispatch(setStar(system));
        navigate("/starSystemDetails");
    }

    const setSectorNameHandler = (text: string) => {
        store.dispatch(setSectorName(text));
    }

    const navigate = useNavigate();
    const { t } = useTranslation();
    return sector
    ?   (<div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html"onClick={(event) =>
                            preventDefaultAnchorEvent(event, () => navigate("/"))}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(event) =>
                            preventDefaultAnchorEvent(event, () => navigate("/systemGenerator"))}>{t('Page.title.systemGeneration')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.sectorDetails')}</li>
                </ol>
            </nav>

            <EditableHeader prefix="Sector" text={sector.name} onChange={setSectorNameHandler}/>
            <div className="d-flex justify-content-center">
                <div className="d-md-block d-none">
                    <LcarsDecorationLeftView />
                </div>
                <SectorMapView sector={sector} onClick={(s) => showSystem(s) } />
                <div className="d-md-block d-none">
                    <LcarsDecorationRightView />
                </div>
            </div>
            <Header level={2} className="mb-5 mt-4">Notable Systems</Header>
            <div>
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td>System Identifier</td>
                            <td>{t('StarSystem.common.primaryStar')}</td>
                            <td className="text-center">{t('StarSystem.common.worlds')}</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {sector.systems.map((s, i) => (<SystemView system={s} key={'system-' + i} onClick={() => showSystem(s) }/>))}
                    </tbody>
                </table>
            </div>
            <div className="mt-3">
                <Button onClick={() => exportPdf()} className="button-small me-2" buttonType={true}>{t('Common.button.exportPdf')}</Button>
            </div>
        </div>)
    : null;
}

function mapStateToProps(state, ownProps) {
    return {
        sector: state.star.sector
    };
}

export default connect(mapStateToProps)(SectorDetailsPage);