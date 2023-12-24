import React from 'react';
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
                <b>v1.231224</b>
                <div className="text-white my-3">Sorry, folks. I've been busier than usual with work-related things over the last few months,
                    and I've been working on some fairly
                    large internal changes related to character creation. That's kept me from making some updates for a while. But I
                    should have time to focus on the character creator over the holiday break.
                </div>
                <ul>
                    <li>As mentioned, there are a number of changes to character creation. A big part of this change is an attempt to unify the solo and non-solo character
                        creation experience.
                    </li>
                    <li>Solo characters are now viewable / bookmarkable.</li>
                    <li>mjhawkins sent me a number of spelling fixes! Yay!</li>
                    <li>Support for the <cite>Animated Series</cite> sourcebook is now in place.</li>
                </ul>
                <b>v1.231024</b>
                <ul>
                    <li>A number of non-trivial internal changes have taken place. Some screens might appear different, but mosty the
                        functionality should be the same.
                    </li>
                    <li>Some bug fixes have been implemented.</li>
                </ul>
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