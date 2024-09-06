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
                <b>v1.240906</b>
                <ul>
                    <li>
                        Additional support for 2nd edition starships.
                    </li>
                    <li>
                        Minor bug fixes.
                    </li>
                </ul>
                <b>v1.240905</b>
                <ul>
                    <li>
                        I think I have all the Starship support from the 2nd edition core rulebook (but have not
                        yet integrated the additional bits from the GM's tookit).
                    </li>
                    <li>
                        I've added some extra 2nd edition support for supporting characters.
                    </li>
                </ul>
                <b>v1.240904</b>
                <ul>
                    <li>More work on 2nd edition starship support.</li>
                </ul>
                <b>v1.240903</b>
                <ul>
                    <li>Minor updates and bug fixes.</li>
                </ul>
                <b>v1.240902</b>
                <ul>
                    <li>Preliminary support for 2nd-edition starships. There's still a bit of work to do on
                        weapons and mission profiles, and I don't yet support Service Records.
                    </li>
                </ul>
                <b>v1.240831</b>
                <ul>
                    <li>Support for the new character sheet. I've had to make some tweaks to the original
                        character sheet, both to support internationalization and to deal with some features
                        (like rich text) that my PDF library does not support.
                    </li>
                </ul>
                <b>v1.240825</b>
                <ul>
                    <li>Minor improvements and fixes to some of the PDF sheets.</li>
                </ul>
                <b>v1.240824</b>
                <ul>
                    <li>Some bug fixes.</li>
                    <li>Better 2nd edition support for Fantasy Grounds and Foundry exports.</li>
                </ul>
                <b>v1.240821</b>
                <ul>
                    <li>A few more minor fixes.</li>
                </ul>
                <b>v1.240820</b>
                <ul>
                    <li>More minor fixes.</li>
                </ul>
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