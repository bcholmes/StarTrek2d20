import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {Button} from '../components/button';
import {TalentDescription} from '../components/talentDescription';
import ValueInput, {Value} from '../components/valueInput';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ISimpleCareerPageProperties extends WithTranslation {
    talent: string;
}

class SimpleCareerPage extends React.Component<ISimpleCareerPageProperties, {}> {

    talent: TalentViewModel;

    constructor(props) {
        super(props);
        // this never changes for the life of the page
        this.talent = TalentsHelper.getTalentViewModel(this.props.talent);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                <Header>{t('Page.title.career')}</Header>
                <InstructionText text={character.workflow.currentStep().description} />
                <div className="row">
                    <div className="col-12 col-md-6">
                        <Header level={2}>{t('Construct.other.value')}</Header>
                        <ValueInput value={Value.Career}/>
                    </div>
                    <div className="col-12 col-md-6">
                        <Header level={2}>{t('Construct.other.talent')}</Header>
                        <TalentDescription name={this.talent.name} description={this.talent.description} />
                    </div>
                </div>
                <div className="text-right">
                    <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary" onClick={() => this.onNext() }/>
                </div>
            </div>
        );
    }

    private onNext() {
        character.addTalent(this.talent);

        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }
}

export default withTranslation()(SimpleCareerPage);