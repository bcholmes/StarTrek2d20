import React, { useState } from 'react';
import {EducationStep, character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {TrackModel, TracksHelper} from '../helpers/tracks';
import {Button} from '../components/button';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Window } from '../common/window';
import { useTranslation } from 'react-i18next';
import { CharacterType } from '../common/characterType';
import { makeKey } from '../common/translationKey';
import { Header } from '../components/header';

enum StarfleetTrackTab {

    Officer,
    Enlisted,
    Other
}

export const StarfleetAcademyPage = () => {

    const [randomTrack, setRandomTrack] = useState(null);
    const [randomEnlistedTrack, setRandomEnlistedTrack] = useState(null);
    const [tab, setTab] = useState(StarfleetTrackTab.Officer);
    const { t } = useTranslation();

    const rollTrack = () => {
        let track = TracksHelper.instance().generateTrack(character.type);
        setRandomTrack(track);
    }

    const selectTrack = (track: TrackModel) => {
        const enlisted = (tab === StarfleetTrackTab.Enlisted);
        character.educationStep = new EducationStep(track.id, enlisted);
        TracksHelper.instance().applyTrack(track);
        Navigation.navigateToPage(PageIdentity.StarfleetAcademyDetails);
    }

    const toTableRow = (track: TrackModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) selectTrack(track); }}>
                <td className="selection-header">{track.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { selectTrack(track) }} /></td>
            </tr>
        );
    }

    const types = randomTrack != null
        ? toTableRow(TracksHelper.instance().getTrack(randomTrack), 0)
        : TracksHelper.instance().getTracks(character.type).map((e, i) => toTableRow(e, i));

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs />

            <Header>{t(makeKey('SoloEducationPage.type.', CharacterType[character.type]))}</Header>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => rollTrack() }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomTrack != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomTrack(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {types}
                </tbody>
            </table>
        </div>
    );

}
