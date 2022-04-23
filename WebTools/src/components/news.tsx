import * as React from 'react';
import Modal from './modal';

interface INewsProperties {
    showModal: boolean;
    onClose: () => void;
}

class News extends React.Component<INewsProperties, {}> {

    render() {
        return (
            <Modal size="lg" show={this.props.showModal} onClose={() => this.props.onClose()} header="What's New?">
                <b>v1.220423</b>
                <ul>
                    <li>Revisions to the two-page character sheet.</li>
                </ul>
                <b>v1.220422</b>
                <ul>
                    <li>Add in the Cadet type from the <i>Player's Guide</i>. We ended up having a pretty big discussion
                        about Cadets and roles on the Modiphius forum.</li>
                    <li>Some minor tweaks to certain workflows.</li>
                    <li>The <i>Discovery Season 1</i> and <cite>Discovery Season 2</cite> books basically have the same
                        rules additions, so I'm not distinguishing them as different sources. I mean, that list of 
                        sources is already long enough. So long, in fact, that (partially prompted by Felderburg), I 
                        organized it a bit.</li>
                    <li>Add a placeholder for some not-yet-implemented sources, including the <i>Discovery Campaign</i> and the
                        recently-announced (but still a long way off) <i>Utopia Planetia</i> book. Hey, what can I say? 
                        I am excite.</li>
                </ul>
                <b>v1.220409</b>
                <ul>
                    <li>More bug fixes.</li>
                    <li>Add support for Kelpians from the <i>Discovery Season 1</i> source.</li>
                </ul>
                <b>v1.220329</b>
                <ul>
                    <li>Various small bug fixes.</li>
                    <li>Add support for the <i>Archer</i> Class ship from the <i>Tricorder Set</i>.</li>
                    <li>Implement a bookmarkable "view" page for creations. At the moment, this view is only available for
                        ships and supporting characters, but it'll be available for main characters in the not-too-distant future.
                    </li>
                </ul>
                <b>v1.220323</b>
                <ul>
                    <li>I've been implementing some new features that I'm not yet ready to make public. But one of the things that's changed is
                        that the code now makes a lot more use of a new library (Bootstrap) for web display. Some layout and sizes of things have 
                        shifted a bit. If you see something eggregiously bad, make noise in the Feedback area.
                    </li>
                </ul>
                <b>v1.220319</b>
                <ul>
                    <li>Implement Child character creation from the <cite>Player's Guide</cite></li>
                    <li>Fix a whole host of minor transcription bugs related to Talents, thanks to the diligent reporting of Felderburg.</li>
                </ul>
                <b>v1.220220</b>
                <ul>
                    <li>The complete list of Player's Guide talents are now supported.</li>
                </ul>
                <b>v1.220213</b>
                <ul>
                    <li>Even more functionality from the <cite>Player's Guide</cite> added (Civilian characters, additional roles, and some Talents)</li>
                    <li>Add a new type of character sheet, and make certain improvements to rendering full talent text on sheets.</li>
                </ul>
                <b>v1.220212</b>
                <ul>
                    <li>More functionality from the <cite>Player's Guide</cite> added.</li>
                </ul>
                <b>v1.220130</b>
                <ul>
                    <li>Bug fix: a user reported a glitch with showing the Talent text. When the full text is shown (on 
                        the 2-page character sheet), if the last word is on a line by itself, it gets omitted.
                    </li>
                    <li>
                        New Source: <cite>Player's Guide</cite>. This is very preliminary work on supporting the <cite>Player's Guide</cite>. 
                        At the moment, only the new alternate Environments are supported.
                    </li>
                </ul>
                <b>v1.220128</b>
                <ul>
                    <li>Provide a Klingon Starship sheet option.</li>
                </ul>
                <b>v1.220125</b>
                <ul>
                    <li>Minor, cosmetic revisions.</li>
                </ul>
                <b>v1.220123</b>
                <ul>
                    <li>I've re-written some of the starship handling around refits, because I found the old behaviour buggy.
                        One of the side-effects of doing this is that I can now add the Refit field to the final sheet.
                    </li>
                    <li>When listing talents (on the web applcation), I now render the Challenge Dice using the Starfleet delta, in line with the rulebook.</li>
                </ul>
                <b>v1.220119</b>
                <ul>
                    <li>Minor improvements to the TOS character sheets, including initial support for ship outlines.</li>
                </ul>
                <b>v1.220118</b>
                <ul>
                    <li><a href="https://github.com/bcholmes/StarTrek2d20/issues/9" target="_blank" rel="noreferrer">Enhancement:</a> I've
                    created an initial implementation of a 2-page character sheet that displays the full text of the Talents. At the 
                    moment, I consider this a very preliminary implementation. In particular, I don't like the aesthetics of the 
                    final character sheet, and I'll probably end up making a lot of changes, there.</li>
                </ul>
                <b>v1.220115</b>
                <ul>
                    <li>More layout adjustments to Starship creation.</li>
                    <li>Fixed a long-standing bug with <i>Luna</i>-class ships and Mission Pods.</li>
                    <li><a href="https://github.com/bcholmes/StarTrek2d20/issues/11" target="_blank" rel="noreferrer">Enhancement:</a> Allow 
                    user to enter additional traits in the final step of the character creation process.</li>
                    <li>Improvements to the Talent Overview page to display some of the pre-requisite information</li>
                </ul>
                <b>v1.220110</b>
                <ul>
                    <li>Tweaked some screens to get better layout support on phones.</li>
                </ul>
                <b>v1.220103</b>
                <ul>
                    <li>I've upgraded some of the underlying technologies used to build the site. For the most part, I'd expect the  
                        app to behave the same as before, but as with all broad-reaching changes, please let me know if you see  
                        any odd behaviour.
                    </li>
                    <li>I've made a number of revisions to the starship creation process, including adding the ability to create
                        custom spaceframes. If you ever wanted to try out a spaceframe from Continuing Missions, or you had your
                        own stats for a <i>Loknar</i> Class, this update should help you.
                    </li>
                </ul>
                <b>v1.211023</b>
                <ul>
                    <li>Enhancement: Allow an override to starship "end of service" dates.</li>
                </ul>
                <div className="button-container-centered">
                    <div className="button" onClick={ () => this.props.onClose() }>
                        OK
                    </div>
                </div>
            </Modal>
        );
    }

    showNews() {
        this.setState({
            showModal: true
        })
    }
}

export default News;