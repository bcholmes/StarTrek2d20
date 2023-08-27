import { useTranslation } from "react-i18next";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { SpeciesHelper } from "../../helpers/species";
import { connect } from "react-redux";
import { Species } from "../../helpers/speciesEnum";
import { makeKey } from "../../common/translationKey";
import { Attribute } from "../../helpers/attributes";
import { Window } from "../../common/window";
import { Button } from "../../components/button";


const SoloSpeciesPage = ({era: Era}) => {

    const selectSpecies = (species: Species) => {

    }

    const { t } = useTranslation();

    let speciesList = SpeciesHelper.getCaptainsLogSpecies();
    let speciesRows = speciesList.map((s,i) => {
        const attributes = s.id === Species.Ktarian
            ? (
                <div key={'species-' + s.id}>
                    <div>{t('Construct.attribute.control')}</div>
                    <div>{t('Construct.attribute.reason')}</div>
                    <div>Fitness or Presence</div>
                </div>
            )
            : s.attributes.map((a, i) => {
                return <div key={i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
            });

        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) selectSpecies(s.id); }}>
                <td className="selection-header">{s.localizedName}</td>
                <td>{attributes}</td>
                <td className="text-right"><Button buttonType={true} className="button-small"onClick={() => { selectSpecies(s.id) }} >{t('Common.button.select')}</Button></td>
            </tr>
        );
    });

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.species')}</li>
                </ol>
            </nav>
            <Header>{t('Page.title.species')}</Header>
            <p className="mt-3">
                {t('SoloSpeciesPage.instruction')}
            </p>

            <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {speciesRows}
                    </tbody>
                </table>
        </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era
    };
}



export default connect(mapStateToProps)(SoloSpeciesPage);