import * as React from 'react';
import { Navigation } from '../common/navigator';
import { Window } from '../common/window';
import { Button } from '../components/button';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Header } from '../components/header';
import InstructionText from '../components/instructionText';
import AgeHelper, { Age } from '../helpers/age';
import { PageIdentity } from './pageIdentity';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import store from '../state/store';
import { setCharacterAge } from '../state/characterActions';

interface ITrackSelectionProperties {
    onSelection: (age: Age) => void;
}

const AgeSelection : React.FC<ITrackSelectionProperties> = ({onSelection}) => {

    let ages = AgeHelper.getAllChildAges().map((a, i) => {
        return (
            <tr key={i}
                onClick={() => { if (Window.isCompact()) onSelection(a); } }>
                <td className="selection-header">{a.name}</td>
                <td>{a.description}</td>
                <td><Button className="button-small" text="Select" onClick={() => { onSelection(a) } } /></td>
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

const ChildEducationPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();

    const selectAge = (age: Age) => {
        store.dispatch(setCharacterAge(age));
        Navigation.navigateToPage(PageIdentity.ChildEducationDetailsPage);
    }

    return (<div className="page container ml-0">
        <CharacterCreationBreadcrumbs />
        <InstructionText text={t('ChildSelectionPage.instruction')} />
        <AgeSelection onSelection={(a) => selectAge(a)} />
    </div>)

}

export default connect(characterMapStateToProperties)(ChildEducationPage);