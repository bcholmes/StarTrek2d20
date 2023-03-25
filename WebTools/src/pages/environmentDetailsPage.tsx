import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
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
import { Header } from '../components/header';
import { withTranslation, WithTranslation } from 'react-i18next';

class EnvironmentDetailsPage extends React.Component<WithTranslation, {}> {
    private _electiveSkills: Skill[];
    private _otherSpecies: Species;
    private _attributeDone: boolean;

    constructor(props: WithTranslation) {
        super(props);

        this._electiveSkills = [];
        this._otherSpecies = null;

        if (character.environmentStep?.environment === Environment.AnotherSpeciesWorld) {
            this._otherSpecies = SpeciesHelper.getSpeciesByName(character.environmentStep?.otherSpeciesWorld);
        }
    }

    render() {
        const { t } = this.props;
        let env = EnvironmentsHelper.getEnvironment(character.environmentStep?.environment, character.type);
        let title = env.localizedName;

        if (character.environmentStep?.environment === Environment.Homeworld) {
            const speciesAttributes = character.speciesStep?.species === Species.Custom ? AttributesHelper.getAllAttributes() : SpeciesHelper.getSpeciesByType(character.speciesStep.species).attributes;
            env.attributes = speciesAttributes;
        } else if (character.environmentStep?.environment === Environment.AnotherSpeciesWorld) {
            const otherSpecies = SpeciesHelper.getSpeciesByType(this._otherSpecies);
            env.attributes = otherSpecies.attributes;
            title = t('Environment.special.name', { name: title, species: otherSpecies.name, interpolation: { escapeValue: false } });
        }

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{title}</Header>
                <p>{env.localizedDescription}</p>
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attributes')} ({t('Common.text.selectOne')})</Header>
                        <AttributeImprovementCollection
                            filter={env.attributes}
                            mode={AttributeImprovementCollectionMode.Increase}
                            points={1}
                            onDone={(done) => { this._attributeDone = done; } }/>
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.disciplines')} ({t('Common.text.selectOne')})</Header>
                        <ElectiveSkillList
                            points={1}
                            skills={env.disciplines}
                            onUpdated={skills => this.onElectiveSkillsSelected(skills) }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>
                        <ValueInput value={Value.Environment}/>
                    </div>
                </div>
                <div className='text-right'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => this.onNext() }/>
                </div>
            </div>
        );
    }

    private onElectiveSkillsSelected(skills: Skill[]) {
        this._electiveSkills = skills;
        this.forceUpdate();
    }

    private onNext() {
        const {t} = this.props;
        if (!this._attributeDone) {
            Dialog.show(t('EnvironmentPage.error.attributes'));
            return;
        }

        if (this._electiveSkills.length === 1) {
            character.workflow.next();
            Navigation.navigateToPage(PageIdentity.Upbringing);
        }
        else {
            Dialog.show(t('EnvironmentPage.error.disciplines'));
        }
    }
}

export default withTranslation()(EnvironmentDetailsPage);