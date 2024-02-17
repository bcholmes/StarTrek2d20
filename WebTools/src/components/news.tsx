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
                <b>v1.240216a</b>
                <ul>
                    <li>
                        A revision to the final step, including changes to the handling of ranks and roles of
                        non-department heads.
                    </li>
                    <li>
                        Solo starship creation now implements a profile button.
                    </li>
                </ul>
                <b>v1.240216</b>
                <ul>
                    <li>
                        A user has contributed some Russian translations. An initial version of that is now incorporated.
                    </li>
                    <li>
                        Solo starships are now supported.
                    </li>
                </ul>
                <b>v1.240209</b>
                <ul>
                    <li>
                        Bug fix.
                    </li>
                </ul>
                <b>v1.240203</b>
                <ul>
                    <li>
                        Most of the updates in this version are fairly invisible (and relate to an upcoming feature).
                        But there are some minor NPC improvements, a few internationalization updates, and some token
                        tweaks.
                    </li>
                    <li>
                        There are a couple of changes to the species selection process. Since the list of species is
                        so long, these days, I've added a search bar. There was also a bug identified on the "Random"
                        drop-down: if you haven't included, say, the Delta Quadrant sourcebook, you shouldn't see
                        the option for getting a random Delta Quadrant species.
                    </li>
                </ul>
                <b>v1.240121</b>
                <ul>
                    <li>
                        I've implemented a minor change to the species selection process: prior to a number of big recent changes,
                        users had a large number of random selection options. I wanted a bit more of a stream-lined experience on this,
                        and I had an idea on how to make that possible, but I knew that there were some pre-requisite things I
                        needed to do first. I've done that, now.
                    </li>
                    <li>
                        One of those prerequisite changes was an upgrade to the library that handles the appearance of the site.
                        Some minor layout changes have happened as a consequence. If you see anything that looks broken, please let
                        me know.
                    </li>
                    <li>
                        I've addedd a few minor options into the token generator.
                    </li>
                </ul>
                <b>v1.240120a</b>
                <ul>
                    <li>
                        One of the changes in the last version included an upgrade of a library that I use to generate PDFs.
                        Unfortunately, that upgrade had a side-effect: ship outlines were being drawn upside-down. I've
                        now reverted that upgrade until I can figure out how to deal with that problem.
                    </li>
                </ul>
                <b>v1.240120</b>
                <ul>
                    <li>
                        I've added a few more options to the token generator: there are a few more species and uniform options. Some
                        are things that have been asked for more than a few times (like TNG-era uniforms) and some are probably
                        pretty esoterric (like Zaranites). I think my artist, Keith Curtis, hit it out of the park with the
                        Suliban and Romulan uniforms especially.</li>
                    <li>
                        I've seen more than a few complaints about the necks/posture in the token generator. I've finally started to address
                        this complaint. It'll take me a while to change all of the art assets, but at the moment, depending on which
                        uniform you specify, you'll get a straighter neck.
                    </li>
                    <li>
                        You may notice some layout changes. I was working on some accessibility analysis, and incorporated some changes
                        recommended by some accessibility tools. Some of that involves tweaks to the layout; some of that involves
                        some minor colour changes. And a bunch of invisibile things. If we believe in infinite diversity, then we
                        need to include accessibility.
                    </li>
                </ul>
                <b>v1.240108</b>
                <ul>
                    <li>A few additional token options.</li>
                    <li>A bug fix for Klingon characters.</li>
                </ul>
                <b>v1.240101</b>
                <ul>
                    <li>More tweaks to NPCs. I consequentially brought in a number of Species from the Continuing Mission site.</li>
                </ul>
                <b>v1.231230</b>
                <ul>
                    <li>Continuing with behind-the-scenes work of minor streamlining and clean-up of the creator in general.</li>
                    <li>Again, more bits of work on the NPC generator.</li>
                </ul>
                <b>v1.231229</b>
                <ul>
                    <li>Another bug was report by ELH, related to Klingon characters, and while testing that out, I noticed a few more Klingon-related glitches.</li>
                    <li>More work on NPCs.</li>
                </ul>
                <b>v1.231227</b>
                <ul>
                    <li>Another bug was report by Felderburg, related to selecting a limited number of sources.</li>
                    <li>I've made some mior revisions to NPC generation, including better support for "special rules".</li>
                    <li>Various internal clean-up activities.</li>
                </ul>
                <b>v1.231224a</b>
                <ul>
                    <li>Turns out I caused an 11th-hour bug. Drat. But thanks for the quick reporting by Phantomaoj.</li>
                </ul>
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

                <div className="text-center">
                    <Button className="btn btn-primary" onClick={ () => this.props.onClose() }>OK</Button>
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