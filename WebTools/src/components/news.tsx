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
                <b>v1.240819</b>
                <ul>
                    <li>A small number of minor fixes.</li>
                    <li>An A4 character sheet.</li>
                </ul>
                <b>v1.240818</b>
                <ul>
                    <li>A very preliminary version of character creation for 2nd Edition. Fuller and better support still
                        to come.
                    </li>
                    <li>Importantly, starship creation has not yet been updated. So there's that.</li>
                </ul>
                <b>v1.240706</b>
                <ul>
                    <li>A bit more work on the random starship generator.</li>
                    <li>A few new spaceframes from <cite>Continuing Mission</cite>.</li>
                </ul>
                <b>v1.240623</b>
                <ul>
                    <li>Minor updates.</li>
                </ul>
                <b>v1.240621</b>
                <ul>
                    <li>Add translation to a few pages that weren't translating.</li>
                </ul>
                <b>v1.240616</b>
                <ul>
                    <li>I tracked down a layout bug I would periodically see on the 2e Starship sheet, where the
                        talents wouldn't quite render correctly.
                    </li>
                    <li>Minor token updates</li>
                    <li>Translations!</li>
                </ul>
                <b>v1.240615</b>
                <ul>
                    <li>A handful of mostly cosmetic changes.</li>
                    <li>A few additional translations.</li>
                </ul>
                <b>v1.240607</b>
                <ul>
                    <li>Another round of French and Spanish translations.</li>
                    <li>I've adjusted the Roll20 export for Starships to export them as usable sheets, rather than just handouts.</li>
                </ul>
                <b>v1.240603</b>
                <ul>
                    <li>Even more French and Spanish translations.</li>
                </ul>
                <b>v1.240602</b>
                <ul>
                    <li>Some additional French and Spanish translations.</li>
                    <li>Minor improvements to the Starship export for Roll20.</li>
                </ul>
                <b>v1.240601</b>
                <ul>
                    <li>A handful of smaller updates: export starships for Roll20, a new Safety checklist based on
                        the <cite>Federation-Klingon War</cite> book, and other bits.</li>
                </ul>
                <b>v1.240524</b>
                <ul>
                    <li>Incorporate some feedback items.</li>
                </ul>
                <b>v1.240520</b>
                <ul>
                    <li>Minor character sheet updates.</li>
                </ul>
                <b>v1.240519</b>
                <ul>
                    <li>New starship sheet.</li>
                </ul>
                <b>v1.240518</b>
                <ul>
                    <li>Minor revisions.</li>
                </ul>
                <b>v1.240512</b>
                <ul>
                    <li>The big new thing is that I've converted the one-page TNG Landscape PDF to better support
                        non-English languages.
                    </li>
                </ul>
                <b>v1.240505</b>
                <ul>
                    <li>I'm experimenting with a new type of character sheet: one of the limitations of the existing
                        character sheet system is that the PDFs are (mostly) hard-coded as English (in the sense that
                        when the sheet as a heading that says "Attributes", that text doesn't change if you're a
                        German user). So I'm trying out a more dynamically-generated sheet. Not gonna lie:
                        this is a lot more complicated. The new sheet is a simple sheet for supporting characters.
                        At the moment, the sheet that I'm creating isn't especially form-based; I'm sure some folks will
                        hate that because they like really like editability. Again: this is an experiment at the moment
                        to try out some new programming patterns.
                    </li>
                </ul>
                <b>v1.240430</b>
                <ul>
                    <li>Minor, mostly non-visible changes.</li>
                </ul>
                <b>v1.240428</b>
                <ul>
                    <li>Minor bug fixes.</li>
                    <li>Additional translations.</li>
                    <li>A bit of under-the-covers prep for 2nd edition (based on the little information that we currently have).</li>
                </ul>
                <b>v1.240414</b>
                <ul>
                    <li>Some minor token revisions.</li>
                </ul>
                <b>v1.240413</b>
                <ul>
                    <li>
                        I've added the ability to export characters for Roll20. Roll20 doesn't appear to have a
                        built-in import/export utility (which I find weird), but Detaaz pointed me at the {' '}
                        <a href="https://justas-d.github.io/roll20-enhancement-suite/index.html" target="_blank" rel="noreferrer">VTT Enhancement Suite</a>,
                        which allows this ability. At the moment, only standard character sheets are supported.
                        I should be able to provide ship and NPC sheets in a later update.
                    </li>
                </ul>
                <b>v1.240408</b>
                <ul>
                    <li>
                        Bug fix. (Thanks, StarRider!)
                    </li>
                </ul>
                <b>v1.240407</b>
                <ul>
                    <li>
                        Minor internal changes and some small token-related changes.
                    </li>
                </ul>
                <b>v1.240404</b>
                <ul>
                    <li>
                        I had a recent contribution of Brazilian Portuguese translation for the app.
                    </li>
                </ul>
                <b>v1.240329</b>
                <ul>
                    <li>
                        Some additional tweaks to the token generator.
                    </li>
                    <li>
                        Initial support for the <cite>Federation-Klingon War</cite> book.
                    </li>
                    <li>
                        Minor NPC updates.
                    </li>
                </ul>
                <b>v1.240323</b>
                <ul>
                    <li>
                        The primary change is in the token generator. I posted a poll on Farcebook recently, asking
                        which uniform I should support next. The result was overwhelmingly in favour of the {' '}
                        <cite>Strange New Worlds</cite> uniform. Not gonna lie: this uniform has a few complicated bits,
                        but I think I have a reasonable first version in place.
                        <div className="mt-2">
                        There are some notes I should probably make: at the moment, I'm only supporting the V-neck
                        version of the uniform. Although we primarily see M'Benga and Chapel wearing variants (M'Benga's
                        medical tunic/smock and Chapel's nursing jumpsuit), they do wear the V-necks when they
                        take part in landing teams. See the episodes, "All Those Who Wander" and "Hegemony," for example.
                        In the future, I'll support variants for the medical smock, nursing jumpsuit and, or course, the
                        skant.
                        </div>
                        <div className="mt-2">
                        The second big issue is related to ranks. I think the show isn't terribly consistent about how it
                        represents ranks. So, I ended up making a wild swing at rank insignia that's in line with
                        how <cite>TOS</cite> represents ranks.
                        </div>
                    </li>
                    <li>
                        Some additional improvements have been made with respect to national languages, thanks to a
                        code contribution.
                    </li>
                </ul>
                <b>v1.240316</b>
                <ul>
                    <li>
                        Some minor revisions to the system generation tool, including addressing one bug.
                    </li>
                    <li>
                        A few additional options for token generation.
                    </li>
                </ul>
                <b>v1.240309</b>
                <ul>
                    <li>
                        Still more minor improvements.
                    </li>
                </ul>
                <b>v1.240308</b>
                <ul>
                    <li>
                        More minor improvements and bug fixes.
                    </li>
                </ul>
                <b>v1.240306</b>
                <ul>
                    <li>
                        Minor tweaks and bug fixes.
                    </li>
                </ul>
                <b>v1.240305</b>
                <ul>
                    <li>
                        An excellent contribution from Hanzo and LoranRendel fixed a problem with Cyrillic characters in exported PDFs. One of the
                        effects of this update is that PDF files now use a different font (one with broader international character support).
                        The new font takes up a bit more space for the descender, and the net effect is that the overall font size is smaller.
                        I've tweaked some of the character sheets to make the text fields larger to compensate.
                    </li>
                </ul>
                <b>v1.240303</b>
                <ul>
                    <li>
                        A number of updates for token generation. New species! New uniforms!
                    </li>
                    <li>
                        Minor internal tweaks, and prep for new books.
                    </li>
                </ul>
                <b>v1.240228</b>
                <ul>
                    <li>
                        Some small, mostly-invisible revisions.
                    </li>
                    <li>
                        A bug fix for some talent text.
                    </li>
                </ul>
                <b>v1.240218</b>
                <ul>
                    <li>
                        Additional Russian translation.
                    </li>
                    <li>
                        A few minor token updates.
                    </li>
                </ul>
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