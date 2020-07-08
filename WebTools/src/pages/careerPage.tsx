import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Career, CareersHelper} from '../helpers/careers';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {CareerSelection} from '../components/careerSelection';

interface ICareerPageState {
    showSelection: boolean;
}

export class CareerPage extends React.Component<IPageProperties, ICareerPageState> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText("CAREER");

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <div className="page-text">
                        At this stage, you have a choice to make about the character. This decision is a clear one: are you a young officer, fresh out of the Academy, with your whole career ahead of you, have you served in Starfleet for several years, or are you a veteran with decades of experience?
                        <br /><br />
                        Either select or roll your Career.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Career" onClick={() => this.showCareer() } />
                        <Button className="button" text="Roll Career" onClick={() => this.rollCareer() } />
                    </div>
                </div>
            )
            : (
                <div>
                    <CareerSelection
                        onSelection={(career) => this.selectCareer(career) }
                        onCancel={() => this.hideCareer() } />
                </div>
            );

        return (
            <div className="page">
                {content}
            </div>
        );
    }

    private rollCareer() {
        var career = CareersHelper.generateCareer();
        this.selectCareer(career);
    }

    private showCareer() {
        this.setState({ showSelection: true });
    }

    private hideCareer() {
        this.setState({ showSelection: false });
    }

    private selectCareer(career: Career) {
        character.career = career;
        CareersHelper.applyCareer(character.career);
        Navigation.navigateToPage(PageIdentity.CareerDetails);
    }
}