import * as React from 'react';

interface INewsProperties {
    showModal: boolean;
    onClose: () => void;
}

class News extends React.Component<INewsProperties, {}> {

    render() {
        return (
            <div id="news" className={this.props.showModal ? "dialog-visible": "dialog-hidden" }>
                {this.renderNews()}
            </div>
        );
    }

    renderNews() {
        return (
            <div>   
                <div className="dialog-bg"></div>
                <div className="dialog-container dialog-container-visible dialog-container-lg" style={{ textAlign: 'left' }}>
                    <b>WHAT'S NEW? (v1.211023)</b>
                    <ul>
                        <li>Enhancement: Allow an override to starship "end of service" dates.</li>
                    </ul>
                    <b>v1.211022</b>
                    <ul>
                        <li>Enhancement: add support for more ship outlines (notably the Olympic and Sydney class).</li>
                        <li>Bug: Data corrections for Klingon spaceframes.</li>
                        <li>Enhancement: Allow users to specify non-Klingon races when creating Klingon Warrior characters.</li>
                    </ul>
                    <b>v1.211018</b>
                    <ul>
                        <li><a href="https://github.com/bcholmes/StarTrek2d20/issues/10" target="_blank" rel="noreferrer">Enhancement:</a> 
                            Automatically add the 'Augmented' trait when the character has an Augmented Ability talent.</li>
                    </ul>
                    <b>v1.211016</b>
                    <ul>
                        <li>I'm experimenting with revisions to the Starship character sheet. You probably won't notice any difference.</li>
                        <li><a href="https://github.com/bcholmes/StarTrek2d20/issues/7" target="_blank" rel="noreferrer">Bug:</a> 
                            retore the accept/reject indicator on character sheets.</li>
                    </ul>
                    <b>v1.211008</b>
                    <ul>
                        <li>Incorporate the IDW Year Five Sourcebook</li>
                        <li>Bug fixes: Some minor bugs have been fixed (if you choose Homeworld as the environment, it would be blank on the character
                            sheet, and the damage calculation for phasers was slightly off.
                        </li>
                    </ul>
                    <b>v1.211003</b>
                    <ul>
                        <li>Bug fix: The Resolute talent wasn't being factored into the Stress calculation.</li>
                    </ul>
                    <b>v1.211002</b>
                    <ul>
                        <li>Initial support for Klingon spaceframes / starships.</li>
                    </ul>
                    <b>v1.210927</b>
                    <ul>
                        <li>Bug fix: The app would stop working if you tried to use the History widget to navigate to an earlier page.</li>
                    </ul>
                    <b>v1.210922</b>
                    <ul>
                        <li>Bug fix: re-tool the starship PDF generation, because the original site is offline.</li>
                    </ul>
                    <b>v1.210918</b>
                    <ul>
                        <li>Support for TOS character sheets.</li>
                        <li>Fixed a bug on the supporting character while trying to export to PDF.</li>
                        <li>Restore the weapons list to the exported PDF</li>
                        <li>Better support for Klingon supporting characters.</li>
                    </ul>
                    <b>v1.210917</b>
                    <ul>
                        <li>Added support for the Shackleton Expanse book (new species and Talents).</li>
                    </ul>
                    <div className="button-container-centered">
                        <div className="button" onClick={ () => this.props.onClose() }>
                            OK
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    showNews() {
        this.setState({
            showModal: true
        })
    }
}

export default News;