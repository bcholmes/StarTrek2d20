import React, { useState } from 'react';
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
import { hasSource } from '../state/contextFunctions';
import { Source } from '../helpers/sources';
import InstructionText from '../components/instructionText';
import store from '../state/store';
import { setCharacterEducation } from '../state/characterActions';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';

enum StarfleetTrackTab {

    Officer,
    Enlisted,
    Other
}

const EducationPage: React.FC<ICharacterProperties> = ({character}) => {

    const [randomTrack, setRandomTrack] = useState(null);
    const [tab, setTab] = useState(StarfleetTrackTab.Officer);
    const { t } = useTranslation();

    const rollTrack = () => {
        let track = TracksHelper.instance.generateTrack(character.type);
        setRandomTrack(track);
    }

    const selectTrack = (track: TrackModel) => {
        const enlisted = (tab === StarfleetTrackTab.Enlisted);
        store.dispatch(setCharacterEducation(track.id, enlisted));
        Navigation.navigateToPage(PageIdentity.EducationDetails);
    }

    const toTableRow = (track: TrackModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) selectTrack(track); }}>
                <td className="selection-header">{track.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { selectTrack(track) }} /></td>
            </tr>
        );
    }

    const getTracks = () => {
        if (character.type !== CharacterType.Starfleet) {
            return TracksHelper.instance.getTracks(character.type);
        } else if (tab === StarfleetTrackTab.Other) {
            return TracksHelper.instance.getOtherStarfleetTracks();
        } else if (tab === StarfleetTrackTab.Enlisted) {
            return TracksHelper.instance.getEnlistedStarfleetTracks();
        } else {
            return TracksHelper.instance.getOfficerStarfleetTracks();
        }
    }

    const types = (randomTrack != null && tab !== StarfleetTrackTab.Other)
        ? toTableRow(TracksHelper.instance.getTrack(randomTrack, character.type), 0)
        : getTracks().map((e, i) => toTableRow(e, i));

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.Education} />

            <Header>{t(makeKey('EducationPage.type.', CharacterType[character.type]))}</Header>

            <InstructionText text={t(makeKey('EducationPage.instruction.', CharacterType[character.type]))} />

            {character.type === CharacterType.Starfleet
                ? (<div className="btn-group w-100 my-4" role="group" aria-label="Environment types">
                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === StarfleetTrackTab.Officer ? "active" : "")}
                        onClick={() => setTab(StarfleetTrackTab.Officer)}>{t('EducationPage.starfleet.academy')}</button>
                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === StarfleetTrackTab.Enlisted ? "active" : "")}
                        onClick={() => setTab(StarfleetTrackTab.Enlisted)}>{t('EducationPage.starfleet.enlisted')}</button>
                    {hasSource(Source.SciencesDivision)
                        ? (<button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === StarfleetTrackTab.Other ? "active" : "")}
                            onClick={() => setTab(StarfleetTrackTab.Other)}>{t('EducationPage.starfleet.other')}</button>)
                        : undefined}
                </div>)
                : undefined}

            {tab !== StarfleetTrackTab.Other
                ? (<div className="my-4">
                    <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => rollTrack() }>
                        <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                    </Button>
                    {randomTrack != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomTrack(null)} >{t('Common.button.showAll')}</Button>) : undefined}
                </div>)
                : undefined}

            <table className="selection-list my-4">
                <tbody>
                    {types}
                </tbody>
            </table>
        </div>
    );

}

export default connect(characterMapStateToProperties)(EducationPage);