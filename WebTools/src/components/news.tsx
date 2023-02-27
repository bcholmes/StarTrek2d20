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
                <b>v1.230124</b>
                <ul>
                    <li>Some internal changes relating to sources. The creator should remember your preferences on sources.</li>
                    <li>Initial work on modification of characters. This is very preliminary, and has some key limitations at the moment.</li>
                    <li>Accepted a contribution to allow "Dominion" to be a Government type and Allied Military type for players who want to play Dominion characters.</li>
                </ul>
                <b>v1.230115</b>
                <ul>
                    <li>A few more bug fixes.</li>
                    <li>More translation work, especially for French support.</li>
                </ul>
                <b>v1.230114</b>
                <ul>
                    <li>More translation work and minor bug fixes.</li>
                </ul>
                <b>v1.230113</b>
                <ul>
                    <li>More testing with the star system diagram made me aware of a couple of minor bugs in the sector creation rules.
                        Those bugs should now be resolved.</li>
                </ul>
                <b>v1.230112</b>
                <ul>
                    <li>Some improvements to the star system page.</li>
                </ul>
                <b>v1.230111</b>
                <ul>
                    <li>PDF export bug fix.</li>
                </ul>
                <b>v1.230109</b>
                <ul>
                    <li>Additional French translations.</li>
                    <li>Minor navigation fix involving the credits page.</li>
                </ul>
                <b>v1.230108</b>
                <ul>
                    <li>Today's updates are mostly behind-the-scenes, but one visible change is the redesign of the final page of the
                        character creation workflow; it had become something of an ugly page, and I wanted to improve it.</li>
                    <li>Also &mdash; you guessed it &mdash; translation stuff.</li>
                </ul>
                <b>v1.230107</b>
                <ul>
                    <li>Another translation pass. Over time, we'll add more and more national language capability.</li>
                    <li>I've added a bit of support for custom species. At the moment, that doesn't mean much other than "you can type the name of a species".</li>
                </ul>
                <b>v1.230101</b>
                <ul>
                    <li>Happy New Year! I've finally gotten around to expanding the PDF export functionality for sectors, so that
                        you can now get all of the system data as well.</li>
                </ul>
                <b>v1.221231</b>
                <ul>
                    <li>Again, I'm still plugging away on translation</li>
                    <li>I've retooled a particular Starship page because someone raised a concern about hover events and misbehaviour on a touch device.</li>
                    <li>I've introduced a mechanism to download characters as JSON files. This is probably not helpful to you unless you're a developer.
                        But it could assist integration between the Character Creator and other gaming tools like Virtual Table Tops. You can access
                        the download function from the view page for a character.</li>
                </ul>
                <b>v1.221230</b>
                <ul>
                    <li>More work on translations, plus a few minor updates.</li>
                </ul>
                <b>v1.221229</b>
                <ul>
                    <li>I've revised some internal page handling so that particular URLs are more straight-forwardly accessible (for
                        example, <a href="https://sta.bcholmes.org/talents" rel="noreferrer" target="_blank">this link</a> opens up the
                        talents page).</li>
                    <li>I continue to work on the <a href="https://sta.bcholmes.org/gmtracker" rel="noreferrer" target="_blank">sekrit
                        new feature</a>. Don't click on that link! Anything could happen.</li>
                </ul>
                <b>v1.221228</b>
                <ul>
                    <li>I've started working on a new feature that's not yet visible. The changes are mostly internal.</li>
                </ul>
                <b>v1.221227</b>
                <ul>
                    <li>Make it possible for non-English users to revert to using the site in English, if they wish to.</li>
                    <li>Add more support for viewing pages in other languages. It'll take a while before the majority of
                        pages are translated. And because I'm using automated translation methods, the translations might
                        not be perfect; I welcome all corrections.
                    </li>
                </ul>
                <b>v1.221226</b>
                <ul>
                    <li>Initial ground work for supporting national Languages.</li>
                </ul>
                <b>v1.221224</b>
                <ul>
                    <li>Minor bug fixes.</li>
                </ul>
                <b>v1.221213</b>
                <ul>
                    <li>Minor improvements to the sector mapping copy-to-clipboard function.</li>
                </ul>
                <b>v1.221210</b>
                <ul>
                    <li>Modiphius recently updated their PDF sheets for characters and starships. I'd previously brought in the
                        new sheets for the Klingon starship, but I've also made revisions for the TOS Starship and TNG Starship sheets.
                        My versions of the sheets aren't identical to the Modiphius versions for various complicated reasons, but the
                        new versions are fairly consistent with the published versions. At the moment, this only relates to Starship sheets;
                        character sheets will follow at a later time.
                    </li>
                    <li>An important change in the sheets is that "Special Rules" &mdash; a concept that's now more formalized in <cite>Utopia
                        Planitia</cite> &mdash; have their own place on the sheet, rather than being mixed in with the list of talents. I've
                        updated the Starship view screen to replicate this behaviour.</li>
                    <li>I've addressed a few improvement requests.</li>
                </ul>
                <b>v1.221207</b>
                <ul>
                    <li>Some revisions to the Klingon Starship sheet, in line with some updates to the standard character sheets.</li>
                </ul>
                <b>v1.221206</b>
                <ul>
                    <li>More bug fixes.</li>
                </ul>
                <b>v1.221205</b>
                <ul>
                    <li>Minor bug fixes.</li>
                </ul>
                <b>v1.221202</b>
                <ul>
                    <li>Some look-and-feel changes to some starship pages and the supporting character page.</li>
                    <li>A bug fix for starship creation and build points.</li>
                    <li>Minor changes to system generation.</li>
                </ul>
                <b>v1.221129</b>
                <ul>
                    <li>Some more revisions to the starship creation process.</li>
                    <li>Minor bug fixes.</li>
                </ul>
                <b>v1.221120</b>
                <ul>
                    <li>I've revised the handling of custom spaceframes to be in line with the rules from Utopia Planitia.
                        This change has revised the flow of starships with custom frames to be more in line with, say, the
                        small craft flow. The main starship flow will eventually converge on this style as well.
                    </li>
                </ul>
                <b>v1.221117</b>
                <ul>
                    <li>An important bug was reported. This update should fix that.</li>
                    <li>I've upgraded a bunch of tools/dependencies that are used to create this app. I hit a couple of hiccups along
                        the way, but there's always a fear that there's some hiccup in the code that I didn't spot and therefore haven't fixed.
                        If something doesn't appear to working correctly, please send some feedback.
                    </li>
                </ul>
                <b>v1.221113</b>
                <ul>
                    <li>There are a couple of talents that give characters extra focuses. The app will now prompt you for those
                        extra focuses.
                    </li>
                </ul>
                <b>v1.221108</b>
                <ul>
                    <li>A number of bug reports have been addressed.</li>
                </ul>
                <b>v1.221106</b>
                <ul>
                    <li>A minor wording bug has been fixed for Cybernetically-enhanced Individuals.</li>
                    <li>There's now a view page for main characters.</li>
                </ul>
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