import * as React from 'react';
import {character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Environment, EnvironmentsHelper } from '../helpers/environments';
import {SpeciesHelper } from '../helpers/species';
import {Skill} from '../helpers/skills';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovementCollection';
import {ElectiveSkillList} from '../components/electiveSkillList';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import ValueInput, {Value} from '../components/valueInput';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Species } from '../helpers/speciesEnum';
import { AttributesHelper } from '../helpers/attributes';

export class EnvironmentDetailsPage extends React.Component<IPageProperties, {}> {
    private _electiveSkills: Skill[];
    private _otherSpecies: Species;
    private _attributeDone: boolean;

    constructor(props: IPageProperties) {
        super(props);

        this._electiveSkills = [];
        this._otherSpecies = null;

        if (character.environmentStep?.environment === Environment.AnotherSpeciesWorld) {
            this._otherSpecies = SpeciesHelper.getSpeciesByName(character.environmentStep?.otherSpeciesWorld);
        }
    }

    render() {
        let env = EnvironmentsHelper.getEnvironment(character.environmentStep?.environment, character.type);
        var otherSpeciesName = "";

        if (character.environmentStep?.environment === Environment.Homeworld) {
            const speciesAttributes = character.speciesStep?.species === Species.Custom ? AttributesHelper.getAllAttributes() : SpeciesHelper.getSpeciesByType(character.speciesStep.species).attributes;
            env.attributes = speciesAttributes;
        } else if (character.environmentStep?.environment === Environment.AnotherSpeciesWorld) {
            const otherSpecies = SpeciesHelper.getSpeciesByType(this._otherSpecies);
            env.attributes = otherSpecies.attributes;
            otherSpeciesName = `(${otherSpecies.name})`;
        }

        var nextPageName = character.type === CharacterType.KlingonWarrior ? "CASTE" : "UPBRINGING";

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <div className="header-text"><div>{env.name} {otherSpeciesName}</div></div>
                <div className="panel">
                    <div className="desc-text">{env.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select one)</div>
                    <AttributeImprovementCollection
                        filter={env.attributes}
                        mode={AttributeImprovementCollectionMode.Increase}
                        points={1}
                        onDone={(done) => { this._attributeDone = done; } }/>
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES (Select one)</div>
                    <ElectiveSkillList
                        points={1}
                        skills={env.disciplines}
                        onUpdated={skills => this.onElectiveSkillsSelected(skills) }/>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Environment}/>
                </div>
                <Button text={nextPageName} className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onElectiveSkillsSelected(skills: Skill[]) {
        this._electiveSkills = skills;
        this.forceUpdate();
    }

    private onNext() {
        if (!this._attributeDone) {
            Dialog.show("You must select 1 Attribute to improve before proceeding.");
            return;
        }

        if (this._electiveSkills.length === 1) {
            character.workflow.next();
            Navigation.navigateToPage(PageIdentity.Upbringing);
        }
        else {
            Dialog.show("You must select 1 Discipline to improve before proceeding.");
        }
    }
}
