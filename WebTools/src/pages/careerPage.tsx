import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {CareersHelper} from '../helpers/careers';
import {Button} from '../components/button';
import {CareerSelection} from '../components/careerSelection';
import InstructionText from '../components/instructionText';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Career } from '../helpers/careerEnum';

interface ICareerPageState {
    showSelection: boolean;
}

export class CareerPage extends React.Component<IPageProperties, ICareerPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
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
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                {content}
            </div>
        );
    }

    private rollCareer() {
        var career = CareersHelper.instance.generateCareer();
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
        CareersHelper.instance.applyCareer(character.career);
        Navigation.navigateToPage(PageIdentity.CareerDetails);
    }
}
