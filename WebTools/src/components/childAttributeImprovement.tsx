import React from "react";
import { character } from "../common/character";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import AttributeImprovement from "./attributeImprovement";



interface IChildAttributeImprovementCollectionProperties {
    onChange: (allDecreases: boolean, allIncreases: boolean) => void;
    decreasePoints: number;
}

interface IChildAttributeImprovementCollectionState {
    decreases: Attribute[];
    increases: Attribute[];
}

export class ChildAttributeImprovementCollection extends React.Component<IChildAttributeImprovementCollectionProperties, IChildAttributeImprovementCollectionState> {

    private initialValues: number[] = [];

    constructor(props) {
        super(props);

        character.attributes.forEach(a => { this.initialValues.push(a.value) });

        this.state = {
            increases: [],
            decreases: []
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div className="desc-text mt-2 mb-2">
                        Decrease {this.props.decreasePoints === 1 ? " 1 attribute " : (" " + this.props.decreasePoints + " attributes ")}
                        to reflect the young age of the character:
                    </div>
                    <AttributeImprovement attribute={Attribute.Control}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Control)}} onDecrease={() => { this.onReductionDecrease(Attribute.Control)}}
                        value={character.attributes[Attribute.Control].value}
                        showIncrease={this.canReductionIncrease(Attribute.Control)}  showDecrease={this.canReductionDecrease(Attribute.Control)} />
                    <AttributeImprovement attribute={Attribute.Daring}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Daring)}} onDecrease={() => { this.onReductionDecrease(Attribute.Daring)}}
                        value={character.attributes[Attribute.Daring].value}
                        showIncrease={this.canReductionIncrease(Attribute.Daring)}  showDecrease={this.canReductionDecrease(Attribute.Daring)} />
                    <AttributeImprovement attribute={Attribute.Fitness}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Fitness)}} onDecrease={() => { this.onReductionDecrease(Attribute.Fitness)}}
                        value={character.attributes[Attribute.Fitness].value}
                        showIncrease={this.canReductionIncrease(Attribute.Fitness)}  showDecrease={this.canReductionDecrease(Attribute.Fitness)} />
                    <AttributeImprovement attribute={Attribute.Insight}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Insight)}} onDecrease={() => { this.onReductionDecrease(Attribute.Insight)}}
                        value={character.attributes[Attribute.Insight].value}
                        showIncrease={this.canReductionIncrease(Attribute.Insight)}  showDecrease={this.canReductionDecrease(Attribute.Insight)} />
                    <AttributeImprovement attribute={Attribute.Presence}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Presence)}} onDecrease={() => { this.onReductionDecrease(Attribute.Presence)}}
                        value={character.attributes[Attribute.Presence].value}
                        showIncrease={this.canReductionIncrease(Attribute.Presence)}  showDecrease={this.canReductionDecrease(Attribute.Presence)} />
                    <AttributeImprovement attribute={Attribute.Reason}
                        onIncrease={() => { this.onReductionIncrease(Attribute.Reason)}} onDecrease={() => { this.onReductionDecrease(Attribute.Reason)}}
                        value={character.attributes[Attribute.Reason].value}
                        showIncrease={this.canReductionIncrease(Attribute.Reason)}  showDecrease={this.canReductionDecrease(Attribute.Reason)} />

                    <div className="desc-text mt-2 mb-2">Distribute 3 points among 2 or 3 attributes (either +2 in one and +1 in another, or +1 to three):</div>
                    <AttributeImprovement attribute={Attribute.Control}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Control)}} onDecrease={() => { this.onStandardDecrease(Attribute.Control)}}
                        value={character.attributes[Attribute.Control].value}
                        showIncrease={this.canStandardIncrease(Attribute.Control)}  showDecrease={this.canStandardDecrease(Attribute.Control)} />
                    <AttributeImprovement attribute={Attribute.Daring}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Daring)}} onDecrease={() => { this.onStandardDecrease(Attribute.Daring)}}
                        value={character.attributes[Attribute.Daring].value}
                        showIncrease={this.canStandardIncrease(Attribute.Daring)}  showDecrease={this.canStandardDecrease(Attribute.Daring)} />
                    <AttributeImprovement attribute={Attribute.Fitness}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Fitness)}} onDecrease={() => { this.onStandardDecrease(Attribute.Fitness)}}
                        value={character.attributes[Attribute.Fitness].value}
                        showIncrease={this.canStandardIncrease(Attribute.Fitness)}  showDecrease={this.canStandardDecrease(Attribute.Fitness)} />
                    <AttributeImprovement attribute={Attribute.Insight}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Insight)}} onDecrease={() => { this.onStandardDecrease(Attribute.Insight)}}
                        value={character.attributes[Attribute.Insight].value}
                        showIncrease={this.canStandardIncrease(Attribute.Insight)}  showDecrease={this.canStandardDecrease(Attribute.Insight)} />
                    <AttributeImprovement attribute={Attribute.Presence}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Presence)}} onDecrease={() => { this.onStandardDecrease(Attribute.Presence)}}
                        value={character.attributes[Attribute.Presence].value}
                        showIncrease={this.canStandardIncrease(Attribute.Presence)}  showDecrease={this.canStandardDecrease(Attribute.Presence)} />
                    <AttributeImprovement attribute={Attribute.Reason}
                        onIncrease={() => { this.onStandardIncrease(Attribute.Reason)}} onDecrease={() => { this.onStandardDecrease(Attribute.Reason)}}
                        value={character.attributes[Attribute.Reason].value}
                        showIncrease={this.canStandardIncrease(Attribute.Reason)}  showDecrease={this.canStandardDecrease(Attribute.Reason)} />
                </div>
            </div>
        );
    }

    onStandardIncrease(attribute: Attribute) {
        let attributes = this.state.increases;
        attributes.push(attribute);
        this.setState((state) => ({
            ...state,
            increases: attributes
        }));
        this.applyValues(this.state.decreases, attributes);
    }

    onReductionDecrease(attribute: Attribute) {
        let attributes = this.state.decreases;
        attributes.push(attribute);
        this.setState((state) => ({
            ...state,
            decreases: attributes
        }));
        this.applyValues(attributes, this.state.increases);
    }


    onReductionIncrease(attribute: Attribute) {
        let attributes = this.state.decreases;
        let index = attributes.indexOf(attribute);
        if (index >= 0) {
            attributes.splice(index, 1);
        }
        this.setState((state) => ({
            ...state,
            decreases: attributes
        }));
        this.applyValues(attributes, this.state.increases);
    }

    onStandardDecrease(attribute: Attribute) {
        let attributes = this.state.increases;
        let index = attributes.indexOf(attribute);
        if (index >= 0) {
            attributes.splice(index, 1);
        }
        this.setState((state) => ({
            ...state,
            increases: attributes
        }));
        this.applyValues(this.state.decreases, attributes);
    }

    canStandardIncrease(attribute: Attribute) {
        if (this.state.increases.length === 3) {
            return false;
        } else if (this.state.increases.indexOf(attribute) >= 0 && this.hasRepeat(this.state.increases)) {
            return false;
        } else if (character.attributes[attribute].value >= 10) {
            return false;
        } else {
            return true;
        }
    }

    canReductionIncrease(attribute: Attribute) {
        return this.state.decreases.indexOf(attribute) >= 0;
    }

    canStandardDecrease(attribute: Attribute) {
        return this.state.increases.indexOf(attribute) >= 0;
    }

    canReductionDecrease(attribute: Attribute) {
        if (this.state.decreases.length === this.props.decreasePoints) {
            return false;
        } else {
            return this.state.decreases.indexOf(attribute) < 0;
        }
    }

    hasRepeat(attributes: Attribute[]) {
        let temp: Attribute[] = [];
        let result = false;
        attributes.forEach(a => {
            if (temp.indexOf(a) >= 0) {
                result = true;
            } else {
                temp.push(a);
            }
        })
        return result;
    }

    applyValues(decreases: Attribute[], increases: Attribute[]) {
        AttributesHelper.getAllAttributes().forEach(a => {
            character.attributes[a].value = this.initialValues[a];
        });
        decreases.forEach(a => {
            character.attributes[a].value -= 1;
        });
        increases.forEach(a => {
            character.attributes[a].value += 1;
        });
        this.props.onChange(decreases.length === this.props.decreasePoints, increases.length === 3);
    }
}
