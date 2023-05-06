
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import LcarsFrame from '../components/lcarsFrame';
import { PageIdentity } from '../pages/pageIdentity';
import { Header } from '../components/header';
import { Button } from '../components/button';
import { Canvg, presets } from 'canvg'
import UniformSelectionView from './view/uniformSelectionView';
import SpeciesSelectionView from './view/speciesSelectionView';
import { TokenSvgBuilder } from './tokenSvgBuilder';
import { Token } from './model/token';
import { connect } from 'react-redux';
import { CheckBox } from '../components/checkBox';

declare function download(bytes: any, fileName: any, contentType: any): any;

enum Tab {
    Species,
    Body,
    Head,
    Mouth,
    Nose,
    Eyes,
    Hair,
    Extras
}

interface ITokenCreationPageProperties extends WithTranslation {
    token: Token;
}

interface ITokenCreationPageState {
    tab: Tab;
    rounded: boolean;
    bordered: boolean;
}

class TokenCreationPage extends React.Component<ITokenCreationPageProperties, ITokenCreationPageState> {

    constructor(props) {
        super(props);
        this.state = {
            tab: Tab.Species,
            rounded: false,
            bordered: false
        }
    }

    render() {
        const { t, token } = this.props;
        const { tab, rounded, bordered } = this.state;
        const svg = TokenSvgBuilder.createSvg(token, rounded, bordered && rounded);

        return (<LcarsFrame activePage={PageIdentity.TokenCreationPage}>
                <div id="app">

                    <div className="page container ml-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.tokenCreationPage')}</li>
                            </ol>
                        </nav>

                        <Header>{t('Page.title.tokenCreationPage')}</Header>

                        <div className="row">

                            <div className="col-lg-4 mt-4">
                                <div className="mw-100" style={{width: "400px", aspectRatio: "1" }} dangerouslySetInnerHTML={{ __html: svg }}>

                                </div>

                                <div className="mt-3">
                                    <CheckBox value="rounded" isChecked={rounded}
                                        onChanged={(val) => { this.setState((state) => ({...state, rounded: !state.rounded })) }}
                                        text="Rounded" />
                                </div>
                                <div>
                                    <CheckBox value="fancy" isChecked={bordered && rounded}
                                        onChanged={(val) => { this.setState((state) => ({...state, bordered: !state.bordered })) }}
                                        text="Bordered" disabled={ !rounded } />
                                </div>
                            </div>

                            <div className="col-lg-8 mt-4">
                                <div className="btn-group w-100" role="group" aria-label="Avatar part types">
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Species ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Species)}>Species</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Body ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Body)}>Body</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Head ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Head)}>Head</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Mouth ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Mouth)}>Mouth</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Nose ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Nose)}>Nose</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Eyes ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Eyes)}>Eyes</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Hair ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Hair)}>Hair</button>
                                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === Tab.Extras ? "active" : "")}
                                        onClick={() => this.selectTab(Tab.Extras)}>Extras</button>
                                </div>
                                {this.renderTab()}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button buttonType={true} className='btn btn-primary btn-sm' onClick={() => this.exportPng()}>{t('Common.button.export')}</Button>
                        </div>
                    </div>
                </div>
            </LcarsFrame>)
    }

    selectTab(tab: Tab) {
        this.setState((state) => ({...state, tab: tab}));
    }

    renderTab() {
        switch (this.state.tab) {
            case Tab.Species:
                return (<SpeciesSelectionView />);
            case Tab.Body:
                return (<UniformSelectionView />);
            default:
                return (<div className="mt-4"><p>Not yet available.</p></div>);
        }
    }

    async toPng(data) {
        const preset = presets.offscreen();
        const {
          width,
          height,
          svg
        } = data
        const canvas = new OffscreenCanvas(width, height)
        const ctx = canvas.getContext('2d')
        const v = await Canvg.from(ctx, svg, preset)

        // Render only first frame, ignoring animations and mouse.
        await v.render()

        const blob = await canvas.convertToBlob();
        return blob.arrayBuffer();
    }

    exportPng() {
        this.toPng({
            width: 400,
            height: 400,
            svg: TokenSvgBuilder.createSvg(this.props.token, this.state.rounded, this.state.bordered && this.state.rounded)
        }).then((png) => {

            download(png, "token.png", "image/png");

        });
    }

}

function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(TokenCreationPage));