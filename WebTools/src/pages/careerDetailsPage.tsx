import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {CareerModel, CareersHelper} from '../helpers/careers';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {TalentDescription} from '../components/talentDescription';
import ValueInput, {Value} from '../components/valueInput';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from '../components/header';

class CareerDetailsPage extends React.Component<WithTranslation, {}> {
    private _talent: TalentViewModel;

    constructor(props) {
        super(props);

        const career = CareersHelper.instance.getCareer(character.career);
        if (career.talent.length === 1) {
            this._talent = career.talent[0];
        }
    }

    render() {
        const { t } = this.props;
        const career = CareersHelper.instance.getCareer(character.career);

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />

                <Header>{career.localizedName}</Header>
                <p>{career.localizedDescription}</p>

                {this.renderMainBody(career)}

                <div className="text-right">
                    <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary" onClick={() => this.onNext() }/>
                </div>
            </div>
        );
    }

    renderMainBody(career: CareerModel) {
        const { t } = this.props;

        if (career.talent.length === 1) {
            return (<div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <ValueInput value={Value.Career}/>
                </div>

                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.talent')}</Header>
                    <TalentDescription name={career.talent[0].name} description={career.talent[0].description}/>
                </div>
            </div>);
        } else {
            return (<>
            <div className="my-3">
                <Header level={2}>{t('Construct.other.value')}</Header>
                <ValueInput value={Value.Career}/>
                </div>

                <div className="my-3">
                <Header level={2}>{t('Construct.other.talent')}</Header>
                <SingleTalentSelectionList talents={this.filterTalentList()}
                    construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
            </>);
        }
    }

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (this._talent != null && t.name === this._talent.name) || t.rank > 1);
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        if (!this._talent) {
            Dialog.show("You must select a Talent before proceeding.");
        } else {
            character.addTalent(this._talent);
            character.workflow.next();
            Navigation.navigateToPage(PageIdentity.CareerEvent1);
        }
    }
}

export default withTranslation()(CareerDetailsPage);