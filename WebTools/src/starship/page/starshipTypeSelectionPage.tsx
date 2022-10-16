import React from "react";
import { connect } from "react-redux";
import { CharacterTypeModel } from "../../common/characterType";
import { navigateTo, Navigation } from "../../common/navigator";
import { Button } from "../../components/button";
import { DropDownInput } from "../../components/dropDownInput";
import { Header } from "../../components/header";
import { SmallHeader } from "../../components/smallHeader";
import { Era } from "../../helpers/eras";
import { Source } from "../../helpers/sources";
import { PageIdentity } from "../../pages/pageIdentity";
import { hasSource } from "../../state/contextFunctions";
import { createNewStarship } from "../../state/starshipActions";
import store from "../../state/store";

interface StarshipTypeSelectionPageProperties {
    era: Era
}
interface StarshipTypeSelectionPageState {
    type?: CharacterTypeModel;
    campaignYear: number
}

class StarshipTypeSelectionPage extends React.Component<StarshipTypeSelectionPageProperties, StarshipTypeSelectionPageState> {

    constructor(props) {
        super(props);
        this.state = {
            type: CharacterTypeModel.getStarshipTypes()[0],
            campaignYear: this.eraDefaultYear(this.props.era)
        }
    }

    render() {
        let typeSelection = hasSource(Source.KlingonCore)
        ? (<div className="my-5">
                <div className="header-small">Ship Type</div>
                <div className="page-text">
                    What type of starship is this?
                </div>
                <div>
                    <DropDownInput
                        items={ CharacterTypeModel.getStarshipTypes().map((t, i) => t.name) }
                        defaultValue={ this.state.type.name }
                        onChange={(index) => this.selectType(CharacterTypeModel.getStarshipTypes()[index] ) }/>
                </div>
            </div>)
        : undefined;

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Starship Creation</li>
                    </ol>
                </nav>

                <Header>Starship Type Selection</Header>
                <div>
                    {typeSelection}
                    {this.renderServiceYear()}
                    <Button onClick={() => this.startWorkflow()} text='CREATE' />
                </div>
            </div>
        );
    }

    selectType(typeModel: CharacterTypeModel) {
        this.setState((state) => ({...state, type: typeModel}));
    }

    startWorkflow() {
//        if (this.state.type != null && this.state.type.type === CharacterType.Other) {
//            let workflow = ShipBuildWorkflow.createSimpleBuildWorkflow();
//            let stats = new SimpleStats();
//            stats.systems = [7, 7, 7, 7, 7, 7];
//            stats.scale = 4;
//            store.dispatch(createNewStarship(this.state.type.type, this.state.campaignYear, stats, workflow));
//            Navigation.navigateToPage(workflow.currentStep().page);
//       } else if (this.state.type != null) {
            store.dispatch(createNewStarship(this.state.type.type, this.state.campaignYear));
            Navigation.navigateToPage(PageIdentity.Starship);
//        }
    }

    renderServiceYear() {
        return (<div>
                    <SmallHeader>Campaign Year</SmallHeader>
                    <div className="page-text">
                        <p>What is the current year in your campaign? You'll probably need to consult your GM.</p>
                        <p>A default year will be filled in automatically dependent on the chosen Era.</p>
                    </div>
                    <div className="d-sm-flex align-items-stretch">
                        <label htmlFor="campaignYear" className="textinput-label">YEAR</label>
                        <input
                            id="campaignYear"
                            type="number"
                            defaultValue={this.state.campaignYear.toString()}
                            onChange={(e) => {
                                let value = e.target.value;
                                this.setState((state) => ({...state, campaignYear: parseInt(value)}))
                            } }
                            />
                    </div>
                </div>);
    }

    private eraDefaultYear(era: Era) {
        switch (era) {
            case Era.Enterprise:
                return 2155;
            case Era.OriginalSeries:
                return 2269;
            case Era.NextGeneration:
                return 2371;
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era
    };
}

export default connect(mapStateToProps)(StarshipTypeSelectionPage);