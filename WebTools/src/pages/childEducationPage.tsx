import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import { Window } from '../common/window';
import { Button } from '../components/button';
import { Header } from '../components/header';
import InstructionText from '../components/instructionText';
import AgeHelper, { Age } from '../helpers/age';
import {IPageProperties} from './iPageProperties';
import { PageIdentity } from './pageIdentity';

interface ITrackSelectionProperties {
    onSelection: (age: Age) => void;
}

class AgeSelection extends React.Component<ITrackSelectionProperties, {}> {

    render() {
        let ages = AgeHelper.getAllChildAges().map((a, i) => {
            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(a); } }>
                    <td className="selection-header">{a.name}</td>
                    <td>{a.description}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(a) } } /></td>
                </tr>
            )
        });
        return (
            <div>
                <Header text="Select Child Age" className="mt-4" /> 
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td>Age</td>
                            <td>Description</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {ages}
                    </tbody>
                </table>
            </div>
        );
    }
}

export class ChildEducationPage extends React.Component<IPageProperties, {}> {

    render() {
        return (<div className="page">
            <InstructionText text={character.workflow.currentStep().description} />
            <AgeSelection onSelection={(a) => this.selectAge(a)} />
        </div>)
    }

    private selectAge(age: Age) {
        character.age = age;
        Navigation.navigateToPage(PageIdentity.ChildEducationDetailsPage);
    }
}