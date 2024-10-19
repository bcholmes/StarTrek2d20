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
                <b>v1.241019</b>
                <ul>
                    <li>
                        Some bug fixes and starship sheet updates.
                    </li>
                </ul>
                <b>v1.241017</b>
                <ul>
                    <li>
                        Minor bug fix.
                    </li>
                </ul>
                <b>v1.241013</b>
                <ul>
                    <li>
                        Additional minor improvements.
                    </li>
                </ul>
                <b>v1.241005</b>
                <ul>
                    <li>
                        Various bug fixes and internal structure improvements.
                    </li>
                    <li>
                        Improvements to the handling of Supporting Characters. That lead to some structural changes to some
                        sheets -- especially the half-page sheet.
                    </li>
                    <li>
                        Tweaks to the Fantasy Grounds exporter. Someone mentioned wanting NPC exports handled as NPCs.
                    </li>
                </ul>
                <b>v1.240929</b>
                <ul>
                    <li>
                        A number of cosmetic changes and internal improvements.
                    </li>
                </ul>
                <b>v1.240928</b>
                <ul>
                    <li>
                        Tweaks and bug fixes.
                    </li>
                </ul>
                <b>v1.240922</b>
                <ul>
                    <li>
                        More bug fixes and tweaks.
                    </li>
                </ul>
                <b>v1.240921</b>
                <ul>
                    <li>
                        My awkward truth is that I just like tinkering with character sheets. So, I made a new one.
                    </li>
                </ul>
                <b>v1.240920</b>
                <ul>
                    <li>
                        More bug fixes.
                    </li>
                </ul>
                <b>v1.240918</b>
                <ul>
                    <li>
                        A handful of bug fixes.
                    </li>
                </ul>
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