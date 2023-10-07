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
                <b>v1.231006</b>
                <ul>
                    <li>A few more token options.</li>
                    <li>More support for some Continuing Missions species options</li>
                    <li>I've made some pretty broad infrastructure changes. I think I've managed to clean up any consequences of that,
                        but if you see anyting hinky, drop me a message.</li>
                </ul>
                <b>v1.230923</b>
                <ul>
                    <li>Another bug fix.</li>
                </ul>
                <b>v1.230921</b>
                <ul>
                    <li>Bug fix.</li>
                </ul>
                <b>v1.230917</b>
                <ul>
                    <li>Starting support for unofficial extensions.</li>
                </ul>
                <b>v1.230915</b>
                <ul>
                    <li>Add in support for random value and focus tables.</li>
                    <li>Some fixes and improvements.</li>
                </ul>
                <b>v1.230911</b>
                <ul>
                    <li>Whoopsie-doodle. Important bug fix.</li>
                </ul>
                <b>v1.230910</b>
                <ul>
                    <li>Initial version of the Captain's Log functionality is now implemented. There are a few random tables (for things like
                        values and focuses) that aren't yet implemented, but I think the majority of character creation is implemented. This
                        required some fairly broad changes to the code, so please report any issues that have popped up.</li>
                    <li>Some new species for the token generator.</li>
                    <li>A few bug fixes that people have reported.</li>
                </ul>
                <b>v1.230820</b>
                <ul>
                    <li>More foundational work as prep for supporting Captain's Log features.</li>
                    <li>New features for the token generator.</li>
                </ul>
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