import * as React from 'react';
import {Era, ErasHelper} from '../helpers/eras';
import {Source, SourcesHelper} from '../helpers/sources';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {Window} from '../common/window';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import { context } from '../common/context';

export class EraSelectionPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "";
        }

        character.saveStep(PageIdentity.Era);
    }

    renderSources() {
        let hasUnavailableSources = false;

        const sources = SourcesHelper.getTypes().map(t => {
            const list = SourcesHelper.getSourcesByType(t.type).map((s, i) => {
                hasUnavailableSources = hasUnavailableSources || !s.available;
                const className = s.available ? (context.hasSource(s.id) ? "source source-selected" : "source") : "source unavailable";
                return (
                    <div key={s.id} className={className} onClick={() => { if (s.available) { this.sourceChanged(s.id); } } }>{s.name}</div>
                );
            });
            return (<div>
                <div className="text-white small text-center">{t.name}</div>
                {list}
            </div>)
        });

        const note = hasUnavailableSources ? " Some sources are not yet implemented; check back soon!" : "";

        return (<div>
            <div className="page-text">
                Select sources.
                Ask your GM which are available.
                {note}
            </div>
            <div className="d-flex flex-wrap">
                <div className="source source-emphasis" onClick={() => { this.toggleSources(true); } }>Select All</div>
                <div className="source source-emphasis" onClick={() => { this.toggleSources(false); } }>Select None</div>
            </div>
            <div className="d-flex flex-wrap mt-3 mb-3">
                {sources}
            </div>
        </div>);
    }


    render() {

        const eras = ErasHelper.getEras().map((e, i) => {
            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.eraSelected(e.id); }}>
                    <td className="selection-header">{e.name}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.eraSelected(e.id) }} /></td>
                </tr>
            );
        });

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Character/Starship Creation</li>
                    </ol>
                </nav>
                {this.renderSources()}
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
        if (source === Source.Core) {
            // do nothing
        } else if (context.hasSource(source)) {
            context.removeSource(source);
        } else {
            context.addSource(source);
        }

        this.forceUpdate();
    }

    private toggleSources(selectAll: boolean) {
        if (selectAll) {
            SourcesHelper.getSources().forEach(s => {
                if (s.available) {
                    context.addSource(s.id);
                }
            });
        }
        else {
            SourcesHelper.getSources().forEach(s => {
                context.removeSource(s.id);
            });
        }

        this.forceUpdate();
    }

    private eraSelected(era: Era) {
        context.era = era;
        Navigation.navigateToPage(PageIdentity.ToolSelecton);
    }
}