import React from "react";
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import { navigateTo, Navigation } from "../../common/navigator";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { setSectorName, setStar } from "../../state/starActions";
import store from "../../state/store";
import { Sector, StarSystem } from "../table/star";
import { EditableHeader } from "../view/editableHeader";
import LcarsDecorationLeftView from "../view/lcarsDecorationLeft";
import LcarsDecorationRightView from "../view/lcarsDecorationRight";
import SectorMapView from "../view/sectorMapView";
import SystemView from "../view/systemView";
import { Button } from "../../components/button";

interface ISectorDetailsPageProperties extends IPageProperties {
    sector: Sector;
}

class SectorDetailsPage extends React.Component<ISectorDetailsPageProperties, {}> {

    render() {
        return this.props.sector 
        ?   (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SystemGeneration)}>System Generation</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Sector Details</li>
                    </ol>
                </nav>

                <EditableHeader prefix="Sector" text={this.props.sector.name} onChange={(text) => this.setSectorName(text)}/>
                <div className="d-flex justify-content-center">
                    <LcarsDecorationLeftView />
                    <SectorMapView sector={this.props.sector} onClick={(s) => this.showSystem(s) } />
                    <LcarsDecorationRightView />
                </div>
                <Header level={2} className="mb-5 mt-4">Notable Systems</Header>
                <div>
                    <table className="selection-list">
                        <thead>
                            <tr>
                                <td>System Identifier</td>
                                <td>Primary Star</td>
                                <td>Worlds</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.sector.systems.map((s, i) => (<SystemView system={s} key={'system-' + i} onClick={() => this.showSystem(s) }/>))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3">
                    <Button onClick={() => this.copyDetailsToClipboard()} text="Copy to Clipboard" className="button-small" buttonType={true} />
                </div>
            </div>)
        : null;
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

export default connect(mapStateToProps)(SectorDetailsPage);