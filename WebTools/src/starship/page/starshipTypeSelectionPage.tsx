import React from "react";
import { connect } from "react-redux";
import { CharacterType, CharacterTypeModel } from "../../common/characterType";
import { navigateTo, Navigation } from "../../common/navigator";
import { Button } from "../../components/button";
import { DropDownInput } from "../../components/dropDownInput";
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
    serviceYear: number
}

class StarshipTypeSelectionPage extends React.Component<StarshipTypeSelectionPageProperties, StarshipTypeSelectionPageState> {

    constructor(props) {
        super(props);
        this.state = {
            type: CharacterTypeModel.getStarshipTypes()[0],
            serviceYear: this.eraDefaultYear(this.props.era)
        }
    }

    render() {
        let typeSelection = hasSource(Source.KlingonCore) 
        ? (<div className="panel">
                <div className="header-small">Ship Type</div>
                <div className="page-text-aligned">
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
        if (this.state.type != null && this.state.type.type === CharacterType.Other) {
            store.dispatch(createNewStarship(this.state.type.type, this.state.serviceYear));
            Navigation.navigateToPage(PageIdentity.SimpleStarship);
        } else if (this.state.type != null) {
            store.dispatch(createNewStarship(this.state.type.type, this.state.serviceYear));
            Navigation.navigateToPage(PageIdentity.Starship);
        }
    }

    renderServiceYear() {
        return (<div className="panel">
                    <SmallHeader>Year of Service</SmallHeader>
                    <div className="page-text-aligned">
                        The year in which the ship exists determines available options.
                        Choose which year you want to play in together with your GM.
                        A default year will be filled in automatically dependent on the chosen Era.
                    </div>
                    <div className="textinput-label">YEAR</div>
                    <input
                        type="number"
                        defaultValue={this.state.serviceYear.toString()}
                        onChange={(e) => {
                            let value = e.target.value;
                            this.setState((state) => ({...state, serviceYear: parseInt(value)}))
                        } }
                        />
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