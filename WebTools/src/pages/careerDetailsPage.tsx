import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {CareersHelper} from '../helpers/careers';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {TalentDescription} from '../components/talentDescription';
import {ValueInput, Value} from '../components/valueInput';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';

export class CareerDetailsPage extends React.Component<IPageProperties, {}> {
    private _talent: TalentViewModel;

    constructor(props: IPageProperties) {
        super(props);

        const career = CareersHelper.getCareer(character.career);
        if (career.talent.length === 1) {
            this._talent = career.talent[0];
        }
    }

    render() {
        const career = CareersHelper.getCareer(character.career);

        const talent = career.talent.length === 1
            ? (<TalentDescription name={career.talent[0].name} description={career.talent[0].description}/>)
            : (<SingleTalentSelectionList talents={this.filterTalentList()} 
                    construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>);

        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                <div className="header-text"><div>{career.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{career.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Career}/>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    {talent}
                </div>
                <Button text="CAREER EVENT" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalents().filter(
            t => !character.hasTalent(t.name) || (this._talent != null && t.name === this._talent.name) || t.rank > 1);
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        if (!this._talent) {
            Dialog.show("You must select a Talent before proceeding.");
            return;
        }

        character.addTalent(this._talent);

        character.workflow.next();
        Navigation.navigateToPage(PageIdentity.CareerEvent1);
    }
}
