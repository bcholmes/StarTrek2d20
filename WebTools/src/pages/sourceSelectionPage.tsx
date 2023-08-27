import * as React from 'react';
import {Source, SourcesHelper} from '../helpers/sources';
import {character} from '../common/character';
import {Navigation, navigateTo} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import store from '../state/store';
import { addSource, removeSource, setSources } from '../state/contextActions';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Window } from '../common/window';
import { Button } from '../components/button';
import { PageFactory } from './pageFactory';
import { LoadingButton } from '../common/loadingButton';

interface ISourceSelectionPageProperties extends WithTranslation {
    sources: Source[]
}

interface ISourceSelectionPageState {
    soloLoading: boolean;
}

class SourceSelectionPage extends React.Component<ISourceSelectionPageProperties, ISourceSelectionPageState> {
    constructor(props: ISourceSelectionPageProperties) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "";
        }

        character.saveMemento(PageIdentity.SourceSelection);
        this.state = {
            soloLoading: false
        }
    }

    renderSources() {
        const { t } = this.props;
        let hasUnavailableSources = false;

        const sources = SourcesHelper.getTypes().map(t => {
            const list = SourcesHelper.getSourcesByType(t.type).map((s, i) => {
                hasUnavailableSources = hasUnavailableSources || !s.available;
                const className = s.available ? (this.hasSource(s.id) ? "source source-selected" : "source") : "source unavailable";
                return (
                    <div key={s.id} className={className} onClick={() => { if (s.available) { this.sourceChanged(s.id); } } } title={s.localizedName}>{s.localizedName}</div>
                );
            });
            return (<div key={'source-type-' + t.type}>
                <div className="text-white small text-center" style={{overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.localizedName}</div>
                {list}
            </div>)
        });

        const note = hasUnavailableSources ? (<p>{t('SourceSelectionPage.sourceNote')}</p>)  : undefined;

        return (<div>
            <p>
                {t('SourceSelectionPage.sourceInstruction')}
            </p>
            {note}
            <div className="d-flex flex-wrap">
                <div className="source source-emphasis" onClick={() => { this.toggleSources(true); } }>{t('Common.button.selectAll')}</div>
                <div className="source source-emphasis" onClick={() => { this.toggleSources(false); } }>{t('Common.button.selectNone')}</div>
            </div>
            <div className="d-flex flex-wrap mt-3 mb-3">
                {sources}
            </div>
        </div>);
    }


    render() {
        const { t } = this.props;

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.sourceSelection')}</li>
                    </ol>
                </nav>
                {this.renderSources()}
                <p className="mt-5">
                    {t('SourceSelectionPage.gameTypeInstruction')}
                </p>
                <table className="selection-list">
                    <tbody>
                        <tr onClick={() => { if (Window.isCompact()) this.selectStandardRules(); }}>
                            <td className="selection-header">{t('SourceSelectionPage.standardGameType')}</td>
                            <td className="text-right"><Button buttonType={true} className="btn btn-sm btn-primary" text={t('Common.button.select')} onClick={() => { this.selectStandardRules() }} /></td>
                        </tr>
                        <tr onClick={() => { if (Window.isCompact() && this.hasSource(Source.CaptainsLog)) this.selectSoloRules(); }}>
                            <td className="selection-header">{t('SourceSelectionPage.soloGameType')}</td>
                            <td className="text-right">
                                <LoadingButton loading={this.state.soloLoading} className="btn-sm"  onClick={() => { this.selectSoloRules() }}
                                    enabled={this.hasSource(Source.CaptainsLog)} >{t('Common.button.select')}</LoadingButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    selectStandardRules() {
        Navigation.navigateToPage(PageIdentity.Era);
    }

    selectSoloRules() {
        this.setState((state) => ({...state, soloLoading: true}));
        PageFactory.instance.loadCaptainsLogFactory(() => {
                this.setState((state) => ({...state, soloLoading: false}));
                Navigation.navigateToPage(PageIdentity.SoloConstructType);
            }
        )
    }

    private sourceChanged(source: Source) {
        if (source === Source.Core) {
            // do nothing
        } else if (this.hasSource(source)) {
            store.dispatch(removeSource(source));
        } else {
            store.dispatch(addSource(source));
        }
    }

    private toggleSources(selectAll: boolean) {
        if (selectAll) {
            let sources = SourcesHelper.getSources().filter(s => s.available).map(s => s.id);
            store.dispatch(setSources(sources));
        } else {
            store.dispatch(setSources([ Source.Core ]));
        }
    }

    hasSource(source: Source) {
        return this.props.sources.indexOf(source) > -1 || source === Source.Core;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        sources: state.context.sources
    };
}

export default connect(mapStateToProps)(withTranslation()(SourceSelectionPage));