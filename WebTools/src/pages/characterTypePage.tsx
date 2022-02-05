import * as React from 'react';
import {character} from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {WorkflowsHelper} from '../helpers/workflows';
import AllyHelper, { AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Source } from '../helpers/sources';

interface ICharacterTypePageState {
    type: CharacterType,
    alliedMilitary?: AlliedMilitaryType
    otherName?: string
}

export class CharacterTypePage extends React.Component<{}, ICharacterTypePageState> {

    constructor(props) {
        super(props);
        this.state = {
            type: CharacterType.Starfleet
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
                        this.setState(state => ({ ...state, otherName: e.target.value }) ); 
                    } }/>
                </div>)
                : null;

            return (<div className="panel">
                    <div className="header-small">Allied Military</div>
                    <div className="page-text">
                        What military does this character represent?
                    </div>
                    <select onChange={(e) => this.selectAlliedMilitaryType(e.target.value)} value={this.state.alliedMilitary}>
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

        const types = CharacterTypeModel.getAllTypesExceptOther().map(t => {
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
    private startWorkflow() {
        character.workflow = WorkflowsHelper.getWorkflow(character.type);
        this.goToPage(PageIdentity.Species);
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
