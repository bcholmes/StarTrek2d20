import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {navigateTo, Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {Source} from '../helpers/sources';
import {WorkflowsHelper} from '../helpers/workflows';
import { hasSource } from '../state/contextFunctions';
import { withTranslation, WithTranslation } from 'react-i18next';
import InstructionText from '../components/instructionText';

class ToolSelectionPage extends React.Component<WithTranslation, {}> {

    render() {
        const { t } = this.props;
        return (
            <div className="page">
                <div className="container ml-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.toolSelection')}</li>
                        </ol>
                    </nav>

                    <InstructionText text={t('ToolSelection.instruction')} />

                    <div className="button-container">
                        <Button className="button" onClick={() => { this.startStarfleetWorkflow(); } } >{t('ToolSelection.mainCharacter')}</Button>
                        <Button className="button" onClick={() => { this.goToPage(PageIdentity.SupportingCharacter); } } >{t('ToolSelection.supportingCharacter')}</Button>
                        <Button className="button" onClick={() => { this.goToPage(PageIdentity.StarshipToolSelection); } } >{t('ToolSelection.starship')}</Button>
                        {this.renderSystemGenerationButton()}
                    </div>
                </div>
            </div>
        );
    }

    renderSystemGenerationButton() {
        const { t } = this.props;
        if (hasSource(Source.ShackletonExpanse)) {
            return (<Button className="button" onClick={() => { this.goToPage(PageIdentity.SystemGeneration); } } >{t('ToolSelection.spaceSector')}</Button>);
        } else {
            return undefined;
        }
    }

    private startStarfleetWorkflow() {
        if (hasSource(Source.KlingonCore) || hasSource(Source.PlayersGuide)) {
            this.goToPage(PageIdentity.CharacterType);
        } else {
            character.type = CharacterType.Starfleet;
            character.workflow = WorkflowsHelper.starfleetWorkflow;
            this.goToPage(PageIdentity.Species);
        }
    }


    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}

export default withTranslation()(ToolSelectionPage);