import React, { useEffect } from "react";
import { connect } from "react-redux";
import { CharacterType } from "../../common/characterType";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { CharacterSheetDialog } from "../../components/characterSheetDialog";
import { Header } from "../../components/header";
import RegistryNumber from "../../components/registryNumberGenerator";
import { marshaller } from "../../helpers/marshaller";
import { CharacterSheetRegistry } from "../../helpers/sheets";
import { setStarshipName, setStarshipRegistry, setStarshipTraits } from "../../state/starshipActions";
import store from "../../state/store";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface IFinalStarshipDetailsPageProperties {
    starship: Starship;
}

const FinalStarshipDetailsPage: React.FC<IFinalStarshipDetailsPageProperties> = ({starship}) => {

    const { t } = useTranslation();

    const renderRegistry = () => {
        if (starship.type === CharacterType.Starfleet) {
            return (<div className="mt-5">

                <Header level={2}>{t('Construct.other.registry')}</Header>
                <ReactMarkdown>{t('FinalStarshipDetails.registry.instruction')}</ReactMarkdown>
                <div className="d-sm-flex align-items-stretch">
                    <label className="textinput-label">{t('Construct.other.registry')}</label>
                    <input
                        type="text"
                        onChange={(ev) => store.dispatch(setStarshipRegistry(ev.target.value)) }
                        value={starship.registry} />
                </div>
            </div>);
        } else {
            return undefined;
        }
    }

    const showViewPage = () => {
        const value = marshaller.encodeStarship(starship);
        window.open('/view?s=' + value, "_blank");
    }

    const showExportDialog = () => {
        CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(starship), "starship", starship);
    }


    useEffect(() => {
        if (starship.type === CharacterType.Starfleet && starship.serviceYear && (starship.registry == null || starship.registry.length === 0)) {
            let registry = RegistryNumber.generate(starship.serviceYear,
                starship.type,
                starship.spaceframeModel);
                store.dispatch(setStarshipRegistry(registry));
        }
    }, []);

    return (<div className="page container ms-0">
            <ShipBuildingBreadcrumbs />
            <Header>{t('Page.title.finalStarshipDetails')}</Header>

            <ReactMarkdown>
                {t('FinalStarshipDetails.instruction')}
            </ReactMarkdown>

            <div className="row">

                <div className="col-lg-6 mt-3 mb-4">
                    <Header level={2}>{t('Construct.other.name')}</Header>
                    <ReactMarkdown>
                        {t('FinalStarshipDetails.name.instruction')}
                    </ReactMarkdown>
                    <div className="d-sm-flex align-items-stretch">
                        <label className="textinput-label">{t('Construct.other.name')}</label>
                        <input
                            type="text"
                            onChange={(ev) => store.dispatch(setStarshipName(ev.target.value)) }
                            value={starship.name} />
                    </div>
                    {renderRegistry()}
                </div>

                <div className="col-lg-6 mt-3">
                    <Header level={2}>{t('Construct.other.traits')}</Header>
                    <ReactMarkdown>
                        {t('FinalStarshipDetails.traits.instruction')}
                    </ReactMarkdown>
                        <ul>
                            {starship.defaultTraits.length > 0
                                ? starship.defaultTraits.map((t, i) => {
                                    return (
                                        <li key={'trait-' + i}>
                                            {t}
                                        </li>
                                    );
                                })
                                : (<li key="no-trait">{t('Common.text.none')}</li>)
                            }
                        </ul>
                    <ReactMarkdown>
                        {t('FinalStarshipDetails.traits.note')}
                    </ReactMarkdown>
                    <textarea className="w-100"
                        rows={8}
                        onChange={(ev) => store.dispatch(setStarshipTraits(ev.target.value)) }
                        onBlur={(ev) => {
                            let temp = ev.target.value.replace(/\n/g, ', ');
                            store.dispatch(setStarshipTraits(temp));
                        } }
                        value={starship.traits} />
                </div>
            </div>

            <div className="starship-panel mt-5">
                <div className="button-container mb-3">
                    <Button className="button-small me-2 mb-2" onClick={() => showExportDialog() } >{t('Common.button.exportPdf')}</Button>
                    <Button className="button-small me-2 mb-2" onClick={() => showViewPage() } >{t('Common.button.view')}</Button>
                </div>
            </div>
        </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
    };
}

export default connect(mapStateToProps)(FinalStarshipDetailsPage);