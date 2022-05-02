import * as React from 'react';
import { connect } from 'react-redux';
import { navigateTo, Navigation } from '../../common/navigator';
import { Header } from '../../components/header';
import {IPageProperties} from '../../pages/iPageProperties';
import { PageIdentity } from '../../pages/pageIdentity';
import { StarSystem } from '../table/star';
import StarView from '../view/starView';
import WorldView from '../view/worldView';

interface IStarSystemDetailsPageProperties extends IPageProperties {
    starSystem?: StarSystem;
}

class StarSystemDetailsPage extends React.Component<IStarSystemDetailsPageProperties, {}> {

    render() {

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SystemGeneration)}>System Generation</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SectorDetails)}>Sector Details</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Star</li>
                    </ol>
                </nav>

                <Header>{this.renderTitle()}</Header>

                <div className="row mt-5">
                    <div className="col-md-2 view-field-label pb-2">Coordinates:</div>
                    <div className="col-md-4 text-white">
                        <div className="view-border-bottom pb-2">
                            {this.props.starSystem ? this.props.starSystem.sectorCoordinates.description : ""}
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6">
                        <StarView star={this.props.starSystem ? this.props.starSystem.star : undefined} title="Primary Star" />
                        <StarView star={this.props.starSystem ? this.props.starSystem.companionStar : undefined} title="Companion Star" />
                    </div>

                    <div className="col-md-6">
                        <Header level={2} className="mb-4">Worlds</Header>
                        {this.props.starSystem.world.map((w,i) => <WorldView world={w} key={'world-' + i}/>)}
                    </div>
                </div>

            </div>);
    }

    renderTitle() {
        let result = "Star System";
        if (this.props.starSystem) {
            return result + ' • ' + this.props.starSystem.id;
        } else {
            return result;
        }
    }

    navigateBack(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        event.stopPropagation();
        Navigation.navigateToPage(PageIdentity.SystemGeneration);
    }
}

function mapStateToProps(state, ownProps) {
    return { 
        starSystem: state.star.starSystem
    };
}

export default connect(mapStateToProps)(StarSystemDetailsPage);