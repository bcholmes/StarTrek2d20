import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Header } from "../components/header";
import { PageIdentity } from "./pageIdentity";
import { withTranslation, WithTranslation } from 'react-i18next';
import LcarsFrame from "../components/lcarsFrame";

interface ICreditsPageProperties extends WithTranslation {
    history: RouteComponentProps["history"];
}

class CreditsPage extends React.Component<ICreditsPageProperties, {}> {

    render() {
        const { t } = this.props;
            return (
                <LcarsFrame activePage={PageIdentity.CreditsPage}>
                    <div id="app">
                        <div className="page container ml-0">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.creditsPage')}</li>
                                </ol>
                            </nav>

                            <Header className="my-4">{t('Page.title.creditsPage')}</Header>
                            <p>
                                Firstly, the <cite>Star Trek Adventures</cite> rules have been created and developed by Modiphius Entertainment. STA is a
                                great game, and Modiphius has been very cool about supporting this character generator (I mean, to some extent, this
                                app makes some of their core rules available for free on the Intertubes). {' '}
                                <a href="https://forums.modiphius.com/u/modiphius-jim/summary" target="_blank" rel="noreferrer">Jim Johnson</a>, for example,
                                the current STA Project Manager, has been unendingly patient with my many irritating questions.
                            </p>

                            <p>Of course, <cite>Star Trek</cite>, itself, is licensed from CBS Studios, Inc., who own the property and trademarks.</p>

                            <p>
                                The original version of this character generator was created by {' '}
                                <a href="https://forums.modiphius.com/u/christoffer/summary" target="_blank" rel="noreferrer">Christoffer</a> {' '}
                                (aka {' '} <a href="https://github.com/azjerei" target="_blank" rel="noreferrer">azjerei</a>). That includes the lion's
                                share of the functionality. Christoffer made this generator into a truly first class tool.
                            </p>

                            <p>
                                Unfortunately, Christoffer no longer had time to devote to this tool, so back around June 2020, {' '}
                                <a href="https://forums.modiphius.com/t/looking-for-developer-to-take-over-the-online-character-tool/11028" target="_blank" rel="noreferrer">he
                                posted a request to the Modiphius forums</a> looking for someone to take over
                                the development. Forum user {' '} <a href="https://forums.modiphius.com/u/misterx/summary" target="_blank" rel="noreferrer">MisterX</a> {' '} was
                                the one who first prompted Christoffer to {' '} <a href="https://github.com/azjerei/StarTrek2d20" target="_blank" rel="noreferrer">open
                                source the code</a> {' '} to make it possible for others to contribute.
                            </p>

                            <p>
                                Since mid-2021, pretty much all of the coding has been done by {' '}
                                <a href="https://blog.bcholmes.org/" target="_blank" rel="noreferrer">BC Holmes</a> {' '}
                                who (according to rumours) is not actually a human but is, instead, a swarm of bees in a trench coat. The bees might be from subspace.
                                We're not sure. They say that if you put your ear veeeery close to the browser while you're building your character, you can
                                hear the faint buzzing.
                            </p>

                            <Header className="my-4" level={2}>Internationalization</Header>
                            <p>
                                Recently, I've started making the app support more languages than just English: initial support for German, Spanish and French exist, but it'll
                                take a bit of time to make the whole app multi-lingual. A few folks have been helpful in this process, including the following:
                            </p>

                            <p className="mx-4"><b>French:</b> <a href="https://forums.modiphius.com/u/betatester/summary" target="_blank" rel="noreferrer">betatester</a></p>
                            <p className="mx-4"><b>German:</b> <a href="https://forums.modiphius.com/u/misterx/summary" target="_blank" rel="noreferrer">MisterX</a>, {' '}
                                <a href="http://www.daniel-joedemann.de/" target="_blank" rel="noreferrer">Daniel Jödemann</a></p>
                            <p>
                                If you can help, let me know, and I'd welcome any input you can provide.
                            </p>

                            <Header className="my-4" level={2}>Token Art</Header>

                            <p>Many of the art images used in the token generator were commissioned from
                                <a href="http://kacurtis.com/" target="_blank" rel="noreferrer">Keith Curtis</a> (no SSL).
                                I've sought out work from Keith multiple times; he's a reliable guy.
                                The terms of the commission allow me to treat these images as open source.
                            </p>

                            <Header className="my-4" level={2}>Asked Questions, Possibly Frequently</Header>

                            <p>
                                <strong>Is this a copy of the official Modiphius app?</strong>
                            </p>

                            <p>
                                The app has never been an "official" Modiphius app. It was originally created by Christoffer with the blessing
                                of Modiphius. It has always been a tool that the community has provided.
                            </p>

                            <p className="mt-5">
                                <strong>Why did the URL change?</strong>
                            </p>

                            <p>
                                I now host the application on my domain because I have access to deploy the app there.
                                I don't really know who owns the modiphiusapps.co.uk website, and the process by which code gets put there
                                has always been a mystery to me. There was a period where my code updates were being merged into the
                                main branch, but nobody was deploying those updates. And players were hungry for the Klingon character
                                support. Eventually I just took matters into my own hands.
                            </p>

                            <p className="mt-5">
                                <strong>What's been changed?</strong>
                            </p>

                            <p>
                                At the high level, the following stuff has been added:
                            </p>

                            <ul>
                                <li>Support for the Klingon Core book has been added.</li>
                                <li>Support for the Player's Guide &mdash; including new character types, talents, roles and lifepath options &mdash; has been added.</li>
                                <li>Additional source books have added new species and talents, including the Discovery Campaign book, the Shackleton Expanse book and more</li>
                                <li>The app can now create a space sector, using rules from the Shackleton Expanse book.</li>
                                <li>You can view characters and starships using a bookmarkable URL, so that you can come back to the character later.</li>
                                <li>Support for a number of different types of character and starship sheets, including some that display the Talent text and
                                    starship sheets that show a visual representation of well-known ship classes.
                                </li>
                                <li>Initial work to support national languages (including French, Spanish and German)</li>
                            </ul>
                            <p>
                                Want more details? You should click on the News item on the left-hand LCARS bar.
                            </p>

                            <p className="mt-5">
                                <strong>I liked it better before</strong>
                            </p>

                            <p>
                                Okay.
                            </p>

                            <p className="mt-5">
                                <strong>What about this great idea I had?</strong>
                            </p>

                            <p>
                                Send me a {' '} <a href="https://docs.github.com/en/pull-requests" target="_blank" rel="noreferrer">PR</a>,
                                or raise a Github issue or start a Github discussion. Or post about it on the Modiphius Forums.
                            </p>

                            <p className="mt-5">
                                <strong>Can I see the code?</strong>
                            </p>

                            <p>
                                It's on {' '} <a href="https://github.com/bcholmes/StarTrek2d20/tree/sta-complete" target="_blank" rel="noreferrer">GitHub</a>.
                                Notice that the majority of the code is on a branch: sta-complete.
                            </p>

                            <p className="mt-5">
                                <strong>Book X came out yesterday; why isn't it reflected in the creator app?</strong>
                            </p>

                            <p>
                                There are two answers: first, Modiphius prefers to wait a bit between the time a new book is available for
                                pre-order and the book's new rules are implemented in the creator. Personally, I think that's entirely reasonable.
                                Second, adding stuff to the generator takes work, and I do it as time allows. I can't always turn new features
                                around immediately.
                            </p>

                            <p className="mt-5">
                                <strong>Aren't you supposed to show some intrusive prompt about cookies? Like, for {' '}
                                <a href="https://en.wikipedia.org/wiki/General_Data_Protection_Regulation" target="_blank" rel="noreferrer">GDPR</a>,
                                and all that?</strong>
                            </p>

                            <p>This site doesn't use cookies, and we don't track you.</p>

                            <p>That includes these considerations:</p>

                            <ul>
                                <li className="text-white">The site does not collect analytics.</li>
                                <li className="text-white">No fonts, images, JavaScript or other things are downloaded from an external server,
                                so there should be no third-party tracking.</li>
                            </ul>

                            <p className="mt-5">
                                <strong>Why isn't there a "Buy Me a Coffee" link?</strong>
                            </p>

                            <p>
                                I can't imagine anything people want less than that.
                            </p>

                            <p className="mt-5">
                                <strong>But how do you make money?</strong>
                            </p>

                            <p>I don't. I'm okay with that. It's a labour of love for me.</p>
                        </div>
                    </div>
                </LcarsFrame>);
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }
}

export default withTranslation()(withRouter(CreditsPage));