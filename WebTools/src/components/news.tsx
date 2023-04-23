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