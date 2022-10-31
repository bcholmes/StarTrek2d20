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
                <b>v1.221030</b>
                <ul>
                    <li>
                        Another bug fix: this time relating to initial species attributes for Holographic characters.
                    </li>
                </ul>
                <b>v1.221029</b>
                <ul>
                    <li>
                        I'm continuing to add support for the various <cite>Utopia Planitia</cite> rules.
                        In this update, I've worked through the revisions to the spaceframes (e.g. the
                        stats for, say, the <em>Intrepid</em> class are different in <cite>Utopia Planitia</cite>
                        versus the Core rulebook). If you have included <cite>Utopia Planitia</cite> in your
                        list of "Sources", then you'll see these newer, revised stats. If you haven't included it,
                        you'll see the original stats.
                    </li>
                </ul>
                <b>v1.221028</b>
                <ul>
                    <li>Some <a href="https://github.com/bcholmes/StarTrek2d20/discussions/86" target="_blank" rel="noreferrer">feedback
                        items</a> let me know about a couple of bugs, and that lead me to realize that there were some bad
                        transcription errors in the Mission Pods. I think that they should be fixed, now, but as always,
                        let me know if something looks hinky.</li>
                </ul>
                <b>v1.221025</b>
                <ul>
                    <li>Yet another bug fix.</li>
                </ul>
                <b>v1.221024</b>
                <ul>
                    <li>Bug fixes regarding Mission Profiles.</li>
                </ul>
                <b>v1.221023</b>
                <ul>
                    <li>Add the new spaceframes from <cite>Utopia Planitia</cite> and make that sourcebook available so
                        that users can select it.
                        Note, however, that there are some important parts of the <cite>Utopia Planitia</cite> book that
                        are not yet implemented:
                        <ul>
                            <li>alternative stats for previously-published spaceframes;</li>
                            <li>new rules for creating custom spaceframes; and</li>
                            <li>pretty much everything involving Starbases.</li>
                        </ul>
                    </li>
                </ul>
                <b>v1.221016</b>
                <ul>
                    <li>A few minor fixes and improvements, including adding a resistance field to the Klingon starship sheet</li>
                    <li>A number of changes to the Starship generation process, mostly as pre-work for supporting <cite>Utopia Planitia</cite>.</li>
                </ul>
                <b>v1.220917</b>
                <ul>
                    <li>By popular request (well... one person requested it) I've created a 2-page Klingon character sheet.</li>
                </ul>
                <b>v1.220910</b>
                <ul>
                    <li>Some small improvements to the sector generation system, including preliminary work on a
                        PDF export feature.
                    </li>
                </ul>
                <b>v1.220909</b>
                <ul>
                    <li>A few internal changes relating to Starship generation. You probably won't notice them.</li>
                    <li>Per an enhancement request, I've added a random "registry number" generator. At the moment, there aren't a ton
                        of constraints implemented. But the <cite>Utopia Planitia</cite> book has some guidance for what the registry
                        numbers should look like; I'll flesh that out as I add more <cite>Utopia Planitia</cite> support.
                    </li>
                    <li>A problem I've long been obsessed with: generating a reasonable idea of the primary world orbit. We pretty much always want
                        the primary world to be in a system's "garden zone"/ecosphere, but with all the randomness in the system generation rules,
                        that's been hard to guarantee. I think I have an algorithm for that, now. I've also been steadily fleshing out the
                        data associated with generated worlds.</li>
                </ul>
                <b>v1.220906</b>
                <ul>
                    <li>Two bug fixes: one related to the scale of the Vor'Cha class and one relating to the talents for Efrosians.</li>
                    <li>I've been doing some (not yet visible) work to support the new <cite>Utopia Planetia</cite> sourcebook. Some
                        long-standing questions have been resolved by <cite>Utopia Planetia</cite>, including a hotly-debated question of whether
                        or not the Luna class is meant to have a mission pod. The answer is yes, and this version of the code recognizes that.</li>
                    <li>Jim posted a correction, on the Modiphius forums, for the "inner worlds" table of the <cite>Shackleton Expanse</cite> {' '}
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