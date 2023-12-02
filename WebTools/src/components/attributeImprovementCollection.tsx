import React from "react";
import { character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { AttributeImprovementRule } from "../helpers/tracks";
import AttributeImprovement from "./attributeImprovement";

export enum AttributeImprovementCollectionMode {
    Increase,
    Species,
    Customization,
    Academy,
    Ktarian,
}

interface AttributeImprovementCollectionProperties {
    points: number;
    mode: AttributeImprovementCollectionMode;
    onDone?: (done: boolean) => void;
    filter?: Attribute[];
    rule?: AttributeImprovementRule;
}

interface AttributeImprovementCollectionState {
    allocatedPoints: number;
}

export class AttributeImprovementCollection extends React.Component<AttributeImprovementCollectionProperties, AttributeImprovementCollectionState> {
    private _absoluteMax: number = 12;

    private _ktarianAttributes: Attribute[] = [Attribute.Fitness, Attribute.Presence];
    private initialValues: number[] = [];

    constructor(props: AttributeImprovementCollectionProperties) {
        super(props);

        if (character.age.isChild) {
            this._absoluteMax = 10;
        } else if (character.isYoung()) {
            this._absoluteMax = 11;
        }

        if (character.hasMaxedAttribute()) {
            this._absoluteMax--;
        }

        this.initialValues = character.attributes.map(a => a.value);
        this.state = {
            allocatedPoints: 0
        }
    }

    render() {
        const description = this.props.rule ? (<div>{this.props.rule.describe()}</div>) : null;

        const control = this.isShown(Attribute.Control) ? (<AttributeImprovement attribute={Attribute.Control}
            onIncrease={() => { this.onIncrease(Attribute.Control)}} onDecrease={() => { this.onDecrease(Attribute.Control)}}
            value={character.attributes[Attribute.Control].value}
            showIncrease={this.canIncrease(Attribute.Control)}  showDecrease={this.canDecrease(Attribute.Control)} />) : undefined;
        const daring = this.isShown(Attribute.Daring) ? (<AttributeImprovement attribute={Attribute.Daring}
            onIncrease={() => { this.onIncrease(Attribute.Daring)}} onDecrease={() => { this.onDecrease(Attribute.Daring)}}
            value={character.attributes[Attribute.Daring].value}
            showIncrease={this.canIncrease(Attribute.Daring)}  showDecrease={this.canDecrease(Attribute.Daring)} />) : undefined;
        const fitness = this.isShown(Attribute.Fitness) ? (<AttributeImprovement attribute={Attribute.Fitness}
            onIncrease={() => { this.onIncrease(Attribute.Fitness)}} onDecrease={() => { this.onDecrease(Attribute.Fitness)}}
            value={character.attributes[Attribute.Fitness].value}
            showIncrease={this.canIncrease(Attribute.Fitness)}  showDecrease={this.canDecrease(Attribute.Fitness)} />) : undefined;
        const insight = this.isShown(Attribute.Insight) ? (<AttributeImprovement attribute={Attribute.Insight}
            onIncrease={() => { this.onIncrease(Attribute.Insight)}} onDecrease={() => { this.onDecrease(Attribute.Insight)}}
            value={character.attributes[Attribute.Insight].value}
            showIncrease={this.canIncrease(Attribute.Insight)}  showDecrease={this.canDecrease(Attribute.Insight)} />) : undefined;
        const presence = this.isShown(Attribute.Presence) ? (<AttributeImprovement attribute={Attribute.Presence}
            onIncrease={() => { this.onIncrease(Attribute.Presence)}} onDecrease={() => { this.onDecrease(Attribute.Presence)}}
            value={character.attributes[Attribute.Presence].value}
            showIncrease={this.canIncrease(Attribute.Presence)}  showDecrease={this.canDecrease(Attribute.Presence)} />) : undefined;
        const reason = this.isShown(Attribute.Reason) ? (<AttributeImprovement attribute={Attribute.Reason}
            onIncrease={() => { this.onIncrease(Attribute.Reason)}} onDecrease={() => { this.onDecrease(Attribute.Reason)}}
            value={character.attributes[Attribute.Reason].value}
            showIncrease={this.canIncrease(Attribute.Reason)}  showDecrease={this.canDecrease(Attribute.Reason)} />) : undefined;

        return (
            <div>
                <div>
                    {control}
                    {daring}
                    {fitness}
                    {insight}
                    {presence}
                    {reason}
                </div>
                {description}
            </div>
        );
    }

    isShown(attribute: Attribute) {
        switch (this.props.mode) {
            case AttributeImprovementCollectionMode.Increase:
            case AttributeImprovementCollectionMode.Academy:
                return !this.props.filter || this.props.filter.indexOf(attribute) > -1;
            case AttributeImprovementCollectionMode.Ktarian:
                return this._ktarianAttributes.indexOf(attribute) >= 0;
            case AttributeImprovementCollectionMode.Species:
            case AttributeImprovementCollectionMode.Customization:
            default:
                return true;
        }
    }

    isRuleMet() {
        if (this.props.rule) {
            let result = false;
            this.props.rule.attributes.forEach(a => {result = result || (this.initialValues[a] < character.attributes[a].value) });
            return result;
        } else {
            return true;
        }
    }

    canIncrease(attribute: Attribute) {
        switch (this.props.mode) {
            case AttributeImprovementCollectionMode.Academy:
                if (this.state.allocatedPoints === this.props.points) {
                    return false;
                } else if (this.isRuleMet() || (this.props.points - this.state.allocatedPoints > 1)) {
                    return character.attributes[attribute].value < this._absoluteMax
                        && (character.attributes[attribute].value - this.initialValues[attribute] < (this.props.points -1));
                } else if (this.props.rule.attributes.indexOf(attribute) >= 0) {
                    return character.attributes[attribute].value < this._absoluteMax;
                } else {
                    return false;
                }
            case AttributeImprovementCollectionMode.Species:
                // "Species" is used when a player selects "Human" on the Species page. The rule is that only one point can be
                // added to an attribute
                return character.attributes[attribute].value < this._absoluteMax && this.state.allocatedPoints < this.props.points
                    && (character.attributes[attribute].value - this.initialValues[attribute] < 1);
            case AttributeImprovementCollectionMode.Customization:
                // "Customization" Mode is used on the "finishing touches" screen. Two points must be spent on two different
                // attributes. Any other points can be distributed freely.
                return character.attributes[attribute].value < this._absoluteMax && this.state.allocatedPoints < this.props.points
                    && (character.attributes[attribute].value - this.initialValues[attribute] < (this.props.points - 1));
            default:
                return character.attributes[attribute].value < this._absoluteMax && this.state.allocatedPoints < this.props.points;
        }
    }

    canDecrease(attribute: Attribute) {
        return character.attributes[attribute].value > this.initialValues[attribute] && this.state.allocatedPoints > 0;
    }


    onDecrease(attr: Attribute) {
        let points = this.state.allocatedPoints;
        character.attributes[attr].value = character.attributes[attr].value - 1;

        points--;
        if (this.props.onDone) {
            this.props.onDone(points === this.props.points);
        }

        this.setState((state) => ({ ...state, allocatedPoints: points }));
    }

    onIncrease(attr: Attribute) {
        let points = this.state.allocatedPoints;
        character.attributes[attr].value = character.attributes[attr].value + 1;

        points++;

        if (this.props.onDone) {
            this.props.onDone(points === this.props.points);
        }

        this.setState((state) => ({ ...state, allocatedPoints: points }));
    }
}
