import * as React from 'react';
import {character} from '../common/character';
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

        SetHeaderText("STARFLEET ACADEMY");

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <div className="page-text">
                        The years spent at Starfleet Academy are some of the most memorable and definitive of an officer’s life, shaping the direction of their career going forwards. For those who pass the grueling entrance examinations, the Academy takes four years, covering a mixture of intense training, academic studies, and practical experiences.Much of this takes place within the main Starfleet Academy campus in San Francisco on Earth, but other campuses and annexes exist across the Federation, and a cadet may spend time at any of these before they graduate.
                        <br /><br />
                        Alternatively, you may opt for an Enlisted character. This is however purely background and does not affect you in more ways than the fact that you never went to Starfleet Academy and cannot select Command as your Major.
                        Either select or roll your Academy Track.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Officer Track" onClick={() => this.showTracks(true) } />
                        <Button className="button" text="Roll Officer Track" onClick={() => this.rollTrack(true) } />
                        <Button className="button" text="Select Enlisted Track" onClick={() => this.showTracks(false) } />
                        <Button className="button" text="Roll Enlisted Track" onClick={() => this.rollTrack(false) } />
                    </div>
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