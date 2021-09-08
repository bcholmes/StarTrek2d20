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

        SetHeaderText(character.workflow.currentStep().name);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var instruction = character.workflow.currentStep().description.map((s, i) => {
            return (
                <div className="page-text">{s}</div>
            );
        });

        var content = !this.state.showSelection ?
            (
                <div>
                    {instruction}
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
