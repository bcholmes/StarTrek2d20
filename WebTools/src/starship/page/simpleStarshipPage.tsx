import React from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";

class SimpleStarshipPage extends React.Component<{}, {}> {

    render() {
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.StarshipTypeSelection)}>Starship Type</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Starship Stats</li>
                </ol>
            </nav>

        </div>);
    }
}

function mapStateToProps(state, ownProps) {
    return { 
        starship: state.starship.starship,
    };
}

export default connect(mapStateToProps)(SimpleStarshipPage);