import * as React from 'react';
import { Button } from './button';
import Modal from './modal';

interface INewsProperties {
    showModal: boolean;
    onClose: () => void;
}

class News extends React.Component<INewsProperties, {}> {

    render() {
        return (
            <Modal size="lg" show={this.props.showModal} onClose={() => this.props.onClose()} header="What's New?">
                <b>v1.230812</b>
                <ul>
                    <li>A few extra options on the Token Generator.</li>
                </ul>
                <b>v1.230806</b>
                <ul>
                    <li>Minor tweaks.</li>
                </ul>
                <b>v1.230805</b>
                <ul>
                    <li>A few more lower decks options</li>
                </ul>
                <b>v1.230804</b>
                <ul>
                    <li>Lower Decks spaceframes</li>
                    <li>Small improvements to Token generation (particularly enlisted uniforms for Monster Maroon uniforms).</li>
                    <li>Michael Prangenberg contributed some improvements to the Foundry VTT export.</li>
                </ul>
                <b>v1.230728</b>
                <ul>
                    <li>Lower Decks! Lower Decks!</li>
                </ul>
                <b>v1.230716</b>
                <ul>
                    <li>A few bug fixes related to Starships.</li>
                    <li>Minor revisions to tokens.</li>
                    <li>Some prep for Captain's Log support.</li>
                </ul>
                <b>v1.230705</b>
                <ul>
                    <li>A number of additional updates to the token generator.</li>
                </ul>
                <b>v1.230624</b>
                <ul>
                    <li>German translation has been pretty active, lately, and this update includes more German.</li>
                    <li>I've heard you: you want Monster Maroon uniforms.</li>
                </ul>
                <b>v1.230618</b>
                <ul>
                    <li>This fix contains some minor changes to the Token Generator. Don't worry, bigger updates are coming down the pipe soon.</li>
                </ul>
                <b>v1.230611</b>
                <ul>
                    <li>Some cosmetic improvements to the Token Generator.</li>
                </ul>
                <b>v1.230610</b>
                <ul>
                    <li>A bug fix.</li>
                    <li>The mostly non-visible changes I've talked about recently are now visible. In short, I've added a basic token creator
                        to the app, to create character tokens. The initial version is limited, but support for more options are
                        underway. Special thanks to <a href="http://kacurtis.com/" target="_blank" rel="noreferrer">Keith Curtis</a> for
                        the art assets.
                    </li>
                </ul>
                <b>v1.230604</b>
                <ul>
                    <li>Minor, mostly non-visible changes.</li>
                </ul>
                <b>v1.230603</b>
                <ul>
                    <li>Added a new version of the Romulan character sheet, created and updated by Felderburg.</li>
                    <li>Added a new spaceframe &mdash; I finally sourced a model of the Gagarin class.</li>
                </ul>
                <b>v1.230511</b>
                <ul>
                    <li>More non-visible changes.</li>
                </ul>
                <b>v1.230507</b>
                <ul>
                    <li>The changes in this version aren't really visible; it's mostly some set-up for a future feature.</li>
                </ul>
                <b>v1.230506</b>
                <ul>
                    <li>A few minor cosmetic tweaks.</li>
                </ul>
                <b>v1.230423</b>
                <ul>
                    <li>Small changes to the NPC Generator.</li>
                    <li>Some additional German translation.</li>
                </ul>
                <b>v1.230422</b>
                <ul>
                    <li>Very minor tweaks and improvements.</li>
                </ul>
                <b>v1.230410</b>
                <ul>
                    <li>VTT Export now supports characters in Fantasy Grounds format. At the moment, all characters are treated as
                        "Main" characters, as far as loading them in to Fantasy Grounds is concerned (the import format for
                        NPC characters is slightly different). Starships are not currently supported.
                    </li>
                </ul>
                <b>v1.230408</b>
                <ul>
                    <li>Some additional work on NPCs and VTT Export.</li>
                </ul>
                <b>v1.230405</b>
                <ul>
                    <li>I've elaborated the VTT support so that I can support exporting starships to Foundry.</li>
                    <li>Some spelling fixes.</li>
                </ul>
                <b>v1.230402</b>
                <ul>
                    <li>Minor revisions inspired by the Foundry VTT changes.</li>
                    <li>Bug fixes.</li>
                </ul>
                <b>v1.230401</b>
                <ul>
                    <li>Initial experimental work to support exporting characters to virutal table tops.
                        At the moment, only Foundry VTT is supported. I'll get around to others in the future.</li>
                </ul>
                <b>v1.230331</b>
                <ul>
                    <li>Bug fixes.</li>
                    <li>Minor enhancements to NPC generation.</li>
                </ul>
                <b>v1.230328</b>
                <ul>
                    <li>Added a Romulan character sheet designed by Felderburg.</li>
                    <li>More French translation.</li>
                </ul>
                <b>v1.230326</b>
                <ul>
                    <li>I've added a new 2-page character sheet, with some player helper text.</li>
                </ul>
                <b>v1.230324</b>
                <ul>
                    <li>More work on translations.</li>
                    <li>Some revisions to the way that translation files get loaded.</li>
                    <li>One or two new spaceframe outlines.</li>
                </ul>
                <b>v1.230320</b>
                <ul>
                    <li>More bug fixes.</li>
                </ul>
                <b>v1.230319</b>
                <ul>
                    <li>A bunch more German translations.</li>
                    <li>A few subtle bug fixes.</li>
                    <li>As the translation files have been growing quite a bit, I'm at a place where I want to load the translations on-demand,
                        rather than automatically load all languages for all people. It's hard to imagine anyone using more than 2 languages
                        (if you include English as a fall-back), so there's no point in having all languages available for all people.</li>
                </ul>
                <b>v1.230318</b>
                <ul>
                    <li>Minor bug fixes.</li>
                </ul>
                <b>v1.230316</b>
                <ul>
                    <li>A couple of minor enhancements.</li>
                    <li>Still more tweaks to the NPC Generator and the Sector Generator.</li>
                    <li>Some additional German translations.</li>
                </ul>
                <b>v1.230312</b>
                <ul>
                    <li>More tweaks to the NPC Generator and the Sector Generator.</li>
                </ul>
                <b>v1.230227</b>
                <ul>
                    <li>A few more updates to both the NPC Generator and the Star System PDF Exporter.</li>
                </ul>
                <b>v1.230226</b>
                <ul>
                    <li>More fleshing out of the NPC generator.</li>
                    <li>I've made some internal changes to the PDF generation for star systems. It's probably not
                        something you'd notice, though.</li>
                </ul>
                <b>v1.230222</b>
                <ul>
                    <li>Some improvements to the NPC generator.</li>
                </ul>
                <b>v1.230220</b>
                <ul>
                    <li>A few minor enhancements.</li>
                    <li>I've broken up the app into some sub-parts. What does that mean? Well, for a while, the
                        process of "building" the application has complained to me about the app being very large
                        (although I haven't really noticed any problem loading the application). Now, I'm trying to
                        trim down the size of the main application, and load in optional portions as needed. You
                        might notice more "loading" indicators &mdash; for example, some buttons might briefly
                        display a spinner while some part of the application is loading.
                    </li>
                    <li>The primary motivation for handling the above relates to adding a quick utility for
                        creating NPCs, which introduced a non-trivial amount of data. At the moment, NPC
                        generation is fairly basic; I'll add more functionality later.
                    </li>
                </ul>
                <b>v1.230208</b>
                <ul>
                    <li>Two minor bug fixes.</li>
                </ul>
                <b>v1.230205</b>
                <ul>
                    <li>More revisions to the sector generator.</li>
                    <li>Minor revisions to the landscape character sheet.</li>
                </ul>
                <b>v1.230204</b>
                <ul>
                    <li>Minor revisions to the sector generator.</li>
                    <li>Support for Normal Milestones in the modify flow.</li>
                    <li>Some revisions to the standard character sheet.</li>
                </ul>

                <div className="text-center">
                    <Button buttonType={true} className="btn btn-primary" onClick={ () => this.props.onClose() }>OK</Button>
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