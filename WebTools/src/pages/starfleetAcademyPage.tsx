import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {TracksHelper} from '../helpers/tracks';
import {Button} from '../components/button';
import {TrackSelection} from '../components/trackSelection';
import InstructionText from '../components/instructionText';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Track } from '../helpers/trackEnum';

interface IStarfleetAcademygPageState {
    showSelection: boolean;
}

export class StarfleetAcademyPage extends React.Component<IPageProperties, IStarfleetAcademygPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var buttons = character.type === CharacterType.Starfleet
            ? (<div className="button-container">
                <Button className="button" text="Select Officer Track" onClick={() => this.showTracks(true) } />
                <Button className="button" text="Roll Officer Track" onClick={() => this.rollTrack(true) } />
                <Button className="button" text="Select Enlisted Track" onClick={() => this.showTracks(false) } />
                <Button className="button" text="Roll Enlisted Track" onClick={() => this.rollTrack(false) } />
            </div>)
            : (<div className="button-container">
                <Button className="button" text="Select Training Track" onClick={() => this.showTrackForType() } />
                <Button className="button" text="Roll Training Track" onClick={() => this.rollTrackForType() } />
            </div>)


        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
                    {buttons}
                </div>
            )
            : (
                <div>
                    <TrackSelection
                        onSelection={(env) => this.selectTrack(env) }
                        onCancel={() => this.hideTracks() } />
                </div>
            );

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                {content}
            </div>
        );
    }

    private rollTrack(isOfficer: boolean) {
        character.enlisted = !isOfficer;
        var track = TracksHelper.instance().generateTrack();
        this.selectTrack(track);
    }

    private showTracks(isOfficer: boolean) {
        character.enlisted = !isOfficer;
        this.setState({ showSelection: true });
    }

    private showTrackForType() {
        this.setState({ showSelection: true });
    }

    private rollTrackForType() {
        var track = TracksHelper.instance().generateTrack();
        this.selectTrack(track);
    }

    private hideTracks() {
        character.enlisted = false;
        this.setState({ showSelection: false });
    }

    private selectTrack(track: Track) {
        character.track = track;
        TracksHelper.instance().applyTrack(character.track);
        Navigation.navigateToPage(PageIdentity.StarfleetAcademyDetails);
    }
}
