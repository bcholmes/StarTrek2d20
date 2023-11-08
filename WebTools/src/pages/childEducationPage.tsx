import * as React from 'react';
import { EducationStep, character } from '../common/character';
import { Navigation } from '../common/navigator';
import { Window } from '../common/window';
import { Button } from '../components/button';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
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
                <Header className="mt-4">Select Child Age</Header>
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
            <CharacterCreationBreadcrumbs />
            <InstructionText text={character.workflow.currentStep().description} />
            <AgeSelection onSelection={(a) => this.selectAge(a)} />
        </div>)
    }

    private selectAge(age: Age) {
        character.age = age;
        character.educationStep = new EducationStep();
        Navigation.navigateToPage(PageIdentity.ChildEducationDetailsPage);
    }
}