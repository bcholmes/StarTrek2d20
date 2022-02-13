import * as React from 'react';
import {AlliedMilitaryDetails, character, GovernmentDetails} from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {WorkflowsHelper} from '../helpers/workflows';
import AllyHelper, { AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Source } from '../helpers/sources';
import Governments, { GovernmentType } from '../helpers/governments';

interface ICharacterTypePageState {
    type: CharacterType,
    alliedMilitary?: AlliedMilitaryType
    government?: GovernmentType
    otherName: string
}

export class CharacterTypePage extends React.Component<{}, ICharacterTypePageState> {

    constructor(props) {
        super(props);
        this.state = {
            type: CharacterType.Starfleet,
            otherName: ''
        }
    }

    renderAlliedMilitaryList() {
        if (this.state.type === CharacterType.AlliedMilitary) {

            const types = AllyHelper.selectOptions(character.era, !character.hasSource(Source.KlingonCore)).map(t => {
                return (<option value={t.type} key={'type-' + t.type}>{t.name}</option>);
            });

            const other = this.state.alliedMilitary === AlliedMilitaryType.OTHER 
                ? (<div className="panel">
                    <div className="page-text">
                        What's the name of this military?
                    </div>
                    <input value={this.state.otherName} onChange={(e) => { 
                        let value = e.target.value;
                        this.setState(state => ({ ...state, otherName: value }) ); 
                    } }/>
                </div>)
                : null;

            return (<div className="panel">
                    <div className="header-small">Allied Military</div>
                    <div className="page-text">
                        What military does this character represent?
                    </div>
                    <select onChange={(e) => this.selectAlliedMilitaryType(e.target.value)} value={this.state.alliedMilitary}>
                        <option>Choose...</option>
                        {types}
                    </select>
                    {other}
                  </div>);
        } else {
            return null;
        }
    }

    renderGovernmentsList() {
        if (this.state.type === CharacterType.AmbassadorDiplomat) {

            const types = Governments.selectOptions(character.era).map(t => {
                return (<option value={t.type} key={'gov-' + t.type}>{t.name}</option>);
            });

            const other = this.state.government === GovernmentType.OTHER 
                ? (<div className="panel">
                    <div className="page-text">
                        What's the name of this government?
                    </div>
                    <input value={this.state.otherName} onChange={(e) => { 
                        let value = e.target.value;
                        this.setState(state => ({ ...state, otherName: value }) ); 
                    } }/>
                </div>)
                : null;

            return (<div className="panel">
                    <div className="header-small">Government</div>
                    <div className="page-text">
                        What government does this character represent?
                    </div>
                    <select onChange={(e) => this.selectGovernmentType(e.target.value)} value={this.state.government}>
                        <option>Choose...</option>
                        {types}
                    </select>
                    {other}
                  </div>);
        } else {
            return null;
        }
    }


    render() {
        const alliedMilitary = this.renderAlliedMilitaryList();
        const governments = this.renderGovernmentsList();

        const types = CharacterTypeModel.getAllTypesExceptOther(character.sources).map(t => {
            return (<option value={t.type} key={'type-' + t.type}>{t.name}</option>);
        });

        return (
            <div className="page">
                <div className="panel">
                    <div className="header-small">Character Type</div>
                    <div className="page-text">
                        What type of character is this?
                    </div>
                    <select onChange={(e) => this.selectType(e.target.value)} value={this.state.type}>
                        {types}
                    </select>
                </div>

                {alliedMilitary}
                {governments}

                <Button onClick={() => this.startWorkflow()} text='CREATE' />
            </div>
        );
    }

    private selectType(typeAsString: string) {
        let type = parseInt(typeAsString) as CharacterType;
        this.setState(state => ({
            ...state,
            type: type
        }));
    }

    private selectAlliedMilitaryType(typeAsString: string) {
        let type = parseInt(typeAsString) as AlliedMilitaryType;
        this.setState(state => ({
            ...state,
            alliedMilitary: type
        }));
    }

    private selectGovernmentType(typeAsString: string) {
        let type = parseInt(typeAsString) as GovernmentType;
        this.setState(state => ({
            ...state,
            government: type
        }));
    }

    private startWorkflow() {
        character.type = this.state.type;
        if (character.type === CharacterType.AlliedMilitary) {
            character.typeDetails = new AlliedMilitaryDetails(AllyHelper.findOption(this.state.alliedMilitary), this.state.otherName);
        } else if (character.type === CharacterType.AmbassadorDiplomat) {
            character.typeDetails = new GovernmentDetails(Governments.findOption(this.state.government), this.state.otherName);
        }
        character.workflow = WorkflowsHelper.getWorkflow(character.type);
        this.goToPage(PageIdentity.Species);
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
