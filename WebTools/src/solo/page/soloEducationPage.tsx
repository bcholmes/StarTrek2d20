import React, { useState } from "react";
import { ISoloCharacterProperties } from "./soloCharacterProperties";
import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { CharacterType } from "../../common/characterType";
import { makeKey } from "../../common/translationKey";
import { TrackModel, TracksHelper } from "../../helpers/tracks";
import { Button } from "../../components/button";
import { Window } from "../../common/window";
import { EducationTrackRandomTable } from "../table/educationRandomTable";
import store from "../../state/store";
import { setCharacterEducation } from "../../state/characterActions";

const SoloEducationPage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [randomTrack, setRandomTrack] = useState(null);

    const trackSelected = (track: TrackModel)=> {
        store.dispatch(setCharacterEducation(track.id, track.enlisted));
        Navigation.navigateToPage(PageIdentity.SoloEducationDetailsPage);
    }

    const toTableRow = (track: TrackModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) trackSelected(track); }}>
                <td className="selection-header">{track.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { trackSelected(track) }} /></td>
            </tr>
        );
    }

    const types = randomTrack != null
        ? toTableRow(TracksHelper.instance().getSoloTrack(randomTrack), 0)
        : TracksHelper.instance().getSoloTracks(character.type).map((e, i) => toTableRow(e, i));


    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloSpecies)}>{t('Page.title.species')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEnvironment)}>{t('Page.title.environment')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEarlyOutlook)}>{t('Page.title.soloEarlyOutlook')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloEducation')}</li>
                </ol>
            </nav>
            <Header>{t(makeKey('SoloEducationPage.type.', CharacterType[character.type]))}</Header>
            <p className="mt-3">
                {t(makeKey('SoloEducationPage.instruction.', CharacterType[character.type]))}
            </p>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomTrack( EducationTrackRandomTable(character.type)) }>
                    <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}
                </Button>
                {randomTrack != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomTrack(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {types}
                </tbody>
            </table>
        </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEducationPage);