import * as React from 'react';
import {character, CharacterType} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Track, TracksHelper} from '../helpers/tracks';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {TrackSelection} from '../components/trackSelection';

interface IStarfleetAcademygPageState {
    showSelection: boolean;
}

export class StarfleetAcademyPage extends React.Component<IPageProperties, IStarfleetAcademygPageState> {
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

        var buttons = character.type === CharacterType.KlingonWarrior ?
            (<div className="button-container">
                <Button className="button" text="Select Training Track" onClick={() => this.showKlingonTracks() } />
                <Button className="button" text="Roll Training Track" onClick={() => this.rollKlingonTrack() } />
            </div>)
            : (<div className="button-container">
                <Button className="button" text="Select Officer Track" onClick={() => this.showTracks(true) } />
                <Button className="button" text="Roll Officer Track" onClick={() => this.rollTrack(true) } />
                <Button className="button" text="Select Enlisted Track" onClick={() => this.showTracks(false) } />
                <Button className="button" text="Roll Enlisted Track" onClick={() => this.rollTrack(false) } />
            </div>);

        var content = !this.state.showSelection ?
            (
                <div>
                    {instruction}
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
            <div className="page">
                {content}
            </div>
        );
    }

    private rollTrack(isOfficer: boolean) {
        character.enlisted = !isOfficer;
        var track = TracksHelper.generateTrack();
        this.selectTrack(track);
    }

    private showTracks(isOfficer: boolean) {
        character.enlisted = !isOfficer;
        this.setState({ showSelection: true });
    }

    private showKlingonTracks() {
        this.setState({ showSelection: true });
    }

    private rollKlingonTrack() {
        var track = TracksHelper.generateTrack();
        this.selectTrack(track);
    }

    private hideTracks() {
        character.enlisted = false;
        this.setState({ showSelection: false });
    }

    private selectTrack(track: Track) {
        character.track = track;
        TracksHelper.applyTrack(character.track);
        Navigation.navigateToPage(PageIdentity.StarfleetAcademyDetails);
    }
}
