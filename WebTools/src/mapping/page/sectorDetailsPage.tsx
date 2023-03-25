import React from "react";
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import { navigateTo, Navigation } from "../../common/navigator";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
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
import { withTranslation, WithTranslation } from "react-i18next";

declare function download(bytes: any, fileName: any, contentType: any): any;

interface ISectorDetailsPageProperties extends WithTranslation {
    sector: Sector;
}

class SectorDetailsPage extends React.Component<ISectorDetailsPageProperties, {}> {

    render() {
        const { t } = this.props;
        return this.props.sector
        ?   (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SystemGeneration)}>{t('Page.title.systemGeneration')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.sectorDetails')}</li>
                    </ol>
                </nav>

                <EditableHeader prefix="Sector" text={this.props.sector.name} onChange={(text) => this.setSectorName(text)}/>
                <div className="d-flex justify-content-center">
                    <div className="d-md-block d-none">
                        <LcarsDecorationLeftView />
                    </div>
                    <SectorMapView sector={this.props.sector} onClick={(s) => this.showSystem(s) } />
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
                            {this.props.sector.systems.map((s, i) => (<SystemView system={s} key={'system-' + i} onClick={() => this.showSystem(s) }/>))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3">
                    <Button onClick={() => this.exportPdf()} text={t('Common.button.exportPdf')} className="button-small mr-2" buttonType={true} />
                </div>
            </div>)
        : null;
    }

    async exportPdf() {
        const existingPdfBytes = await fetch("/static/pdf/TNG_Sector_Map.pdf").then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        await new PdfExporter().populate(pdfDoc, this.props.sector);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, "Sector-" + this.props.sector.name + ".pdf", "application/pdf");
    }

    copyDetailsToClipboard() {
        copy(this.props.sector.plainText, {
            debug: true,
            message: 'Press #{key} to copy',});
    }

    showSystem(system: StarSystem) {
        store.dispatch(setStar(system));
        Navigation.navigateToPage(PageIdentity.StarSystemDetails);
    }

    setSectorName(text: string) {
        store.dispatch(setSectorName(text));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        sector: state.star.sector
    };
}

export default withTranslation()(connect(mapStateToProps)(SectorDetailsPage));