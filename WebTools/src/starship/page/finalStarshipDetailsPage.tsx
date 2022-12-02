import React from "react";
import { connect } from "react-redux";
import { CharacterType } from "../../common/characterType";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { CharacterSheetDialog } from "../../components/characterSheetDialog";
import { Header } from "../../components/header";
import { Era } from "../../helpers/eras";
import { marshaller } from "../../helpers/marshaller";
import { CharacterSheetRegistry } from "../../helpers/sheets";
import { setStarshipName, setStarshipRegistry, setStarshipTraits } from "../../state/starshipActions";
import store from "../../state/store";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IFinalStarshipDetailsPageProperties {
    starship: Starship;
    era: Era;
}

class FinalStarshipDetailsPage extends React.Component<IFinalStarshipDetailsPageProperties, {}> {

    render() {
        return (<div className="page container ml-0">
                <ShipBuildingBreadcrumbs />
                <Header>Final Starship Details</Header>

                <p>Your ship is almost complete. It just needs a few final touches.</p>

                <div className="row">

                    <div className="col-lg-6 mt-3 mb-4">
                        <Header level={2}>Name</Header>
                        <p>
                            Every Starship needs a name.
                            There is no universal convention for the naming of ships, often naming them after locations, important historical persons
                            (normally only the person’s surname), ancient ships, mythical figures, or even more abstract ideals, virtues, or concepts.
                            In many cases, these vague naming conventions overlap — a ship may be named after an ancient ship that was itself named
                            after a location, for example — but this shouldn’t cause any issues.
                        </p>
                        <p>
                            The name should ideally be a single word or, more rarely, two.
                        </p>
                        <div className="d-sm-flex align-items-stretch">
                            <label className="textinput-label">NAME</label>
                            <input
                                type="text"
                                onChange={(ev) => store.dispatch(setStarshipName(ev.target.value)) }
                                value={this.props.starship.name} />
                        </div>

                        {this.renderRegistry()}

                    </div>

                    <div className="col-lg-6 mt-3">
                        <Header level={2}>Traits</Header>
                        <p>
                            You may now define additional Traits for your starship.
                            Your starship already has these traits:
                        </p>
                            <ul>
                                {this.props.starship.defaultTraits.length > 0
                                    ? this.props.starship.defaultTraits.map((t, i) => {
                                        return (
                                            <li key={'trait-' + i}>
                                                {t}
                                            </li>
                                        );
                                    })
                                    : (<li key="no-trait">None</li>)
                                }
                            </ul>
                        <p>
                            Your GM may allow you to pick additional traits that describe your
                            vessel. Examples include: Prototype, Legacy Vessel, Renowned and Long-Serving.
                        </p>
                        <textarea
                            rows={8}
                            onChange={(ev) => store.dispatch(setStarshipTraits(ev.target.value)) }
                            onBlur={(ev) => {
                                let temp = ev.target.value.replace(/\n/g, ', ');
                                store.dispatch(setStarshipTraits(temp));
                            } }
                            value={this.props.starship.traits} />
                    </div>
                </div>

                <div className="starship-panel mt-5">
                    <div className="button-container mb-3">
                        <Button text="Export to PDF" className="button-small mr-2 mb-2" onClick={() => this.showExportDialog() } buttonType={true} />
                        <Button text="View" className="button-small mr-2 mb-2" onClick={() => this.showViewPage() } buttonType={true} />
                    </div>
                </div>
            </div>);
    }

    renderRegistry() {
        if (this.props.starship.type !== CharacterType.KlingonWarrior) {
            return (<div className="mt-5">

                <Header level={2}>Registry</Header>
                <p>
                    Many ships have some kind of registry number to go with the name.
                    Federation starships, for example, have a registry number that starts with NCC.
                </p>
                <div className="d-sm-flex align-items-stretch">
                    <label className="textinput-label">REGISTRY</label>
                    <input
                        type="text"
                        onChange={(ev) => store.dispatch(setStarshipRegistry(ev.target.value)) }
                        value={this.props.starship.registry} />
                </div>
            </div>);
        } else {
            return undefined;
        }
    }

    showViewPage() {
        const value = marshaller.encodeStarship(this.props.starship);
        window.open('/view?s=' + value, "_blank");
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(this.props.starship, this.props.era), "starship", this.props.starship);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        era: state.context.era
    };
}

export default connect(mapStateToProps)(FinalStarshipDetailsPage);