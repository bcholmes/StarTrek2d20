import React from "react";
import { navigateTo } from "../common/navigator";
import { Header } from "../components/header";
import { PageIdentity } from "./pageIdentity";

export class CreditsPage extends React.Component<{}, {}> {

    render() {
        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Credits</li>
                    </ol>
                </nav>

                <Header className="my-4">Credits</Header>
                <p className="page-text">
                    Firstly, the <cite>Star Trek Adventures</cite> rules have been created and developed by Modiphius Entertainment. STA is a 
                    great game, and Modiphius has been very cool about supporting this character generator (I mean, to some extent, this
                    app makes some of their core rules available for free on the Intertubes). 
                    <a href="https://forums.modiphius.com/u/modiphius-jim/summary" target="_blank" rel="noreferrer"> Jim Johnson </a>, for example, 
                    the current STA line editor, has been unendingly patient with my many irritating questions.
                </p>

                <p className="page-text">Of course, <cite>Star Trek</cite>, itself, is licensed from CBS Studios, Inc., who own the property and trademarks.</p>

                <p className="page-text">
                    The original version of this character generator was created by 
                    <a href="https://forums.modiphius.com/u/christoffer/summary" target="_blank" rel="noreferrer"> Chistoffer </a> 
                    (aka <a href="https://github.com/azjerei" target="_blank" rel="noreferrer"> azjerei</a>). That includes the lion's
                    share of the functionality. Christoffer made this generator into a truly first class tool. 
                </p>

                <p className="page-text">
                    Unfortunately, Christoffer no longer had time to devote to this tool, so back around June 2020, 
                    <a href="" target="_blank"> he posted a request to the Modiphius forums</a> looking for someone to take over 
                    the development. Forum user <a href="https://forums.modiphius.com/u/misterx/summary" target="_blank" rel="noreferrer"> Mister X </a> was
                    the one who first prompted Christoffer to <a href="https://github.com/azjerei/StarTrek2d20" target="_blank" rel="noreferrer"> open 
                    source the code</a> to make it possible for others to contribute.
                </p>

                <p className="page-text">
                    Since mid-2021, pretty much all of the coding has been done by 
                    <a href="https://blog.bcholmes.org/" target="_blank" rel="noreferrer"> BC Holmes </a> 
                    who (according to rumours) is not actually a human but is, instead, a swarm of bees in a trench coat. The bees might be from subspace. 
                    We're not sure. They say that if you put your ear veeeery close to the browser while you're building your character, you can
                    hear the faint buzzing.
                </p>

                <Header className="my-4" level={2}>Asked Questions, Possibly Frequently</Header>

                <p className="page-text">
                    <strong>Is this a copy of the official Modiphius app?</strong>
                </p>

                <p className="page-text">
                    The app has never been an "official" Modiphius app. It was originally created by Christoffer with the blessing
                    of Modiphius. It has always been a tool that the community has provided.
                </p>

                <p className="page-text mt-5">
                    <strong>Why did the URL change?</strong>
                </p>

                <p className="page-text">
                    I now host the application on my domain because I have access to deploy the app there.
                    I don't really know who owns the modiphiusapps.co.uk website, and the process by which code gets put there
                    has always been a mystery to me. There was a period where my code updates were being merged into the
                    main branch, but nobody was deploying those updates. And players were hungry for the Klingon character
                    support. Eventually I just took matters into my own hands.
                </p>

                <p className="page-text mt-5">
                    <strong>Why isn't there a "Buy Me a Coffee" link?</strong>
                </p>

                <p className="page-text">
                    I can't imagine anything people want less than that.
                </p>

                <p className="page-text mt-5">
                    <strong>What's been changed?</strong>
                </p>

                <p className="page-text">
                    You should click on the News item on the left-hand LCARS bar.
                </p>

                <p className="page-text mt-5">
                    <strong>I liked it better before</strong>
                </p>

                <p className="page-text">
                    Okay.
                </p>

                <p className="page-text mt-5">
                    <strong>What about this great idea I had?</strong>
                </p>

                <p className="page-text">
                    Send me a PR, or raise a Github issue or start a Github discussion. Or post about it on the Modiphius Forums.
                </p>

            </div>);
    }
}

