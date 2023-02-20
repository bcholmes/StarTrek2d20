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
import { PageFactory } from './pageFactory';
import { LoadingButton } from '../common/loadingButton';

interface IToolSelectionPageState {
    loadingNpc?: boolean;
    loadingStarship?: boolean;
    loadingSystem?: boolean;
}

class ToolSelectionPage extends React.Component<WithTranslation, IToolSelectionPageState> {

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

                    <div className="row">
                        <div className="col-md-6 button-column">
                            <Button className="button mt-4" onClick={() => { this.startStarfleetWorkflow(); } } >{t('ToolSelection.mainCharacter')}</Button>
                            <Button className="button mt-4" onClick={() => { this.goToPage(PageIdentity.SupportingCharacter); } } >{t('ToolSelection.supportingCharacter')}</Button>
                            <LoadingButton onClick={() => { this.loadStarshipAndGoToPage(); } } loading={this.state?.loadingStarship}>{t('ToolSelection.starship')}</LoadingButton>
                            {this.renderSystemGenerationButton()}
                        </div>
                        <div className="col-md-6 button-column">
                            <LoadingButton onClick={() => { this.loadNpcAndGoToPage(); } } loading={this.state?.loadingNpc}>{t('ToolSelection.randomNpc')}</LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderSystemGenerationButton() {
        const { t } = this.props;
        if (hasSource(Source.ShackletonExpanse)) {
            return (<LoadingButton onClick={() => { this.loadSystemAndGoToPage(); } } loading={this.state?.loadingSystem}>{t('ToolSelection.spaceSector')}</LoadingButton>);
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

    loadSystemAndGoToPage() {
        this.setState((state) => ({...state, loadingSystem: true}));
        PageFactory.instance.loadSystemGenerationFactory(() => {
            this.setState((state) => ({...state, loadingSystem: false}));
            this.goToPage(PageIdentity.SystemGeneration);
        });
    }

    loadStarshipAndGoToPage() {
        this.setState((state) => ({...state, loadingStarship: true}));
        PageFactory.instance.loadStarshipFactory(() => {
            this.setState((state) => ({...state, loadingStarship: false}));
            this.goToPage(PageIdentity.StarshipToolSelection);
        });
    }

    loadNpcAndGoToPage() {
        this.setState((state) => ({...state, loadingNpc: true}));
        PageFactory.instance.loadNpcFactory(() => {
            this.setState((state) => ({...state, loadingNpc: false}));
            this.goToPage(PageIdentity.NpcConfiguration);
        });
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}

export default withTranslation()(ToolSelectionPage);