import React, { useState } from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {navigateTo, Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {Source} from '../helpers/sources';
import { hasSource } from '../state/contextFunctions';
import { useTranslation } from 'react-i18next';
import InstructionText from '../components/instructionText';
import { PageFactory } from './pageFactory';
import { LoadingButton } from '../common/loadingButton';
import { useNavigate } from 'react-router';

const ToolSelectionPage = () => {

    const { t } = useTranslation();
    const [ loadingNpc, setLoadingNpc ] = useState(false);
    const [ loadingStarship, setLoadingStarship ] = useState(false);
    const [ loadingSystem, setLoadingSystem ] = useState(false);
    const navigate = useNavigate();

    const renderSystemGenerationButton = () => {
        if (hasSource(Source.ShackletonExpanse)) {
            return (<LoadingButton onClick={() => { loadSystemAndGoToPage(); } } loading={loadingSystem}>{t('ToolSelection.spaceSector')}</LoadingButton>);
        } else {
            return undefined;
        }
    }

    const startStarfleetWorkflow = () => {
        if (hasSource(Source.KlingonCore) || hasSource(Source.PlayersGuide)) {
            goToPage(PageIdentity.CharacterType);
        } else {
            character.type = CharacterType.Starfleet;
            goToPage(PageIdentity.Species);
        }
    }

    const loadSystemAndGoToPage = () => {
        setLoadingSystem(true);
        PageFactory.instance.loadSystemGenerationFactory(() => {
            setLoadingSystem(false);
            goToPage(PageIdentity.SystemGeneration);
        });
    }

    const loadStarshipAndGoToPage = () => {
        setLoadingStarship(true);
        PageFactory.instance.loadStarshipFactory(() => {
            setLoadingStarship(false);
            goToPage(PageIdentity.StarshipToolSelection);
        });
    }

    const loadNpcAndGoToPage = () => {
        setLoadingNpc(true);
        PageFactory.instance.loadNpcFactory(() => {
            setLoadingNpc(false);
            goToPage(PageIdentity.NpcConfiguration);
        });
    }

    const goToPage = (page: PageIdentity) => {
        if (page === PageIdentity.SystemGeneration) {
            navigate("/systemGenerator");
        } else {
            Navigation.navigateToPage(page);
        }
    }

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
                        <Button className="button mt-4" onClick={() => { startStarfleetWorkflow(); } } >{t('ToolSelection.mainCharacter')}</Button>
                        <Button className="button mt-4" onClick={() => { goToPage(PageIdentity.SupportingCharacter); } } >{t('ToolSelection.supportingCharacter')}</Button>
                        <LoadingButton onClick={() => { loadStarshipAndGoToPage(); } } loading={loadingStarship}>{t('ToolSelection.starship')}</LoadingButton>
                        {renderSystemGenerationButton()}
                    </div>
                    <div className="col-md-6 button-column">
                        <LoadingButton onClick={() => { loadNpcAndGoToPage(); } } loading={loadingNpc}>{t('ToolSelection.randomNpc')}</LoadingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToolSelectionPage;