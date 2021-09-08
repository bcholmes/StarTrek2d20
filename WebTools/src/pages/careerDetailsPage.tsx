import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Career, CareersHelper} from '../helpers/careers';
import {SkillsHelper, Skill} from '../helpers/skills';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {TalentList} from '../components/talentList';
import {TalentDescription} from '../components/talentDescription';
import {ValueInput, Value} from '../components/valueInput';

export class CareerDetailsPage extends React.Component<IPageProperties, {}> {
    private _talent: string;

    constructor(props: IPageProperties) {
        super(props);

        const career = CareersHelper.getCareer(character.career);
        if (career.talent.length === 1) {
            this._talent = career.talent[0].name;
        }
    }

    render() {
        const career = CareersHelper.getCareer(character.career);

        const talent = career.talent.length === 1
            ? (<TalentDescription name={career.talent[0].name} description={career.talent[0].description}/>)
            : (<TalentList skills={[...SkillsHelper.getSkills(), Skill.None]} onSelection={(talent) => { this.onTalentSelected(talent) } }/>);

        return (
            <div className="page">
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

    private onTalentSelected(talent: string) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        if (!this._talent || this._talent === "Select talent") {
            Dialog.show("You must select a Talent before proceeding.");
            return;
        }

        character.addTalent(this._talent);

        character.workflow.next();
        Navigation.navigateToPage(PageIdentity.CareerEvent1);
    }
}
