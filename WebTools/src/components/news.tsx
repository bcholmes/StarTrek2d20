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
                <b>v1.220906</b>
                <ul>
                    <li>Two bug fixes: one related to the scale of the Vor'Cha class and one relating to the talents for Efrosians.</li>
                    <li>I've been doing some (not yet visible) work to support the new <cite>Utopia Planetia</cite> sourcebook. Some
                        long-standing questions have been resolved by <cite>Utopia Planetia</cite>, including a hotly-debated question of whether
                        or not the Luna class is meant to have a mission pod. The answer is yes, and this version of the code recognizes that.</li>
                    <li>Jim posted a correction, on the Modiphius forums, for the "inner worlds" table of the <cite>Shackleton Expanse</cite> 
                        (in the printed book, the inner worlds table is a repeat of the outer worlds table.) I've plonked that table into 
                        the system generator.</li>
                    <li>I continue to add more spaceframe outlines.</li>
                </ul>
                <b>v1.220805</b>
                <ul>
                    <li>Minor bug fixes.</li>
                </ul>
                <b>v1.220726</b>
                <ul>
                    <li>More spaceframe outline revisions</li>
                    <li>Minor formatting changes.</li>
                    <li>Some prep for the Picard Crew book.</li>
                </ul>
                <b>v1.220703</b>
                <ul>
                    <li>Some additional spaceframe outline revisions</li>
                    <li>Minor work improving the star sector functionality.</li>
                </ul>
                <b>v1.220626</b>
                <ul>
                    <li>Now supporting the <cite>Discovery Campaign</cite> sourcebook.</li>
                    <li>More revisions to spaceframe outlines.</li>
                </ul>
                <b>v1.220609</b>
                <ul>
                    <li>Bug fix related to Nebula-class spaceframes.</li>
                    <li>Minor changes to spaceframe outlines.</li>
                </ul>
                <b>v1.220526</b>
                <ul>
                    <li>A few tweaks to some of the reference information.</li>
                    <li>Fixed <a href="https://github.com/bcholmes/StarTrek2d20/issues/63" target="_blank" rel="noreferrer">a 
                    bug report</a> regarding Klingon character generation.</li>
                </ul>
                <b>v1.220506</b>
                <ul>
                    <li>I've started working on a star sector generator based on the rules in the <cite>Shackleton Expanse</cite> book.
                    At the moment, I consider the support to be <em>very</em> preliminary.</li>
                </ul>
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
                    <li>Add support for the <i>Archer</i> Class ship from the <cite>Tricorder Set</cite>.</li>
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