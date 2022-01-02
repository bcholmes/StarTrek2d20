import * as React from 'react';
import {System} from '../helpers/systems';
import {SpaceframeHelper} from '../helpers/spaceframes';
import {character} from '../common/character';

interface IRefitImprovementProperties {
    controller: Refits;
    system: System;
    value: number;
    showIncrease: boolean;
    showDecrease: boolean;
}

export class Refit extends React.Component<IRefitImprovementProperties, {}> {
    render() {
        const {system, value, showDecrease, showIncrease} = this.props;

        const dec = showDecrease
            ? (<img style={{ float: "left" }} height="20" src="static/img/dec.png" onClick={ () => { this.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img style={{ float: "right" }} height="20" src="static/img/inc.png" onClick={ () => { this.onIncrease() } } alt="+"/>)
            : undefined;

        return (
            <div>
                <div className="attribute-container">
                    {System[system]}
                </div>
                <div className="attribute-value">
                    {dec}
                    {value}
                    {inc}
                </div>
            </div>
        );
    }

    private onDecrease() {
        this.props.controller.onDecrease(this.props.system);
    }

    private onIncrease() {
        this.props.controller.onIncrease(this.props.system);
    }
}

interface IRefitsProperties {
    points: number;
    onDone?: (done: boolean) => void;
    onUpdate: (points: number) => void;
}

class RefitContainer {
    system: System;
    value: number;
    minValue: number;
    maxValue: number;
    showDecrease: boolean;
    showIncrease: boolean;

    constructor(system: System, value: number, minValue: number, maxValue: number, showDecrease: boolean, showIncrease: boolean) {
        this.system = system;
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.showDecrease = showDecrease;
        this.showIncrease = showIncrease;
    }
}

export class Refits extends React.Component<IRefitsProperties, {}> {
    private _absoluteMax: number = 12;

    private _points: number;
    private _refits: RefitContainer[];

    constructor(props: IRefitsProperties) {
        super(props);

        let minimum = character.starship.spaceframeModel.systems;

        const missionPod = SpaceframeHelper.getMissionPod(character.starship.missionPod);
        if (missionPod) {
            missionPod.systems.forEach((s, i) => {
                minimum[i] += s;
            });
        }

        this._points = this.calculatePoints(props.points, minimum);
        this._refits = [];

        for (let i = 0; i < character.starship.systems.length; i++) {
            this._refits.push(
                new RefitContainer(
                    i,
                    character.starship.systems[i],
                    minimum[i],
                    this._absoluteMax,
                    character.starship.systems[i] > minimum[i],
                    character.starship.systems[i] < this._absoluteMax && this._points > 0));
        }
    }

    // TODO: fix this to use State
    UNSAFE_componentWillReceiveProps(props: IRefitsProperties) {
        let minimum = character.starship.spaceframeModel.systems;

        const missionPod = SpaceframeHelper.getMissionPod(character.starship.missionPod);
        if (missionPod) {
            missionPod.systems.forEach((s, i) => {
                minimum[i] += s;
            });
        }

        this._points = this.calculatePoints(props.points, minimum);
        this._refits = [];

        for (let i = 0; i < character.starship.systems.length; i++) {
            this._refits.push(
                new RefitContainer(
                    i,
                    character.starship.systems[i],
                    minimum[i],
                    this._absoluteMax,
                    character.starship.systems[i] > minimum[i],
                    character.starship.systems[i] < this._absoluteMax && this._points > 0));
        }
    }

    render() {
        const attributes = this._refits.map((a, i) => {
            return <Refit
                key={i}
                controller={this}
                system={a.system}
                value={a.value}
                showIncrease={a.showIncrease}
                showDecrease={a.showDecrease} />
        });

        return (
            <div>
                {attributes}
            </div>
        );
    }

    onDecrease(attr: System) {
        for (let i = 0; i < this._refits.length; i++) {
            let a = this._refits[i];
            if (a.system === attr) {
                a.value--;
                character.starship.systems[a.system] = a.value;
                break;
            }
        }

        this._points++;

        for (let i = 0; i < this._refits.length; i++) {
            let a = this._refits[i];
            a.showDecrease = a.value > a.minValue;
            a.showIncrease = a.value < a.maxValue;
        }

        if (this.props.onDone) {
            this.props.onDone(this._points === 0);
        }

        this.props.onUpdate(this._points);

        this.forceUpdate();
    }

    onIncrease(attr: System) {
        for (let i = 0; i < this._refits.length; i++) {
            let a = this._refits[i];
            if (a.system === attr) {
                a.value++;
                character.starship.systems[a.system] = a.value;
                break;
            }
        }

        this._points--;

        for (let i = 0; i < this._refits.length; i++) {
            let a = this._refits[i];
            a.showDecrease = a.value > a.minValue;
            a.showIncrease = a.value < a.maxValue && this._points > 0;
        }

        if (this.props.onDone) {
            this.props.onDone(this._points === 0);
        }

        this.props.onUpdate(this._points);

        this.forceUpdate();
    }

    private calculatePoints(allotted: number, systems: number[]) {
        /*
        let reduction = 0;

        for (let i = 0; i < systems.length; i++) {
            const diff = character.starship.systems[i] - systems[i];
            reduction += diff; 
        }
        */
        return allotted;// - reduction;
    }
}