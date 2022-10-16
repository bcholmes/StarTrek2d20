import React from "react";
import { CharacterType } from "../../common/characterType";
import { navigateTo, Navigation } from "../../common/navigator";
import { SimpleStats } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
import { createNewStarship } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";

interface IStarshipToolPageState {
    showStandardDescription: boolean;
    showSimplifiedDescription: boolean;
}

export class SelectStarshipToolPage extends React.Component<{}, IStarshipToolPageState> {

    constructor(props) {
        super(props);
        this.state = {
            showStandardDescription: false,
            showSimplifiedDescription: false
        }
    }

    render() {
        return (
            <div className="page">
                <div className="container ml-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Starship Tool Selection</li>
                        </ol>
                    </nav>

                    <Header>Starship Tool Selection</Header>

                    <div className="page-text">
                        Select an option
                    </div>
                    <div className="button-container">
                        <div className="d-flex align-items-center my-4">
                            <div className="mr-5">
                                <Button className="button mt-0" onClick={() => { this.goToPage(PageIdentity.StarshipTypeSelection); } }
                                    onMouseOver={() => this.setState((state) => ({...state, showStandardDescription: true}))}
                                    onMouseOut={() => this.setState((state) => ({...state, showStandardDescription: false}))}
                                >Standard Build</Button>
                            </div>
                            <p className={this.state.showStandardDescription ? 'mb-0' : 'd-none'}>Use the standard Starship
                                creation process(es), as outlined in the rulebooks. E.g.: starships choose a Spaceframe, Mission Profile, etc.
                            </p>
                        </div>
                        <div className="d-flex align-items-center my-4">
                            <div className="mr-5">
                                <Button className="button mt-0" onClick={() => { this.startSimplifiedWorkflow(); } }
                                    onMouseOver={() => this.setState((state) => ({...state, showSimplifiedDescription: true}))}
                                    onMouseOut={() => this.setState((state) => ({...state, showSimplifiedDescription: false}))}
                                >Simplified Build</Button>
                            </div>
                            <p className={this.state.showSimplifiedDescription ? 'mb-0' : 'd-none'}>
                                This is a good option for transcribing a set of stats, say from an online source or other other reference.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    startSimplifiedWorkflow() {
        let workflow = ShipBuildWorkflow.createSimpleBuildWorkflow();
        let stats = new SimpleStats();
        stats.systems = [7, 7, 7, 7, 7, 7];
        stats.scale = 3;
        store.dispatch(createNewStarship(CharacterType.Other, undefined, stats, workflow));
        let page =workflow.currentStep().page;
        this.goToPage(page);
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
