import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { Sector } from "../table/star";
import SectorMapView from "../view/sectorMapView";
import SystemView from "../view/systemView";

interface ISectorDetailsPageProperties extends IPageProperties {
    sector: Sector;
}

class SectorDetailsPage extends React.Component<ISectorDetailsPageProperties, {}> {

    render() {
        return this.props.sector 
        ?   (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item"><a href="#" onClick={(e) => this.navigateBack(e)}>System Generation</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Sector</li>
                    </ol>
                </nav>

                <Header>Sector • {this.props.sector.id}</Header>
                <SectorMapView sector={this.props.sector} />
                <div className="row row-cols-1 row-cols-md-2 mt-3">
                    {this.props.sector.systems.map((s, i) => (<div className="col"><SystemView system={s} key={'system-' + i} /></div>))}
                </div>
            </div>)
        : null;
    }

    navigateBack(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        event.stopPropagation();
        Navigation.navigateToPage(PageIdentity.SystemGeneration);
    }
}

function mapStateToProps(state, ownProps) {
    return { 
        sector: state.star.sector
    };
}

export default connect(mapStateToProps)(SectorDetailsPage);