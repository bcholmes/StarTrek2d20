import { connect } from "react-redux";
import { Starship } from "../../common/starship";
import { starshipMapStateToProperties } from "./soloCharacterProperties";
import SoloStarshipBreadcrumbs from "../component/soloStarshipBreadcrumbs";
import { Header } from "../../components/header";
import { useTranslation } from "react-i18next";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import store from "../../state/store";
import { setStarshipName, setStarshipRegistry, setStarshipTraits } from "../../state/starshipActions";
import { useEffect, useState } from "react";
import RegistryNumber from "../../components/registryNumberGenerator";
import { CharacterType } from "../../common/characterType";
import ReactMarkdown from "react-markdown";
import { PageIdentity } from "../../pages/pageIdentity";
import { LoadingButton } from "../../common/loadingButton";

interface ISoloStarshipFinalProperties {
    starship: Starship;
}

const SoloStarshipFinalPage: React.FC<ISoloStarshipFinalProperties> = ({starship}) => {

    const { t } = useTranslation();
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        if (!starship?.registry) {
            store.dispatch(setStarshipRegistry(RegistryNumber.generate(starship.serviceYear, CharacterType.Starfleet, starship.spaceframeModel)))
        }
    } , []);


    const showDialog = () => {
        setLoadingExport(true);
        import(/* webpackChunkName: 'export' */ '../../components/characterSheetDialog').then(({CharacterSheetDialog}) => {
            import(/* webpackChunkName: 'export' */ '../../helpers/sheets').then(({CharacterSheetRegistry}) => {
                setLoadingExport(false);

                setTimeout(() => {
                    let s = store.getState().starship?.starship;
                    CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(s), "sta-solo-starship", s);
                }, 200);
            });
        });
    }

    return (<div className="page container ms-0">
        <SoloStarshipBreadcrumbs pageIdentity={PageIdentity.SoloStarshipFinish} />
        <Header>{t('Page.title.finalStarshipDetails')}</Header>

        <ReactMarkdown>{t('FinalStarshipDetails.instruction')}</ReactMarkdown>

        <div className="row">

            <div className="col-lg-6 mt-3 mb-4">
                <Header level={2}>{t('Construct.other.name')}</Header>
                <ReactMarkdown>{t('FinalStarshipDetails.name.instruction')}</ReactMarkdown>
                <div className="d-sm-flex align-items-stretch">
                    <InputFieldAndLabel id="name" labelName={t('Construct.other.name')}
                        onChange={(name) => {store.dispatch(setStarshipName(name))}} value={starship?.name ?? ""} />
                </div>

                <div className="d-sm-flex align-items-stretch">
                    <InputFieldAndLabel id="registry" labelName={t('Construct.other.registry')}
                        onChange={(registry) => {store.dispatch(setStarshipRegistry(registry))}} value={starship?.registry ?? ""} />
                </div>

            </div>

            <div className="col-lg-6 mt-3">
                <Header level={2}>Traits</Header>
                <ReactMarkdown>{t('FinalStarshipDetails.traits.instruction')}</ReactMarkdown>
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
                <ReactMarkdown>{t('FinalStarshipDetails.traits.note')}</ReactMarkdown>

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

        <div className="button-container mb-5">
            <LoadingButton loading={loadingExport} className="button-small me-2" onClick={() => showDialog() } >{t('Common.button.exportPdf')}</LoadingButton>
        </div>

    </div>);
}

export default connect(starshipMapStateToProperties)(SoloStarshipFinalPage);