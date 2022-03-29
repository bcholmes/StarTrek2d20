import * as React from 'react';
import {Era, ErasHelper} from '../helpers/eras';
import {Source, SourcesHelper} from '../helpers/sources';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {Window} from '../common/window';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';

export class EraSelectionPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "";
        }

        character.saveStep(PageIdentity.Era);
    }

    render() {
        let hasUnavailableSources = false;
        const sources = SourcesHelper.getSources().map((s, i) => {
            hasUnavailableSources = hasUnavailableSources || !s.available;
            const className = s.available ? (character.hasSource(i) ? "source source-selected" : "source") : "source unavailable";
            return (
                <div key={i} className={className} onClick={() => { if (s.available) { this.sourceChanged(i); } } }>{s.name}</div>
            );
        });

        const eras = ErasHelper.getEras().map((e, i) => {
            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.eraSelected(e.id); }}>
                    <td className="selection-header">{e.name}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.eraSelected(e.id) }} /></td>
                </tr>
            );
        });

        const note = hasUnavailableSources ? " Some sources are not yet implemented; check back soon!" : "";

        return (
            <div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Character/Starship Creation</li>
                    </ol>
                </nav>

                <div className="page-text">
                    Select sources.
                    Ask your GM which are available.
                    {note}
                </div>
                <div>
                    <div className="source source-emphasis" onClick={() => { this.toggleSources(true); } }>Select All</div>
                    <div className="source source-emphasis" onClick={() => { this.toggleSources(false); } }>Select None</div>
                </div>
                <div className="source-container">
                    {sources}
                </div>
                <div className="page-text mt-5">
                    Select which Era to play in.
                    Ask your GM which Era to choose.
                </div>
                <table className="selection-list">
                    <tbody>
                        {eras}
                    </tbody>
                </table>
            </div>
        );
    }

    private sourceChanged(source: Source) {
        if (character.hasSource(source)) {
            character.removeSource(source);
        }
        else {
            character.addSource(source);
        }

        this.forceUpdate();
    }

    private toggleSources(selectAll: boolean) {
        if (selectAll) {
            SourcesHelper.getSources().forEach(s => {
                if (s.available) {
                    character.addSource(s.id);
                }
            });
        }
        else {
            SourcesHelper.getSources().forEach(s => {
                character.removeSource(s.id);
            });
        }

        this.forceUpdate();
    }

    private eraSelected(era: Era) {
        character.era = era;
        Navigation.navigateToPage(PageIdentity.ToolSelecton);
    }
}